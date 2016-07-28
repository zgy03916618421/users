/**
 * Created by Administrator on 15-3-2.
 */
var parse = require('co-busboy');
var bodyParse = require('co-body');
var util = require('util');
var path = require('path');
var fs = require('fs');
var co = require('co');
var md5 = require('MD5');
var config = require('../../../config/config');



/**
 * 获取Token码
 * @resourcePath /User
 * @summary 获取Token码
 * @path /yuedu/userinfo/v3/token/{mobile_number}/{password}
 * @method get
 * @param {string|name=mobile_number|paramType=path|description=手机号码|required=true}
 * @param {string|name=password|paramType=path|description=密码|required=true}
 */
exports.getToken = function*(){
    var mobile_number = this.params.mobile_number;
    var password = this.params.password;
    if(Tools.isEmpty(mobile_number)){
        yield this.body = {'head':{'code':1000,msg:'mobile_number can not be empty'}};
        return;
    }
    if(Tools.isEmpty(password)){
        yield this.body = {'head':{'code':1000,msg:'password can not be empty'}};
        return;
    }
    var user = yield S.UserService.getByMobileNumber(mobile_number);
    if(Tools.isEmpty(user)){
        yield this.body = {'head':{'code':1005,msg:'user does not exist'}};
    }else{
        password = md5(mobile_number + password);
        if(password == user.password){
            var token =  md5(mobile_number + password + new Date().valueOf());
            var token_key = RedisKeys.USER_TOKEN_MOBILE_NUMBER + mobile_number;
            var user_key = RedisKeys.USER_MSG_TOKEN + token;
            redis.set(user_key,JSON.stringify(user));
            redis.set(token_key,token);
            redis.expire(user_key,config.redis.expire.token);
            redis.expire(token_key,config.redis.expire.token);
            yield this.body = {'head':{code: 200,msg:'success'},data:token};
        }else{
            yield this.body = {'head':{code: 1002,msg:'account or password is wrong'}};
        }
    }
}