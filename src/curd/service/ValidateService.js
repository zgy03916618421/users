'use strict';
/* jshint node: true */

const assert = require('assert');
const mongoose = require('mongoose');
const U = require('../utils/util');
const H = require('../utils/helper');

/**
 * Created by Administrator on 15-3-2.
 */

var save = function(obj){
    return function(callback){
        obj.save(callback);
    };
};

var find = function(filter,sort,skip,limit){
    return function(callback){
        if(Tools.isEmpty(filter)){
            filter = {};
        }
        if(Tools.isEmpty(sort)){
            sort = {};
        }
        if(Tools.isEmpty(skip)){
            skip = 0;
        }
        var query = E.validate.find(filter).sort(sort).skip(skip).limit(limit);
        query.exec(callback);
    };
};

exports.getLastByMobileNumber = function *(mobile_number){
    var rs = yield find({mobile_number:mobile_number},{createtime:-1},0,1);
    if(Tools.isNotEmpty(rs)){
        if(rs.err){
            return false;
        }else{
            return rs[0];
        }
    }else{
        return false;
    }
};

exports.save = function *(validate){
    var rs = yield save(validate);
    if(Tools.isNotEmpty(rs)){
        if(rs.err){
            return false;
        }else{
            return true;
        }
    }else{
        return false;
    }
};

exports.sendCaptcha = function*(account, type) {
    let mobile = U.isMobile(account) && account;
    let email = U.isEmail(account) && account;

    assert(mobile || email, 'PARAM_INVALID');
    assert(~['register', 'forgetPassword'].indexOf(type), 'PARAM_INVALID');

    let UserModel = mongoose.model('user');
    let ValidateModel = mongoose.model('validate');

    let e_user = yield UserModel.findOne({
        status: 'visable',
        $or: [{
            mobile_number: account
        }, {
            email: account
        }]
    }).exec();
    if (type === 'register') assert(!e_user, 'USER_EXISTS');
    if (type !== 'register') assert(e_user, 'USER_GONE');

    let validate_code = U.randomString(4, U.randomString.number);
    let ret;
    if (mobile) {
        ret = yield MessageUtils.sendSms(mobile, '您本次操作的验证码是：' + validate_code + '。');
    } else {
        ret = yield H.sendEmail(email, '验证码', '您本次操作的验证码是：' + validate_code + '。');
    }
    assert(ret, 'CAPTCHA_SEND_FAILURE');
    
    let e_validate = new ValidateModel({
        account: mobile || email,
        validate_code: validate_code
    });

    yield e_validate.save();

    return validate_code;
};