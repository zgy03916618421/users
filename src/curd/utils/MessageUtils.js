'use strict';
/* jshint node: true */

/**
 * Created by Administrator on 2016/1/15.
 */

exports.sendMsg = function (mobile_number,msg){
    var url = Const.MESSAGE_SEND_PATH;
    request.post(url).send({mobile_number:mobile_number,message:msg}).end(function(err,rs){
        if(err){
            console.log(err);
        }else{
            console.log('send msg success')
        }
    });
};

exports.sendSms = function (mobile, msg) {
    return new Promise((resolve, reject) => {
        let url = Const.MESSAGE_SEND_PATH;
        request.post(url).send({mobile_number:mobile,message:msg}).end(function(err,rs){
            if(err){
                console.log(err);
                reject(err);
            } else {
                console.log(rs);
                resolve(true);
                console.log('send msg success');
            }
        });
    });
};


exports.sendForAppleUser = function (mobile_number,cb){
    var msg = '苹果审核账号（' + mobile_number + '）发生登陆操作';
    var url = Const.MESSAGE_SEND_PATH;
    request.post(url).send({mobile_number:mobile_number,message:msg}).end(function(err,rs){
        if(err){
            console.log(err);
        }else{
            console.log('send msg success')
        }
    });
};