'use strict';
let mongoose = require('mongoose');
let U = require('../utils/util');
let H = require('../utils/helper');
let C = require('../../../config/config');

/**
 * 登入
 */
exports.index = function *(){
    this.body = '200';
}

exports.auth = function*(){
    let username = this.params.username;
    let password = this.params.password;
    let AdminUserModel = mongoose.model('adminuser');
    let e_admin_user = yield AdminUserModel.findOne({userid: username}).exec();
    if (!e_admin_user) {
    	this.status = 410;
    	this.body = {message: '不存在该管理员'};
    	return;
    }
    if (e_admin_user.password != password) {
    	this.status = 400;
    	this.body = {message: '密码错误'};
    	return;
    }

    let admin = U.extend(e_admin_user.toObject(), {
        password: null
    }, U.extend.RN);
    
    let user_key = RedisKeys.ADMIN_TOKEN_USERNAME + username, token_key;
    let token = yield H.redis.get(user_key);
    if (!token) {
        token = U.md5(username + password + new Date().valueOf());
        token_key = RedisKeys.ADMIN_MSG_TOKEN + token;

        yield H.redis.set(user_key, token);
        yield H.redis.expire(user_key, C.redis.expire.token);
        
        yield H.redis.set(token_key, JSON.stringify(admin));
        yield H.redis.expire(token_key, C.redis.expire.token);
    }

    this.status = 200;
    this.body = {message: '成功', data: U.extend(admin, {token: token})};
}

exports.getAdminByToken = function*() {
    let token = this.params.token;

    let token_key = RedisKeys.ADMIN_MSG_TOKEN + token;
    let data = yield H.redis.get(token_key);

    if (!data) {
        this.status = 410;
        this.body = {message: '令牌已失效，请重新登录'};
        return ;
    }
    data = JSON.parse(data);

    let user_key = RedisKeys.ADMIN_TOKEN_USERNAME + data.username;console.log(user_key, token_key);
    // 令牌时间续期
    redis.expire(user_key, C.redis.expire.token);
    redis.expire(token_key, C.redis.expire.token);

    this.status = 200;
    this.body = {message: '成功', data: data};
}