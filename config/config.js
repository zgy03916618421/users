'use strict';
/* jshint node: true */

var path = require('path');
/**
 * Created by Administrator on 15-2-28.
 */
var config;
if(process.env.ENV == 'dev') {
// if(true) {
    config = {
        debug: true,           //dubug为true时，用于本地调试
        autoRequirePath: "/src/curd",
        baseDir: path.join(__dirname, '/..'),
        autoRequireFloder: ["utils", "db"],             //公共调用
        pageSize: 8,
        mongo: {
            db: 'bookshelf',
            port: 27017,
            pageSize: 10,
            host: '192.168.100.2'
        },
        mysqldb: {
            dbname: 'br',
            host: '192.168.100.2',
            user: 'root',
            password: '',
            pageSize: 10
        },
        redis: {
            port: 6379,
            host: '192.168.100.2',
            expire: {
                token: 60 * 60 * 24 * 30 //一个月
            }
        },
        http: {
            protocol: 'http',
            //host:'localhost',
            host: '115.29.38.138',
            port: '8000',
            product: 'platform',       //项目名
            uploadpath: 'uploadfile'
        },
        https: {
            host: '115.29.38.138',
            port: '21011'
        },
        solr: {
            protocol: 'http',
            //host: 'dev.yuedu.io',
            host: '192.168.100.2',
            port: '8983'
        },
        jwt: {
            algorithm: 'HS256',
            expiresIn: '30d',
            secret: '^beautifulreading$'
        },
        smtp: {
            name: '美丽阅读',
            address: 'wx@beautifulreading.com',
            host: 'smtp.exmail.qq.com',
            port: '465',
            password: process.env.SMTP_PASSWORD || 'Wert1910'
        }
    };
}else{
    config = {
        debug: true,           //dubug为true时，用于本地调试
        autoRequirePath: "/src/curd",
        baseDir: path.join(__dirname, '/..'),
        autoRequireFloder: ["utils", "db"],             //公共调用
        pageSize: 8,
        mongo : {
            db: 'bookshelf',
            port : 27017,
            pageSize : 10,
            host: '192.168.200.22',
            user : 'rio',
            pass : 'VFZPhT7y'
        },
        mysqldb : {
            dbname : 'br',
            host: '192.168.200.7',
            user : 'brdbadmin',
            password : 'VFZPhT7y',
            pageSize : 10
        },
        redis : {
            port : 6379,
            host: '192.168.200.2',
            expire: {
                token: 60 * 60 * 24 * 14 //两周
            }
        },
        http : {
            protocol : 'http',
            //host:'localhost',
            host: '115.29.38.138',
            port : '8000',
            product : 'platform',       //项目名
            uploadpath : 'uploadfile'
        },
        https: {
            host: '115.29.38.138',
            port: '21011'
        },
        solr: {
            protocol: 'http',
            //host: 'dev.yuedu.io',
            host: '192.168.200.10',
            port: '8983'
        },
        jwt: {
            algorithm: 'HS256',
            expiresIn: '30d',
            secret: '^beautifulreading$'
        },
        smtp: {
            name: '美丽阅读',
            address: 'wx@beautifulreading.com',
            host: 'smtp.exmail.qq.com',
            port: '465',
            password: process.env.SMTP_PASSWORD || 'Wert1910'
        }
    };
}
module.exports = config;
