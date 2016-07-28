'use strict';
/* jshint node: true */

const U = require('../utils/util');
const H = require('../utils/helper');
const assert = require('assert');
const mongoose = require('mongoose');

exports.signUpOrganizationUser = function*(user, organization, opts) {
    assert(U.isObject(user), 'PARAM_INVALID');
    assert(U.isObject(organization), 'PARAM_INVALID');
    assert(U.isEmail(user.email), 'PARAM_INVALID');
    assert(U.isPassword(user.password), 'PARAM_INVALID');
    assert(U.isString(organization.name), 'PARAM_INVALID');
    assert(U.isString(organization.owner_name), 'PARAM_INVALID');
    assert(U.isString(organization.owner_contact), 'PARAM_INVALID');
    assert(U.isString(organization.intro), 'PARAM_INVALID');
    assert(U.isString(organization.address), 'PARAM_INVALID');
    assert(U.isString(organization.business_time), 'PARAM_INVALID');
    assert(U.isImageUrl(organization.avatar), 'PARAM_INVALID');

    // 数据模型定义
    let UserModel = mongoose.model('user');
    let UserextModel = mongoose.model('userext');
    let OrganizationModel = mongoose.model('organization');

    // 判断账号是否已被注册
    let e_user = yield UserModel.findOne({ email: user.email }).exec();
    let e_userext = yield UserModel.findOne({ email: user.email }).exec();
    assert(!e_user, 'EMAIL_EXISTS');
    assert(!e_userext, 'EMAIL_EXISTS');

    let e_organization = new OrganizationModel(organization);
    e_user = new UserModel({
        email: user.email,
        password: U.md5(user.email + user.password),
        app_id: opts.app_id,
        user_agent: opts.user_agent,
        client_ip: opts.client_ip,
        type: 'organization',
        organization_id: e_organization._id
    });
    e_userext = new UserextModel({
        email: user.email,
        app_id: opts.app_id,
        user_agent: opts.user_agent,
        client_ip: opts.client_ip,
        type: 'organization',
        organization_id: e_organization._id
    });

    e_user = yield e_user.save();

    e_user.user_id = e_user._id.toString();
    e_user = yield e_user.save();

    e_userext.user_id = e_user._id.toString();
    e_userext = yield e_userext.save();

    e_organization.created_by = e_organization.updated_by = e_user._id.toString();
    e_organization = yield e_organization.save();

    e_user.organization = e_organization._id;
    e_user = yield e_user.save();

    e_userext.organization = e_organization._id;
    e_userext = yield e_userext.save();

    return U.extend(e_user.toObject(), {
        __v: null,
        password: null
    }, U.extend.RN);
};
exports.signIn = function*(account, password) {
    assert(U.isAccount(account), 'ACCOUNT_INVALID');
    assert(U.isString(password), 'PASSWORD_INVALID');

    let UserModel = mongoose.model('user');
    let e_user = yield UserModel.findOne({
        $or: [{
            username: account
        }, {
            mobile_number: account
        }, {
            email: account
        }],
        status: 'visable'
    }).populate('organization').exec();console.log(e_user);

    assert(e_user, 'USER_GONE');
    assert(~[U.md5(e_user.mobile_number + password), U.md5(e_user.email + password)].indexOf(e_user.password), 'PASSWORD_INVALID');
    assert(e_user.type != 'organization' || (e_user.organization && e_user.organization.toObject().status == 'visable'), 'ORGANIZATION_INVALID');

    let user = e_user.toObject();

    if (e_user.type === 'user') {
        let UserextModel = mongoose.model('userext');
        let e_userext = yield UserextModel.findOne({
            user_id: e_user.user_id
        }).exec();
        assert(e_userext, 'USER_GONE');

        user = U.extend(e_user, U.extend(e_userext, {
            _id: null,
            organization: null
        }, U.extend.RN), {
            password: null
        }, U.extend.RN);
    } else if (user.organization) {
        user.user_name = user.organization.name;
        user.avatar = user.organization.avatar;
    }

    // 构建用户信息缓存的key
    let redis_key = RedisKeys.JWT_USER_INFO + e_user.user_id;
    // 写入redis
    yield H.redis.set(redis_key, JSON.stringify(user));
    // 生产令牌
    let access_token = yield H.signToken({ user_id: user.user_id });
    let refresh_token = yield H.signToken({ user_id: user.user_id }, '3650d');

    return { access_token: access_token, refresh_token: refresh_token };
};

exports.refreshToken = function*(refresh_token) {
    assert(U.isString(refresh_token), 'PARAM_INVALID');

    let info;
    try {
        info = yield H.verifyToken(refresh_token);
    } catch (e) {
        console.log(e.stack);
        throw Error('TOKEN_INVALID');
    }

    // 构建用户信息缓存的key
    let redis_key = RedisKeys.JWT_USER_INFO + info.user_id;
    let user_str = yield H.redis.get(redis_key);
    // 查不到用户信息，强制用户重新登录
    assert(user_str, 'FORCE_LOGIN');

    let user = JSON.parse(user_str);
    let access_token = yield H.signToken({ user_id: user.user_id });
    refresh_token = yield H.signToken({ user_id: user.user_id }, '3650d');

    return { access_token: access_token, refresh_token: refresh_token };
};

exports.getUserInfoByToken = function*(access_token) {
    assert(access_token, 'PARAM_INVALID');

    let info;
    try {
        info = yield H.verifyToken(access_token);
    } catch (e) {
        console.log(e.stack);
        throw Error('TOKEN_INVALID');
    }

    let user = yield exports.readUserInfoByUserId(info.user_id);
    assert(user, 'USER_GONE');

    return user;
};

exports.readUserInfoByUserId = function*(user_id) {
    assert(U.isString(user_id), 'PARAM_INVALID');

    // 构建用户信息缓存的key
    let redis_key = RedisKeys.JWT_USER_INFO + user_id;
    let user_str = yield H.redis.get(redis_key);
    // 查不到用户信息，强制用户重新登录
    assert(user_str, 'FORCE_LOGIN');

    let user = JSON.parse(user_str);

    return user;
};

exports.resetPassword = function*(user_id, new_password, old_password) {
    assert(U.isString(old_password), 'PASSWORD_INVALID');
    assert(U.isPassword(new_password), 'PASSWORD_INVALID');

    let UserModel = mongoose.model('user');

    let e_user = yield UserModel.findOne({
        user_id: user_id
    }).exec();

    assert(e_user, 'USER_GONE');
    assert(~[U.md5(e_user.mobile_number + old_password), U.md5(e_user.email + old_password)].indexOf(e_user.password), 'PASSWORD_INVALID');

    // 删除用户信息缓存，强制用户重新登录
    let redis_key = RedisKeys.JWT_USER_INFO + e_user.user_id;
    yield H.redis.del(redis_key);

    e_user.password = U.md5((e_user.mobile_number || e_user.email) + new_password);
    e_user.updatetime = Date.now();

    return yield e_user.save();
};

exports.forgetPassword = function*(account, password, captcha) {
    assert(U.isMobile(account) || U.isEmail(account), 'PARAM_INVALID');
    assert(U.isPassword(password), 'PARAM_INVALID');
    assert(U.isString(captcha), 'PARAM_INVALID');

    let ValidateModel = mongoose.model('validate');
    let UserModel = mongoose.model('user');

    let e_validate = yield ValidateModel.findOne({
        account: account,
        status: 'visable',
        version: {
            '$gt': new Date(Date.now() - 30 * 60 * 1000)
        }
    }).sort({ version: -1 }).exec();
    assert.ok(e_validate, 'CAPTCHA_INVALID');
    assert.equal(e_validate.validate_code, captcha, 'CAPTCHA_INVALID');

    // 删除验证码
    e_validate.status = 'disable';
    yield e_validate.save();

    let e_user = yield UserModel.findOne({
        $or: [
            { mobile_number: account },
            { email: account }
        ]
    }).exec();
    assert.ok(e_user, 'USER_GONE');

    // 删除用户信息缓存，强制用户重新登录
    let redis_key = RedisKeys.JWT_USER_INFO + e_user.user_id;
    yield H.redis.del(redis_key);

    e_user.password = U.md5(account + password);
    e_user.updatetime = Date.now();

    return yield e_user.save();
};
