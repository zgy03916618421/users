'use strict';
/* jshint node: true */

const mongoose = require('mongoose');

/**
 * Created by Administrator on 15-3-2.
 */
var path = require('path');
var fs = require('fs');


exports.save =  function*(){
    var body = yield bodyParse(this);
    var userext = body.obj;
    if(Tools.isEmpty(userext)){
        yield this.body = {'head':{'code':1000,msg:'userext can not be empty'}};
        return;
    }
    var rs = yield S.UserextService.save(userext);
    this.body = rs;

}

exports.findByUserId =  function*(){
    var user_id = this.params.user_id;
    var all = this.request.query.all;

    var UserextModel = mongoose.model('userext');
    if (all) {
        this.body = yield UserextModel.findOne({user_id: user_id});
    } else {
        this.body = yield UserextModel.findOne({user_id: user_id, status: 'visable'});
    }
}

exports.findByKey =  function*(){
    var body = yield bodyParse(this);
    var str_key = body.key;
    var users =  yield S.UserextService.list({$or:[{user_name:{$regex:str_key}}]});//,{mobile_number:{$regex:str_key}}
    this.body = users;
}

exports.findByMobileNumber =  function*(){
    var mobile_number = this.params.mobile_number;
    var user =  yield S.UserextService.findOne({mobile_number:mobile_number});
    this.body = user;
}

exports.findOthers =  function*(){
    var user_id = this.params.user_id;
    var skip =  this.params.skip;
    var limit =  this.params.limit;
    if(Tools.isEmpty(user_id)){
        yield this.body = {'head':{'code':1000,msg:'user_id can not be empty'}};
        return;
    }
    if(Tools.isEmpty(skip)){
        yield this.body = {'head':{'code':1000,msg:'skip can not be empty'}};
        return;
    }
    if(Tools.isEmpty(limit)){
        yield this.body = {'head':{'code':1000,msg:'limit can not be empty'}};
        return;
    }
    var rs = yield S.UserextService.getOthers(user_id,skip,limit);
    if(rs.err){
        yield this.body = {'head':{'code':500,msg:'save error'}};
    }else{
        yield this.body = {'head':{code: 200,msg:'success'},data:rs};
    }
}

exports.list = function*(){
    var body =  yield bodyParse(this);
    var filter = body.filter;
    var sort = body.sort;
    var rs = yield S.UserextService.list(filter,sort);
    this.body = rs;
}

exports.count = function*(){
    var body =  yield bodyParse(this);
    var filter = body.filter;
    var rs = yield S.UserextService.count(filter);
    this.body = rs;
}


exports.list_skip_limit = function*(){
    var skip = this.params.skip;
    var limit =  this.params.limit;
    var body =  yield bodyParse(this);
    var filter = body.filter;
    var sort = body.sort;
    var rs = yield S.UserextService.list_skip_limit(filter,skip,limit,sort);
    this.body = rs;
}

exports.all_skip_limit = function*(){
    var skip = this.params.skip;
    var limit =  this.params.limit;
    var body =  yield bodyParse(this);
    var filter = body.filter;
    var sort = body.sort;
    var rs = yield S.UserextService.all_skip_limit(filter,skip,limit,sort);
    this.body = rs;
}
