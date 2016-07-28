'use strict';
/* jshint node: true */

/**
 * Created by Administrator on 15-3-16.
 */
const fetchUrl = require("fetch").fetchUrl;
const urlencode = require('urlencode2');
const config = require('../../../config/config');
const assert = require('assert');
const U = require('./util');
const H = require('./helper');


exports.pageSize = config.pageSize;
exports.imgPath = config.http.protocol+':/'+ config.http.host+':'+config.http.port + '/uploadfile/';
exports.imgDir = config.baseDir + '/public/uploadfile';

exports.remove_private_info = function(user){
    delete user.uid;
    delete user.password;
    return user;
};
exports.base_info = function(userful){
    if(userful){
        var user = {};
        user.user_id =  exports.isEmpty(userful.user_id)?'':userful.user_id;
        user.user_name = exports.isEmpty(userful.user_name)?'':userful.user_name;
        user.avatar = exports.isEmpty(userful.avatar)?'':userful.avatar;
        user.sex = exports.isEmpty(userful.sex)?'':userful.sex;
        user.level = exports.isEmpty(userful.level)?0:userful.level;
        user.location = exports.isEmpty(userful.location)?'':userful.location;
        user.mobile_number = exports.isEmpty(userful.mobile_number)?'':userful.mobile_number;
        user.ab_strategy = exports.isEmpty(userful.ab_strategy)?'':userful.ab_strategy;
        user.email = exports.isEmpty(userful.email) ? '' : userful.email;
        user.type = exports.isEmpty(userful.type) ? 'user' : userful.type;
        return user;
    }else{
        return null;
    }
};
exports.send_validation_sms = function *(mobile_number,ran){
    let msg = urlencode('您本次操作的验证码是' + ran, 'gbk');
    let buf = "SpCode=210612&LoginName=admin&Password=nihao123abc&MessageContent="+msg+"&UserNumber="+mobile_number+"&SerialNumber=&ScheduleTime=&f=1";
    let send = function(){
        return function(callback){
            fetchUrl("http://gd.ums86.com:8899/sms/Api/Send.do?"+buf,callback);
        };
    };
    yield send();
};


exports.isEmpty = function (obj) {
    if (obj == null ||
        typeof (obj) === "undefined" ||
        obj === undefined ||
        obj.length == 0 ||
        (typeof(obj) === "string" && exports.trims(obj) === "") ||
        obj === "null" || obj == {}) {
        return true;
    }
    return false;
};

exports.isNotEmpty = function (obj) {
    return !exports.isEmpty(obj);
};

exports.trims = function (str) {
    return str.replace(/^\s+|\s+$/g, '');
};

Date.prototype.format = function (f) {
    let o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(f))f = f.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(f))f = f.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return f;
};


exports.setBaseFields = function (entity) {
    entity.createtime = new Date().valueOf();
    entity.updatetime = new Date().valueOf();
    entity.version = Date.now();
    return entity;
};

exports.setUpdateBaseFields = function (entity) {
    entity.updatetime = new Date().valueOf();
    entity.version = Date.now();
    return entity;
};

/**
 * 获取邀请码
 * @returns {*}
 */
exports.getInvitationCode = function () {
    let words = '123456789ABCDEFGHJKLMNOPQRSTUVWXYZ';
    let code = '', i;
    for(i = 0; i < 6; i++){
        code += words.charAt(parseInt(Math.random() * words.length));
    }
    return code;
};

/**
 * 获取验证码
 * @returns {*}
 */
exports.getValidateCode = function () {
    let words = '0123456789';
    let code = '', i;
    for(i = 0; i < 4; i++){
        code += words.charAt(parseInt(Math.random() * words.length));
    }
    return code;
};

exports.getABStrategy = function () {
    let words = 'AB';
    let code = '', i;
    for(i = 0; i < 1; i++){
        code += words.charAt(parseInt(Math.random()*words.length));
    }
    return code;
};

var getUserByToken = function*(token) {
    assert(U.isString(token), 'TOKEN_INVALID');

    let user, admin;
    // 新令牌
    if (token.length != 32 && (user = yield S.User2Service.getUserInfoByToken(token))) {
        return user;
    // 旧令牌普通用户
    } else if ((user = yield S.UserService.findByToken(token)) && exports.isNotEmpty(user)) {
        return JSON.parse(user);
    // 旧令牌管理员用户
    } else if ((admin = yield S.AdminService.findByToken(token)) && exports.isNotEmpty(admin)) {
        admin = JSON.parse(admin);
        return U.extend(admin, {
            user_id: admin._id,
            type: 'admin'
        });
    }
    return false;
};

var E = {
    FORCE_LOGIN: {status: 401, message: {code: 2, message: '请重新登录'}}
};

exports.isValidUser = H.f(function* (next) {
    var token = this.request.query.token || this.request.header.token;
    if (!(this.user = yield getUserByToken(token))) throw Error('TOKEN_INVALID');
    yield next;
}, E);

exports.isValidAdmin = H.f(function* (next) {
    var token = this.request.query.token || this.request.header.token;
    if (!(this.user = yield getUserByToken(token)) || this.user.type != 'admin') throw Error('ADMIN_TOKEN_INVALID');
    yield next;
}, E);