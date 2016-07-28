'use strict';
/* jshint node: true */

exports.USER_TOKEN_MOBILE_NUMBER = "user:token:mobile_number:";
exports.USER_TOKEN_OPENID = "user:token:openid:";
exports.USER_MSG_TOKEN = "user:msg:token:";

exports.ADMIN_TOKEN_USERNAME = 'admin:token:username:';
exports.ADMIN_MSG_TOKEN = 'admin:msg:token:';

// jwt令牌模式下，以用户ID为唯一标示，记录用户个人信息，当用户登录时会写入缓存，当用户退出或修改密码等行为时，会清除，机构号审核不通过和禁用时，也会清除
// jwt生产的刷新令牌刷新access_token时，会以缓存作为标准，如果缓存存在，则获取缓存信息并返回，如果不存在，则要求重新登录
exports.JWT_USER_INFO = 'jwt:';