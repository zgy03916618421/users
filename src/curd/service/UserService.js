/**
 * Created by Administrator on 15-3-2.
 */
var util = require('util');
var path = require('path');
var fs = require('fs');
var md5 = require('MD5');
var mongoose = require('mongoose');

/**
 * 下面几组方法待迁移
 */
var save = function(user){
    return function(callback){
        var mongo_user = E.user();
        if(user instanceof E.user){
            mongo_user = user;
        }else{
            mongo_user.user_id = user.user_id;
            mongo_user.user_name = user.user_name;
            mongo_user.avator = user.avator;
            mongo_user.mobile_number = user.mobile_number;
            mongo_user.createtime = user.create_time;
            mongo_user.app_id = user.app_id;
            mongo_user.user_agent = user.user_agent;
            mongo_user.client_ip = user.client_ip;
            mongo_user.status = user.status;
            mongo_user.organization = user.organization;
            mongo_user.updatetime = new Date().valueOf();
        }
        mongo_user.save(callback);
    }
}

var redis_get = function(token){
    return function(callback){
        var key = RedisKeys.USER_MSG_TOKEN + token;
        redis.get(key,callback);
    }
}
/**
 *  save
 */
exports.save = function *(user){
    try{
        yield save(user);
        // yield mysqlTemplate.insert(user);
        return true;
    }catch (err){
        console.log(err);
        return false;
    }
}

/**
 *  update
 */
exports.update = function *(user){
    var UserService = mongoose.model('user');
    var e_user = yield UserService.findOne({user_id: user.user_id}).exec();
    if (!e_user) return false;
    Object.keys(user).forEach(function(key) {
        e_user[key] = user[key];
    })
    yield e_user.save();
    // yield save(e_user);
    // yield mysqlTemplate.update(user);
    return true;
}

/**
 * 重置用户表格中的sort字段，所有的暂时设置为0
 */
exports.ResetUserSortValue = function *() {
  console.log("here");
  var UserService = mongoose.model('user');
  UserService.update({"status": "visable"}, {"sort": 0}, {multi: true}, function(err) {
    console.log(err);
  });
  return true;
}

/**
 * 根据手机号返回用户信息
 */
exports.getByMobileNumber = function *(mobile_number){
    var filter = {mobile_number:mobile_number};
    var user = yield mongoTemplate.findOne(filter,'user');
    // if(Tools.isEmpty(user)){
    //     var sql = 'select * from userinfo where mobile_number = "' + mobile_number +'"';
    //     var result = yield mysqlTemplate.query(sql);
    //     if(result.err){
    //         return false;
    //     }else{
    //         return result[0][0];
    //     }
    // }
    return user;

}

exports.getByEmail = function*(email) {
    var filter = {email:email};
    var user = yield mongoTemplate.findOne(filter,'user');
    return user;
}
exports.getByweChatUserID=function *(openid,all) {
}
/**
 * 根据用户ID
 */
exports.getByUserId = function *(user_id, all){
    var UserModel = mongoose.model('user');
    var user;
    if (all) {
        user = yield UserModel.findOne({user_id: user_id}).exec();
    } else {
        user = yield UserModel.findOne({user_id: user_id, status: 'visable'}).exec();
    }
    // if(Tools.isEmpty(user)){
    //     var sql = 'select * from userinfo where user_id = "' + user_id +'"';
    //     var result = yield mysqlTemplate.query(sql);
    //     if(result.err){
    //         throw result.err;
    //     }else{
    //         return result[0][0];
    //     }
    // }
    return user;
}
/**
 * 登录验证
 */
exports.check = function *(mobile_number,password){
    var req_password = md5(mobile_number+password);
    var filter = {mobile_number:mobile_number};
    var user = yield mongoTemplate.findOne(filter,'user');
    var data = {};
    if(req_password == user.password){
        return user;
    }else{
        return false;
    }
}

/**
 * 根据token返回用户信息
 */
 exports.findByToken = function*(token){
    var rs = yield redis_get(token);
    if(rs != '(nil)'){
        return rs;
    }else{
        return null;
    }
}
exports.findByTokenAsync = function*(token,callback){
    var key = RedisKeys.USER_MSG_TOKEN + token;
    redis.get(key,function(err,data){
        callback(err,data)
    });
}
/**
 * 根据token返回用户信息
 */
// exports.getAllUsers = function*(skip,limit){
//     var sql = 'select * from userinfo limit ' + skip + ',' + limit;
//     var result = yield mysqlTemplate.query(sql);
//     if(result.err){
//         throw result.err;
//     }else{
//         return result[0];
//     }
// }

/**
 * 返回其他用户信息
 */
exports.getOthers = function*(user_id,skip,limit){
    var users = yield mongoTemplate.list_skip_page({user_id:{$ne:user_id}},skip,limit,'user');
    // if(Tools.isEmpty(users)){
    //     var sql = 'select * from userinfo where user_id != "' + user_id + '" limit ' + skip + ',' + limit;
    //     var result = yield mysqlTemplate.query(sql);
    //     if(result.err){
    //         throw result.err;
    //     }else{
    //         return result[0];
    //     }
    // }else{
    //     return users;
    // }
    return users;
}

exports.list_skip_limit = function *(filter,skip,limit,sort){
    var rs = yield mongoTemplate.list_skip_page(filter,skip,limit,'user',sort);
    return rs;
}

exports.all_skip_limit = function *(filter,skip,limit,sort){
    var rs = yield mongoTemplate.all_skip_page(filter,skip,limit,'user',sort);
    return rs;
}


exports.list = function *(filter,sort){
    var rs = yield mongoTemplate.list(filter,'user',sort);
    return rs;
}

exports.delete = function *(filter){
    if(Tools.isNotEmpty(filter.user_id)){
        //yield mysqlTemplate.removeByUserId(filter.user_id);
        yield S.UserextService.delete(filter);
        var rs = yield mongoTemplate.remove(filter,'user');
        return rs;
    }else{
        return false;
    }
}

exports.saveEaseUser = function(user_id,cb){
    EasemobUtils.getToken(function(err,rs){
        if(!err){
            var token = rs.body.access_token;
            var url = Const.EASEMURL;
            var auth = 'Bearer ' + token;
            var data = {
                username: user_id,
                password: '123456'
            };
            request.post(url).send(data).set('Authorization',auth).end(cb);
        }else{
            console.log(err)
        }
    });
}
