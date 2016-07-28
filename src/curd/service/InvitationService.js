/**
 * Created by Administrator on 15-3-2.
 */
var util = require('util');
var fs = require('fs');


exports.save =  function *(obj){
    var rs = yield mongoTemplate.save(obj);
    return rs;
}

exports.list =  function *(filter){
    var page = 1;
    if(Tools.isNotEmpty(filter.page)){
        page = parseInt(filter.page);
    }
    var skip = (page-1) * Tools.pageSize;
    var rs = yield mongoTemplate.list_skip_page({},skip,Tools.pageSize,'invitation');
    return rs;
}

exports.user_list =  function *(filter){
    var page = 1;
    if(Tools.isNotEmpty(filter.page)){
        page = parseInt(filter.page);
    }
    var skip = (page-1) * Tools.pageSize;
    var rs = yield mongoTemplate.list_skip_page({user_id:{$exists:true}},skip,Tools.pageSize,'invitation');
    return rs;
}
exports.public_list =  function *(filter){
    var page = 1;
    if(Tools.isNotEmpty(filter.page)){
        page = parseInt(filter.page);
    }
    var skip = (page-1) * Tools.pageSize;
    var rs = yield mongoTemplate.list_skip_page({user_id:{$exists:false}},skip,Tools.pageSize,'invitation');
    return rs;
}

exports.public_count = function *(filter){
    var rs = yield mongoTemplate.count({user_id:{$exists:false}},'invitation');
    return rs;
}
exports.user_count = function *(filter){
    var rs = yield mongoTemplate.count({user_id:{$exists:true}},'invitation');
    return rs;
}

exports.findOne =  function *(filter){
    var rs = yield mongoTemplate.findOne(filter,'invitation');
    return rs;
}
exports.delete =  function*(filter){
    var rs = yield mongoTemplate.remove(filter,'invitation');
    return rs;
}