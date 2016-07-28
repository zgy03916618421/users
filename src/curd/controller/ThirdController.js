/**
 * Created by Administrator on 15-3-2.
 */
var parse = require('co-busboy');
var bodyParse = require('co-body');
var util = require('util');
var path = require('path');
var fs = require('fs');
var co = require('co');
var md5 = require('MD5');




exports.save =  function*(){
    var body = yield bodyParse(this);
    var third = body.third;
    if(Tools.isEmpty(third)){
        yield this.body = {'head':{'code':1000,msg:'third can not be empty'}};
        return;
    }
    var rs = yield S.ThirdService.save(third);
    this.body = rs;

}

exports.findByUserId =  function*(){
    var user_id = this.params.user_id;
    var third =  yield S.ThirdService.findOne({user_id:user_id});
    this.body = third;
}

exports.findByOpenId =  function*(){
    var open_id = this.params.open_id;
    var third =  yield S.ThirdService.findOne({open_id:open_id});
    this.body = third;
}

exports.findByMobileNumber =  function*(){
    try{
        var mobile_number = this.params.mobile_number;
        var user =  yield S.UserService.findOne({mobile_number:mobile_number});
        yield this.body = {'head':{code: 200,msg:'success'},data:user};
    }catch (err){
        yield this.body = {'head':{'code':500,msg:'failed operation'}};
    }

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
    var rs = yield S.ThirdService.getOthers(user_id,skip,limit);
    this.body = rs;
}

exports.list = function*(){
    var body =  yield bodyParse(this);
    var user_id = body.user_id;
    var rs = yield S.ThirdService.list({user_id:user_id});
    this.body = rs;
}

exports.list_skip_limit = function*(){
    var skip = this.params.skip;
    var limit =  this.params.limit;
    var body =  yield bodyParse(this);
    var filter = body.filter;
    var rs = yield S.ThirdService.list_skip_limit(filter,skip,limit);
    this.body = rs;
}