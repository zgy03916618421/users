var mongoose = require('mongoose');

/**
 * Created by Administrator on 15-3-2.
 */
var parse = require('co-busboy');
var path = require('path');
var fs = require('fs');
var md5 = require('MD5');
var config = require('../../../config/config');

function *getCode(code){
    var code_exist = yield S.InvitationService.findOne({code:code});
    if(Tools.isNotEmpty(code_exist)){
        yield getCode(Tools.getInvitationCode());
    }else{
        return code;
    }
}
/**
 * 第三方登陆
 * @resourcePath /Third
 * @summary 第三方登陆
 * @path /yuedu/userinfo/v3/user/third_login
 * @method put
 * @param {string|name=type|paramType=form|description=第三方类型|required=true}
 * @param {string|name=openid|paramType=form|description=openid|required=true}
 * @param {string|name=user_name|paramType=form|description=用户名|required=true}
 * @param {string|name=avatar|paramType=form|description=头像}
 * @param {string|name=email|paramType=form|description=email}
 */
exports.thirdLogin = function *(){
    var body = yield bodyParse(this);
    var type = body.type;
    var openid = body.openid;                   //或者充当于微博userid
    var user_name = body.user_name;
    var avatar = body.avatar;
    var email = body.email;
    var createtime = Date.now();
    //传参判空
    if(Tools.isEmpty(type)){
        yield this.body = {'head':{code: 1000,msg:'类型不能为空'}};
        return;
    }
    if(Tools.isEmpty(openid)){
        yield this.body = {'head':{code: 1000,msg:'openid不能为空'}};
        return;
    }
    if(Tools.isEmpty(user_name)){
        yield this.body = {'head':{code: 1000,msg:'用户名不能为空'}};
        return;
    }
    var third_rs = yield S.ThirdService.findByOpenId(openid);
    var token =  md5(openid + new Date().valueOf());
    var token_key = RedisKeys.USER_TOKEN_OPENID + openid;
    var user_key = RedisKeys.USER_MSG_TOKEN + token;
    redis.set(user_key,JSON.stringify(third_rs));
    redis.set(token_key,token);
    //redis.expire(user_key,120*60);
    //redis.expire(token_key,120*60);
    //首次第三方登录 进行快速注册
    if(Tools.isEmpty(third_rs)){
        var third = E.third();
        third.type = type;
        third.openid =  openid;
        third.user_name = user_name;
        third.avatar =  avatar == undefined? '' : avatar;
        third.user_id = md5(new Date().valueOf());
        third.uuid = md5(new Date().valueOf());
        third.createtime = new Date().valueOf();
        third.updatetime = new Date().valueOf();
        var doc = yield S.ThirdService.save(third);
        var userext = E.userext();
        userext.user_id = third.user_id;
        userext.user_name = third.user_name;
        userext.avatar = third.avatar;
        yield S.UserextService.save(userext);
        yield this.body = {head:{code: 200,msg:'success'},data:third,token:token};
    }else{
        if(Tools.isNotEmpty(third_rs.mobile_number)){
            var user = yield S.UserService.getByMobileNumber(third_rs.mobile_number);
            if(Tools.isNotEmpty(user)){
                redis.set(user_key,JSON.stringify(user));
                redis.set(token_key,token);
                //redis.expire(user_key,120*60);
                //redis.expire(token_key,120*60);
                user = Tools.base_info(user);
                yield this.body = {head:{code: 200,msg:'success'},data:user,token:token};
            }else{
                yield this.body = {head:{code: 200,msg:'success'},data:third_rs,token:token};
            }
        }else{
            yield this.body = {head:{code: 200,msg:'success'},data:third_rs,token:token};
        }
    }
}

/**
 * 第三方登陆绑定
 * @resourcePath /Third
 * @summary 第三方登陆绑定
 * @path /yuedu/userinfo/v3/user/third_bind
 * @method put
 * @param {string|name=user_id|paramType=form|description=用户ID|required=true}
 * @param {string|name=openid|paramType=form|description=openid|required=true}
 * @param {string|name=other_openid|paramType=form|description=需要绑定的第三方OPENID}
 * @param {string|name=mobile_number|paramType=form|description=需要绑定的手机号}
 */
exports.third_bind = function*(){
    try{
        var body = yield bodyParse(this);
        var user_id =  body.user_id;
        var openid = body.openid;                   //或者充当于微博userid
        var other_openid = body.other_openid;
        var mobile_number = body.mobile_number;
        if(Tools.isEmpty(user_id)){
            yield this.body = {'code':'1','message':'用户ID不能为空'};
            return;
        }
        if(Tools.isEmpty(openid)){
            yield this.body = {'code':'1','message':'openid不能为空'};
            return;
        }
        if(Tools.isEmpty(mobile_number) && Tools.isEmpty(other_openid)){
            yield this.body = {'code':'1','message':'手机号或者其他第三方openid不能为空'};
            return;
        }
        var third_rs = yield S.ThirdService.findByOpenId(openid);
        if(Tools.isEmpty(third_rs)){
            yield this.body = {'code':'1','message':'第三方用户信息不存在'};
            return;
        }else{
            if(Tools.isNotEmpty(mobile_number)){
                var user = yield S.UserService.getByMobileNumber(mobile_number);
                if(Tools.isEmpty(user)){
                    var user = {
                        user_id: third_rs.user_id,
                        user_name:third_rs.user_name,
                        email: '',
                        mobile_number: mobile_number,
                        user_agent : this.get('User-Agent'),
                        avatar : third_rs.avatar,
                        create_time : new Date().valueOf(),
                        client_ip : this.host,
                        app_id : this.session.auth_user
                    }
                    yield S.UserService.save(user);
                    third_rs.mobile_number = mobile_number;
                    yield S.ThirdService.save(third_rs);
                    var userext = yield S.UserextService.getByUserId(third_rs.user_id);
                    if(Tools.isNotEmpty(userext)){
                        userext.mobile_number = mobile_number;
                        yield S.UserextService.save(userext);
                    }
                    yield this.body = {'code':'0','message':'success','user':third_rs};
                }else{
                    yield this.body = {'code':'500','message':'此用户账号不能为绑定'};
                }
            }else{
                var other_third = yield S.ThirdService.findByOpenId(other_openid);
                if(Tools.isNotEmpty(other_third)){
                    other_third.userid = user_id;
                    yield S.ThirdService.save(other_third);
                    yield this.body = {'code':'0','message':'success','user':other_third};
                }else{
                    var third_msg = E.third();
                    third_msg.type = other_type;
                    third_msg.uuid = uuid;
                    third_msg.openid = openid;
                    third_msg.username = username;
                    third_msg.avatar = avatar;
                    third_msg.originalopenid = originalopenid;
                    third_msg.createtime = Date.now();
                    var rs = yield S.ThirdService.save(third_msg);
                    yield this.body = {'code':'0','message':'success','user':third_msg};
                }
            }
        }
    }catch (err){
        console.log(err);
        yield this.body = {'code':'1','message':'操作失败'};
    }
}
/**
 * 注册
 * @resourcePath /User
 * @summary 注册
 * @path /yuedu/userinfo/v3/user
 * @method post
 * @param {string|name=mobile_number|paramType=form|description=手机号码|required=true}
 * @param {string|name=password|paramType=form|description=密码|required=true}
 * @param {string|name=user_name|paramType=form|description=用户名required=true}
 * @param {string|name=avatar|paramType=form|description=头像}
 * @param {string|name=sex|paramType=form|description=性别}
 * @param {string|name=invitated_code|paramType=form|description=邀请码}
 * @param {string|name=recommend_msg|paramType=form|description=推荐信息}
 * @param {number|name=sort|paramType=form|description=推荐排序}
 * @param {string|name=vip|paramType=form|description=VI等级}
 */
exports.register = function *(){
    var body = yield bodyParse(this);
    var mobile_number = body.mobile_number;
    var password = body.password;
    var user_name = body.user_name;
    var avatar = body.avatar;
    var sex =  body.sex;
    var invitated_code = body.invitation_code;
    var recommend_msg = body.recommend_msg;
    var sort = body.sort;
    var app_id = this.session.auth_user;
    var user_agent =  this.get('User-Agent');
    var client_ip = this.ip;
    var vip = body.vip;
    //验证上传判断
    if(Tools.isEmpty(mobile_number)){
        yield this.body = {'head':{code: 1000,msg:'手机号不能为空'}};
        return;
    }
    if(Tools.isEmpty(user_name)){
        yield this.body = {'head':{code: 1000,msg:'用户名不能为空'}};
        return;
    }
    if(Tools.isEmpty(password)){
        yield this.body = {'head':{code: 1000,msg:'密码不能为空'}};
        return;
    }
    if(Tools.isNotEmpty(invitated_code)){
        var invitated = yield S.InvitationService.findOne({code:invitated_code.toUpperCase()});
        if (!invitated) {
            this.body = {'head':{code: 1000,msg:'邀请码无效'}};
            return;
        }
    }
    if (!avatar) {
        if (sex === 'female') {
            avatar = 'http://7xj2i2.com2.z0.glb.qiniucdn.com/avatar_female.png';
        } else {
            avatar = 'http://7xj2i2.com2.z0.glb.qiniucdn.com/avatar_male.png';
        }
    }
    var user = yield S.UserService.getByMobileNumber(mobile_number);
    if(Tools.isNotEmpty(user)){
        yield this.body = {'head':{'code':1004,msg:'手机号已被注册'}};
    }else{
        var user = E.user();
        password = md5(mobile_number+password);
        user.mobile_number = mobile_number;
        user.password = password;
        user.user_name = user_name;
        user.user_id = user._id;
        user.avatar = avatar;
        user.app_id = app_id;
        user.user_agent = user_agent;
        user.client_ip = client_ip;
        user = Tools.setBaseFields(user);
        var invitation_code = yield getCode(Tools.getInvitationCode());
        var userext = E.userext();
        userext.user_id = user.user_id;
        userext.mobile_number = mobile_number;
        userext.user_name = user_name;
        userext.avatar = avatar;
        userext.sex = sex;
        userext.invitated_code = invitated_code;
        userext.invitation_code = invitation_code;
        userext.vip = vip;
       /* var ab_strategy = Tools.getABStrategy();
        var a_count = yield S.UserextService.count({ab_strategy:'A'});
        var b_count = yield S.UserextService.count({ab_strategy:'B'});
        if(a_count == 0 && b_count == 0){
            userext.ab_strategy = 'A';
        }else if(a_count>b_count){
            userext.ab_strategy = 'B';
        }else{
            userext.ab_strategy = 'A';
        }*/
        //是否有推荐信息
        if(recommend_msg){
            userext.recommend_msg = recommend_msg;
            if(Tools.isNotEmpty(sort)){
                userext.sort = sort;
            }
        }
        userext = Tools.setBaseFields(userext);
        yield S.UserService.save(user);
        yield S.UserextService.save(userext);
        user = Tools.base_info(userext);
        var invitation = E.invitation();
        invitation.user_id = user.user_id;
        invitation.user_name = user.user_name;
        invitation.code = invitation_code;
        invitation.origin_count = 999;
        invitation.count = 999;
        yield S.InvitationService.save(invitation);
        if(Tools.isNotEmpty(invitated_code)){
            var invitated = yield S.InvitationService.findOne({code:invitated_code.toUpperCase()});
            if(invitated.count>0){
                invitated.count --;
                yield S.InvitationService.save(invitated);
            }
        }
        yield this.body = {'head':{code: 200,msg:'success'},data:user};
        //邀请LOG
        if (Tools.isNotEmpty(invitated_code)) {
            var invitationlog = E.invitationlog();
            invitationlog.code = invitated_code;
            invitationlog.mobile_number = mobile_number;
            invitationlog = Tools.setBaseFields(invitationlog);
            S.InvitationlogService.saveAsync(invitationlog);
            S.FollowService.followInvitationer(invitated_code,user.user_id);
        }
        //默认关注
        S.FollowService.saveDefaultAsync(user.user_id);
        //注册环信
        var saveUser = function(user_id){
            return function(cb){
                S.UserService.saveEaseUser(user_id,cb);
            }
        };
        try{
            yield saveUser(user.user_id);
        }catch(err){
            console.log(err)
        }

    }
}

exports.registerByEmail = function *(){
    var body = yield bodyParse(this);
    var email = body.email;
    var password = body.password;
    var user_name = body.user_name;
    var avatar = body.avatar;
    var sex =  body.sex;
    var invitated_code = body.invitation_code;
    var recommend_msg = body.recommend_msg;
    var sort = body.sort;
    var app_id = this.session.auth_user;
    var user_agent =  this.get('User-Agent');
    var client_ip = this.ip;
    var vip = body.vip;
    var type = body.type;
    //验证上传判断
    if(Tools.isEmpty(email)){
        yield this.body = {'head':{code: 1000,msg:'邮箱不能为空'}};
        return;
    }
    if(Tools.isEmpty(password)){
        yield this.body = {'head':{code: 1000,msg:'密码不能为空'}};
        return;
    }
    if(Tools.isNotEmpty(invitated_code)){
        var invitated = yield S.InvitationService.findOne({code:invitated_code.toUpperCase()});
        if (!invitated) {
            this.body = {'head':{code: 1000,msg:'邀请码无效'}};
            return;
        }
    }
    if (!avatar) {
        if (sex === 'female') {
            avatar = 'http://7xj2i2.com2.z0.glb.qiniucdn.com/avatar_female.png';
        } else {
            avatar = 'http://7xj2i2.com2.z0.glb.qiniucdn.com/avatar_male.png';
        }
    }
    var user = yield S.UserService.getByEmail(email);
    if(Tools.isNotEmpty(user)){
        yield this.body = {'head':{'code':1004,msg:'邮箱已被注册'}};
    }else{
        var user = E.user();
        password = md5(email+password);
        user.email = email;
        user.password = password;
        user.user_name = user_name;
        user.user_id = user._id;
        user.avatar = avatar;
        user.app_id = app_id;
        user.user_agent = user_agent;
        user.client_ip = client_ip;
        user.type = type;
        user = Tools.setBaseFields(user);
        var invitation_code = yield getCode(Tools.getInvitationCode());
        var userext = E.userext();
        userext.user_id = user.user_id;
        userext.email = email;
        userext.user_name = user_name;
        userext.avatar = avatar;
        userext.sex = sex;
        userext.invitated_code = invitated_code;
        userext.invitation_code = invitation_code;
        userext.vip = vip;
        userext.type = type;
       /* var ab_strategy = Tools.getABStrategy();
        var a_count = yield S.UserextService.count({ab_strategy:'A'});
        var b_count = yield S.UserextService.count({ab_strategy:'B'});
        if(a_count == 0 && b_count == 0){
            userext.ab_strategy = 'A';
        }else if(a_count>b_count){
            userext.ab_strategy = 'B';
        }else{
            userext.ab_strategy = 'A';
        }*/
        //是否有推荐信息
        if(recommend_msg){
            userext.recommend_msg = recommend_msg;
            if(Tools.isNotEmpty(sort)){
                userext.sort = sort;
            }
        }
        userext = Tools.setBaseFields(userext);
        yield S.UserService.save(user);
        yield S.UserextService.save(userext);
        user = Tools.base_info(userext);
        var invitation = E.invitation();
        invitation.user_id = user.user_id;
        invitation.user_name = user.user_name;
        invitation.code = invitation_code;
        invitation.origin_count = 999;
        invitation.count = 999;
        yield S.InvitationService.save(invitation);
        if(Tools.isNotEmpty(invitated_code)){
            var invitated = yield S.InvitationService.findOne({code:invitated_code.toUpperCase()});
            if(invitated.count>0){
                invitated.count --;
                yield S.InvitationService.save(invitated);
            }
        }
        yield this.body = {'head':{code: 200,msg:'success'},data:user};
        //邀请LOG
        if (Tools.isNotEmpty(invitated_code)) {
            var invitationlog = E.invitationlog();
            invitationlog.code = invitated_code;
            invitationlog.mobile_number = mobile_number;
            invitationlog = Tools.setBaseFields(invitationlog);
            S.InvitationlogService.saveAsync(invitationlog);
            S.FollowService.followInvitationer(invitated_code,user.user_id);
        }
        //默认关注
        S.FollowService.saveDefaultAsync(user.user_id);
        //注册环信
        var saveUser = function(user_id){
            return function(cb){
                S.UserService.saveEaseUser(user_id,cb);
            }
        };
        try{
            yield saveUser(user.user_id);
        }catch(err){
            console.log(err)
        }

    }
}

/**
 * 登陆
 * @resourcePath /User
 * @summary 登陆
 * @path /yuedu/userinfo/v3/user/{mobile_number}/{password}
 * @method get
 * @param {string|name=mobile_number|paramType=path|description=手机号码|required=true}
 * @param {string|name=password|paramType=path|description=密码|required=true}
 */
exports.login = function *(){
    var mobile_number = this.params.mobile_number;
    var password = this.params.password;
    if(Tools.isEmpty(mobile_number)){
        yield this.body = {'head':{'code':1000,msg:'手机号不能为空'}};
        return;
    }
    if(Tools.isEmpty(password)){
        yield this.body = {'head':{'code':1000,msg:'密码不能为空'}};
        return;
    }
    var user = yield S.UserService.getByMobileNumber(mobile_number);
    if(Tools.isEmpty(user)){
        yield this.body = {'head':{'code':1005,msg:'用户不存在'}};
    }else{
        password = md5(mobile_number+password);
        if(password == user.password){
            user = yield S.UserextService.getByMobileNumber(mobile_number);
            if(Tools.isNotEmpty(user)){
                var token =  md5(mobile_number + password + new Date().valueOf());
                var token_key = RedisKeys.USER_TOKEN_MOBILE_NUMBER + mobile_number;
                var user_key = RedisKeys.USER_MSG_TOKEN + token;
                redis.set(user_key,JSON.stringify(user));
                redis.set(token_key,token);
                //redis.expire(user_key,120*60);
                //redis.expire(token_key,120*60);
                user = Tools.base_info(user);
                user.token = token;
                this.body = {'head':{code: 200,msg:'success'},data:user, token: token};
                if(Const.MESSAGE_MOBILE_NUMBERS.indexOf(mobile_number)>-1){
                    MessageUtils.sendForAppleUser(mobile_number,function(err,rs){
                        if(!err){
                            console.log(rs.body)
                        }
                    });
                }
            }else{
                yield this.body = {'head':{'code':1005,msg:'用户不存在'}};
            }
        }else{
            yield this.body = {'head':{code: 1002,msg:'用户或密码错误'}};
        }
    }
}


/**
 * 更新
 * @resourcePath /User
 * @summary 更新
 * @path /yuedu/userinfo/v3/user
 * @method post
 * @param {string|name=type|paramType=form|description=操作类型(change_passowrd|update_msg)|required=true}
 * @param {string|name=mobile_number|paramType=form|description=手机号码|required=true}
 * @param {string|name=password|paramType=form|description=密码|required=true}
 * @param {string|name=oldpassword|paramType=form|description=旧密码}
 * @param {string|name=user_name|paramType=form|description=用户名}
 * @param {string|name=avatar|paramType=form|description=头像}
 * @param {string|name=sex|paramType=form|description=性别}
 * @param {string|name=location|paramType=form|description=地区}
 * @param {string|name=validate_code|paramType=form|description=邀请码}
 */
exports.update = function *(){
    var body = yield bodyParse(this);
    var type = body.type;
    var password = body.password;
    var oldpassword = body.oldpassword;
    var user_name = body.user_name;
    var avatar = body.avatar;
    var mobile_number = body.mobile_number;
    var sex =  body.sex;
    var location = body.location;
    var validate_code = body.validate_code;
    if(Tools.isEmpty(mobile_number) && Tools.isEmpty(validate_code)){
        yield this.body = {'head':{'code':1000,msg:'手机号不能为空'}};
        return;
    }
    if(Tools.isEmpty(type)){
        yield this.body = {'head':{'code':1000,msg:'类型不能为空'}};
        return;
    }
    var user = yield S.UserService.getByMobileNumber(mobile_number);
    if(type == 'change_password'){
        //密码不能为空
        if(Tools.isEmpty(password)){
            yield this.body = {'head':{'code':1000,msg:'password can not be empty'}};
            return;
        }
        if(Tools.isNotEmpty(validate_code)){
            var validata_last = yield S.ValidateService.getLastByMobileNumber(mobile_number);
            if(validata_last.validate_code == validate_code){
                user.password = md5(mobile_number+password);
                var rs = yield S.UserService.update(user);
                if(rs.err){
                    yield this.body = {'head':{code: 2001,msg:'更新操作失败'}};
                }else{
                    user = Tools.base_info(user);
                    yield this.body = {'head':{code: 200,msg:'success'},data:user};
                }
            }else{
                yield this.body = {'head':{code: 1002,msg:'验证码错误'}};
            }
        }else{
            if(Tools.isEmpty(oldpassword)){
                yield this.body = {'head':{'code':1000,msg:'旧密码不能为空'}};
                return;
            }
            oldpassword = md5(mobile_number+oldpassword);
            if(oldpassword == user.password){
                user.password = md5(mobile_number+password);
                var rs = yield S.UserService.update(user);
                if(rs.err){
                    yield this.body = {'head':{code: 2001,msg:'保存失败'}};
                }else{
                    user = Tools.base_info(user);
                    yield this.body = {'head':{code: 200,msg:'success'},data:user};
                }
            }else{
                yield this.body = {'head':{code: 1002,msg:'账号或密码错误'}};
            }
        }
    }else{
        //修改用户信息
        var userext = yield S.UserextService.getByMobileNumber(mobile_number);
        if(Tools.isEmpty(userext)){
            userext = E.userext();
            userext.mobile_number = mobile_number;
            userext.user_id = user.user_id;
            userext.avatar =  avatar;
            userext.sex =  sex;
            userext.location =  location;
            userext.createtime = new Date().valueOf();
        }
        userext.updatetime = new Date().valueOf();
        if(Tools.isNotEmpty(avatar)){
            userext.avatar = avatar;
            user.avatar = avatar;
        }
        if(Tools.isNotEmpty(user_name)){
            user.user_name = user_name;
            userext.user_name = user_name;
        }
        if(Tools.isNotEmpty(sex)){
            userext.sex = sex;
        }
        if(Tools.isNotEmpty(location)){
            userext.location = location;
        }
        var token =  md5(mobile_number + password + new Date().valueOf());
        var token_key = RedisKeys.USER_TOKEN_MOBILE_NUMBER + mobile_number;
        var user_key = RedisKeys.USER_MSG_TOKEN + token;
        redis.set(user_key,JSON.stringify(userext));
        redis.set(token_key,token);
        //redis.expire(user_key,120*60);
        //redis.expire(token_key,120*60);
        var rs = yield S.UserService.update(user);
        rs = yield S.UserextService.save(userext);
        if(rs.err){
            yield this.body = {'head':{code: 2001,msg:'操作失败'}};
        }else{
            user = Tools.base_info(userext);
            yield this.body = {'head':{code: 200,msg:'success'},data:user,token:token};
        }
    }
}

/**
 * 上传
 * @resourcePath /User
 * @summary 上传
 * @path /yuedu/userinfo/v3/user/upload
 * @method post
 */
exports.upload = function *(){
    try{
        var parts = parse(this);
        var part;
        while (part = yield parts) {
            if(part != undefined){
                var ext;
                if(Tools.isNotEmpty(part.filename)){
                    var names = part.filename.split('.'),
                        ext = names[names.length-1];
                }else{
                    ext = 'jpg';
                }
                //判断上传格式  (mp3)
                if('jpg'!=ext.toLowerCase() && 'png'!=ext.toLowerCase()){
                    this.body = {err:'上传图片格式有误'};;
                    return;
                }
                var name = md5(new Date().valueOf()) + '.' + ext;
                var filepath = path.join(Tools.imgDir, name);
                var stream = fs.createWriteStream(filepath);
                part.pipe(stream);
            }
        }
        var rs = yield qiniuUtils.putFile(name,filepath);
        if(!rs || Tools.isEmpty(rs) || rs.err){
            var imgurl = Tools.imgPath + name;
            yield this.body = {'head':{code: 200,msg:'success'},data:imgurl};
        }else{
            var imgurl = qiniuUtils.qiniuhost + name;
            yield this.body = {'head':{code: 200,msg:'success'},data:imgurl};
        }
    }catch (err){
        console.log(err)
        yield this.body = {'head':{code: 1007,msg:'上传失败'}};
    }

}

/**
 * 根据token获取用户信息
 */
exports.getUserByToken = function *(){
    var token = this.params.token;
    var user = yield S.UserService.findByToken(token);
    user = JSON.parse(user);
    user = Tools.base_info(user);
    yield this.body = {'head':{code: 200,msg:'success'},data:user};
}

/**
 * 根据TOKE获取用户基本信息
 * @resourcePath /User
 * @summary 根据TOKE获取用户信息
 * @path /beautifulreading/userinfo/v3/token/{token}
 * @method get
 * @param {string|name=token|paramType=path|description=token}
 */
exports.getUserByTokenOnlyDate = function *(){
    var token = this.params.token;
    var user = yield S.UserService.findByToken(token);
    var user_key = RedisKeys.USER_MSG_TOKEN + token;
    if (!Tools.isEmpty(user)) redis.expire(user_key,config.redis.expire.token);
    user = JSON.parse(user);
    user = Tools.base_info(user);
    this.body = user;
}
/**
 * 获取所有用户
 */
//  exports.getAllUsers = function*(){
//     var token = this.params.token;
//     var skip = this.params.skip;
//     var limit = this.params.limit;
//     if(Tools.isEmpty(token)){
//         yield this.body = {'head':{'code':1000,msg:'token不能为空'}};
//         return;
//     }
//     var user = yield S.UserService.findByToken(token);
//     if(Tools.isEmpty(user)){
//         yield this.body = {'head':{'code':1000,msg:'token错误或过期'}};
//         return;
//     }
//     if(Tools.isEmpty(skip)){
//         yield this.body = {'head':{'code':1000,msg:'起始下标不能为空'}};
//         return;
//     }
//     if(Tools.isEmpty(limit)){
//         yield this.body = {'head':{'code':1000,msg:'获取条数不能为空'}};
//         return;
//     }
//     var users = yield S.UserService.getAllUsers(skip,limit);
//     yield this.body = users;
// }
exports.weChatsave=function *() {
    var body=yield bodyParse(this);
    var userDto=body.user;
    console.log(userDto);
    if(Tools.isEmpty(userDto)){
        yield this.body = {'head':{'code':1000,msg:'userDto can not be empty'}};
        return;
    }
    
}

exports.save =  function*(){
    var body = yield bodyParse(this);
    var userDto = body.user;
    // debug
    console.log(userDto);
    if(Tools.isEmpty(userDto)){
        yield this.body = {'head':{'code':1000,msg:'userDto can not be empty'}};
        return;
    }
    var user_id = userDto.user_id;
    var all = userDto.all;
    var user = yield S.UserService.getByUserId(user_id, all);
    var userext = yield S.UserextService.getByUserId(user_id, all);
    if(Tools.isEmpty(user)){
        user = E.user();
    }
    if(Tools.isNotEmpty(userDto.avatar)){
        user.avatar = userDto.avatar;
    }
    if(Tools.isNotEmpty(userDto.user_name)){
        user.user_name = userDto.user_name;
    }
    if(Tools.isNotEmpty(userDto.email)){
        user.email = userDto.email;
    }
    if(Tools.isNotEmpty(userDto.location)){
        user.location = userDto.location;
    }
    if(Tools.isNotEmpty(userDto.sex)){
        user.sex = userDto.sex;
    }
    if(Tools.isNotEmpty(userDto.status)){
        user.status = userDto.status;
    }
    if(Tools.isNotEmpty(userDto.organization)){
        user.organization = userDto.organization;
    }

    // yield S.UserService.ResetUserSortValue();
    var rs = yield S.UserService.update(user);
    if(Tools.isNotEmpty(userext)){
        if(Tools.isNotEmpty(userDto.avatar)){
            userext.avatar = userDto.avatar;
        }
        if(Tools.isNotEmpty(userDto.user_name)){
            userext.user_name = userDto.user_name;
        }
        if(Tools.isNotEmpty(userDto.email)){
            userext.email = userDto.email;
        }
        if(Tools.isNotEmpty(userDto.location)){
            userext.location = userDto.location;
        }
        if(Tools.isNotEmpty(userDto.sex)){
            userext.sex = userDto.sex;
        }
        if(userDto.recommend_msg != void 0){
            userext.recommend_msg = userDto.recommend_msg;
        }
        if(Tools.isNotEmpty(userDto.sort)){
            userext.sort = userDto.sort;
        }
        if(Tools.isNotEmpty(userDto.tags)){
            userext.tags = userDto.tags;
        }
        if(Tools.isNotEmpty(userDto.vip)){
            userext.vip = userDto.vip;
        }
        if(Tools.isNotEmpty(userDto.organization)){
            userext.organization = userDto.organization;
        }
        if(Tools.isNotEmpty(userDto.status)){
            userext.status = userDto.status;
        }
        yield S.UserextService.save(userext);
    }
    this.body = rs;
}

exports.findByUserId =  function*(){
    var user_id = this.params.user_id;
    var user =  yield S.UserService.getByUserId(user_id);
    this.body = user;
}

exports.findByMobileNumber =  function*(){
    var mobile_number = this.params.mobile_number;
    var user =  yield S.UserService.getByMobileNumber(mobile_number);
    this.body = user;
}

exports.findOthers =  function*(){
    var user_id = this.params.user_id;
    var skip =  this.params.skip;
    var limit =  this.params.limit;
    if(Tools.isEmpty(user_id)){
        yield this.body = {'head':{'code':1000,msg:'user_id can not be empty'}};
        return;
    }
    if(Tools.isEmpty(skip)){
        yield this.body = {'head':{'code':1000,msg:'skip can not be empty'}};
        return;
    }
    if(Tools.isEmpty(limit)){
        yield this.body = {'head':{'code':1000,msg:'limit can not be empty'}};
        return;
    }
    var rs = yield S.UserService.getOthers(user_id,skip,limit);
    this.body = rs;
}

exports.list = function*(){
    var body =  yield bodyParse(this);
    var filter = {};
    if(Tools.isNotEmpty(body.filter))
        filter = body.filter;
    var rs = yield S.UserService.list(filter);
    this.body = rs;
}

exports.list_skip_limit = function*(){
    var skip = this.params.skip;
    var limit =  this.params.limit;
    var body =  yield bodyParse(this);
    var filter = body.filter;
    var rs = yield S.UserService.list_skip_limit(filter,skip,limit);
    this.body = rs;
}
exports.all_skip_limit = function*(){
    var skip = this.params.skip;
    var limit =  this.params.limit;
    var body =  yield bodyParse(this);
    var filter = body.filter;
    var rs = yield S.UserService.all_skip_limit(filter,skip,limit);
    this.body = rs;
}

exports.delete = function*(){
    var user_id =  this.params.user_id;
    var filter = {user_id:user_id};
    var rs = yield S.UserService.delete(filter);
    this.body = rs;
}

exports.testEase = function*(){
    var user_id =  this.params.user_id;
    S.UserService.saveEaseUser(user_id);
    this.body = {isok:true};
}

exports.getUsersInfo = function*() {
    try {
        var ids = this.request.query.ids + '';
        ids = ids.split(',').filter(function(item, index, self) {
            return self.indexOf(item) === index;
        });

        var UserModel = mongoose.model('userext');
        var e_users = yield UserModel.find({user_id: {$in: ids}}).exec();

        this.status = 200;
        this.body = {message: '成功', data: e_users};
    } catch (e) {
        console.log(e.stack);
        this.status = 500;
    }
}
