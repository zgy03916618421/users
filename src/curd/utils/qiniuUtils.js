/**
 * Created by lyy on 15-5-28. 封装node-qiniu为  co版
 */

var qiniu = require('node-qiniu');
var fs = require('fs')
var config = require('../../../config/qiniu_config');
var path = require('path');
exports.domain = config.domain;
exports.qiniuhost = 'http://' + config.domain + '/';
qiniu.config({
    access_key: config.access_key,
    secret_key:  config.secret_key
});

var bucket = new qiniu.Bucket(config.default_space);             //获取对应空间的操作句柄

/**
 * 上传图片
 * @param key
 * @param dir
 */
exports.putFile = function *(key,dir){
    var putFile = function(key,dir){
        return function(callback){
            bucket.putFile(key,dir,callback);
        }
    }
    if(fs.existsSync(dir)){
        return yield putFile(key,dir);
    }else{
        return false;
    }

}

/**
 * 上传图片(流式)
 * @param key
 * @param dir
 */
exports.pipe = function *(key,dir){
    var gettingStream = bucket.createGetStream(key);
    var writingStream = fs.createWriteStream(dir);
    gettingStream.pipe(writingStream).on('error')(function(err){
        console.log(err);
    });
    var writeFile = function(key,dir){
        return function(callback){
            gettingStream.pipe(writingStream).on('finish',callback);
        }
    };
    return yield writeFile(key,dir);
}

/**
 * 根据ID获取URL
 * @param key
 */
exports.getUrl = function *(key){
    var getUrl = function(key){
        return function(callback){
            bucket.getUrl(key,callback);
        }
    }
    return yield getUrl(key);
}

/**
 * 根据ID下载图片
 * @param key
 */
exports.download = function *(key){
    var download = function(key){
        return function(callback){
            bucket.download(key,callback);
        }
    }
    return yield download(key);
}

/**
 * 获取图片信息
 * @param key
 */
exports.getInfo = function *(key){
    var getInfo = function(key){
        var image = bucket.image(key);
        return function(callback){
            image.imageInfo(callback);
        }
    }
    return yield getInfo(key);
}

/**
 * 压缩图片
 * @param key
 */
exports.getResizeUrl = function *(model,key,w,h){
    var url = config.fulhost + '/' + key
    var query =  'imageView2' + '/' + model + '/' +'w' + '/' +w + '/' + 'h' + '/' +h;
    url = url + '?' + query;
    return url;
}