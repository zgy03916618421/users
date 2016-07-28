/**
 * Created by Administrator on 15-3-2.
 */
var util = require('util');
var path = require('path');
var fs = require('fs');

var save = function(obj){
    return function(callback){
        obj.save(callback);
    }
}

var findOne = function(filter){
    return function(callback){
        E.third.findOne(filter,callback);
    }
}
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
    }
}
/**
 *  put操作
 */
exports.save = function *(third){
    var rs = yield save(third);
    if(rs && rs.err){
        throw rs.err;
    }else{
        return rs;
    }
}

/**
 * 根据id返回用户信息
 */
exports.findByOpenId = function *(openid){
    var filter = {openid:openid};
    var rs = yield findOne(filter);
    if(rs && rs.err){
        throw rs.err;
    }else{
        return rs;
    }
}


/**
 * 根据id返回用户信息
 */
exports.findOne = function *(filter){
    var rs = yield findOne(filter);
    if(rs && rs.err){
        throw rs.err;
    }else{
        return rs;
    }
}

/**
 * 返回其他用户信息
 */
exports.getOthers = function*(user_id,skip,limit){
    var rs = yield mongoTemplate.list_skip_page({user_id:{$ne:user_id}},skip,limit,'third');
    return rs;
}

exports.list = function *(filter){
    var rs = yield mongoTemplate.list(filter,'third');
    return rs;
}

exports.list_skip_limit = function *(filter,skip,limit){
    var rs = yield mongoTemplate.list_skip_page(filter,skip,limit,'user');
    return rs;
}