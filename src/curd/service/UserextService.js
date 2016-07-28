'use strict';
/* jshint node: true */

const mongoose = require('mongoose');

/**
 *  save
 */
exports.save = function *(dto){
    var userext = yield S.UserextService.getByUserId(dto.user_id, 1);
    if(Tools.isEmpty(userext)){
        userext = E.userext();
        userext.createtime = new Date().valueOf();
    }
    userext.user_id = dto.user_id;
    userext.user_name = dto.user_name;
    userext.avatar = dto.avatar;
    userext.mobile_number = dto.mobile_number;
    userext.sex = dto.sex;
    userext.birthday = dto.birthday;
    userext.birthplace = dto.birthplace;
    userext.client_ip = dto.client_ip;
    userext.career = dto.career;
    userext.email = dto.email;
    userext.location = dto.location;
    userext.isAlpha = dto.isAlpha;
    userext.keep_books = dto.keep_books;
    userext.book_money = dto.book_money;
    userext.level = dto.level;
    userext.exp = dto.exp;
    userext.status = dto.status;
    userext.recommend_msg = dto.recommend_msg;
    userext.sort = dto.sort;
    userext.tags = dto.tags;
    userext.ab_strategy = dto.ab_strategy;
    userext.invitation_code = dto.invitation_code;
    userext.invitated_code = dto.invitated_code;
    userext.point = dto.point;
    userext.vip = dto.vip;
    userext.organization = dto.organization;
    if (dto.status) userext.status = dto.status;
    userext = Tools.setUpdateBaseFields(userext);
    // var rs = yield S.UserextService.saveOrUpdate(userext);
    var rs = yield mongoTemplate.save(userext);
    return rs;
}


/**
 * 根据手机号返回用户信息
 */
exports.getByMobileNumber = function *(mobile_number){
    var filter = {mobile_number:mobile_number};
    var rs = yield mongoTemplate.findOne(filter,'userext');
    return rs;
}

/**
 * 根据用户ID
 */
exports.getByUserId = function *(user_id, all){
    var UserextModel = mongoose.model('userext');
    var user;
    if (all) {
        user = yield UserextModel.findOne({user_id: user_id}).exec();
    } else {
        user = yield UserextModel.findOne({user_id: user_id, status: 'visable'}).exec();
    }
    return user;
}


/**
 * 根据用户ID
 */
exports.findOne = function *(filter){

    var rs =  yield mongoTemplate.findOne(filter,'userext');
    return rs;
}

/**
 * 返回其他用户信息
 */
exports.getOthers = function*(user_id,skip,limit){
    var rs = yield mongoTemplate.list_skip_page({user_id:{$ne:user_id}},skip,limit,'userext');
    return rs;
}

exports.list_skip_limit = function *(filter,skip,limit,sort){
    var rs = yield mongoTemplate.list_skip_page_sort(filter,skip,limit,'userext',sort);
    return rs;
}

exports.all_skip_limit = function *(filter,skip,limit,sort){
    var rs = yield mongoTemplate.all_skip_page(filter,skip,limit,'userext',sort);
    return rs;
}

exports.list = function *(filter,sort){
    var rs = yield mongoTemplate.list(filter,'userext',sort);
    return rs;
}

exports.count = function *(filter){
    var rs = yield mongoTemplate.count(filter,'userext');
    return rs;
}

exports.delete = function *(filter){
    var rs = yield mongoTemplate.remove(filter,'userext');
    return rs;
}
