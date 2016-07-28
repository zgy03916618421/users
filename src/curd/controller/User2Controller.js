/**
 * 新的用户模块
 */
'use strict';
/* jshint node: true */

const U = require('../utils/util');
const H = require('../utils/helper');
const C = require('../../../config/config');
const User2Service = require('../service/User2Service');
const UserService = require('../service/UserService');

const E = {
    FORCE_LOGIN: {status: 401, message: {code: 2, message: '请重新登录'}}
};

exports.signUp = H.f(function*() {
    let body = yield bodyParse(this);
    let user = body.user;
    let type = 'organization';
    let organization = body.organization;
    let profile = body.profile;
    let opts = {
        app_id: this.basic.name,
        user_agent: this.get('User-Agent'),
        client_ip: this.ip
    };

    let rs;
    if (type == 'organization') {
        rs = yield User2Service.signUpOrganizationUser(user, organization, opts);
    } else {
        rs = yield User2Service.signUpNormalUser(user, profile, opts);
    }

    this.send(200, {message: '成功', data: rs});
}, E);

exports.signIn = H.f(function*() {
	let body = yield bodyParse(this);
    let account = body.account;
    let password = body.password;

    let ret = yield User2Service.signIn(account, password);

    this.status = 200;
    this.body = {message: '成功', data: ret};
}, E);

exports.readCurrent = H.f(function*() {
    // 兼容旧版
    // if (/^\w{32,32}$/.test(token)) {
    //     let user = yield S.UserService.findByToken(token);
    //     let user_key = RedisKeys.USER_MSG_TOKEN + token;
    //     if (!Tools.isEmpty(user)) redis.expire(user_key,C.redis.expire.token);
    //     user = JSON.parse(user);
    //     user = Tools.base_info(user);
    //     this.body = user;
    //     return;
    // }
    // jsonwebtoken
    // let ret = yield User2Service.getUserInfoByToken(token);

    this.send(200, {message: '成功', data: this.user});
}, E);

exports.refreshToken = H.f(function*() {
    let refresh_token = this.request.header['refresh-token'] || this.request.query.refresh_token;
    let ret = yield User2Service.refreshToken(refresh_token);
    this.status = 200;
    this.body = {message: '成功', data: ret};
}, E);

exports.readOne = H.f(function*() {
    let user_id = this.params.user_id;
    let ret = yield User2Service.readUserInfoByUserId(user_id);

    this.send(200, {message: '成功', data: U.extend(ret, {
        password: null,
        __v: null
    }, U.extend.RN)});
}, E);

exports.readOneShare = H.f(function*() {
    let user_id = this.params.user_id;
    let ret = yield UserService.getByUserId(user_id);

    this.send(200, {message: '成功', data: U.extend(ret, {
        password: null,
        __v: null
    }, U.extend.RN)});
}, E);

exports.search = H.f(function*() {
    // 未实现
    yield 1;
}, E);

exports.resetPassword = H.f(function*() {
    let user_id = this.user.user_id;
    let body = yield bodyParse(this);
    let old_password = body.old_password;
    let new_password = body.new_password;

    yield User2Service.resetPassword(user_id, new_password, old_password);

    this.send(204);
});

exports.forgetPassword = H.f(function*() {
    let body = yield bodyParse(this);
    let password = body.password;
    let captcha = body.captcha;
    let account = body.account;

    yield User2Service.forgetPassword(account, password, captcha);

    this.send(204);
});
