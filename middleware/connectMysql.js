/**
 * Created by Administrator on 15-3-16.
 */

var config = require('../config/config');
var wrapper = require('co-mysql'),
    mysql = require('mysql'),
    pool  = mysql.createPool({
        host     : config.mysqldb.host,
        user     : config.mysqldb.user,
        password : config.mysqldb.password,
        database : config.mysqldb.dbname
    });
var mysql = wrapper(pool);
global.mysql = mysql;
exports.mysqldb = mysql;