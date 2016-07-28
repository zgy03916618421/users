var config = require("../config/config");       // 配置文件
var redis = require("redis"),
    client = redis.createClient(config.redis.port,config.redis.host,{});


client.on("connect", function () {
    global.redis = client;
    console.log('connect redis [%s:%s] success! ', config.redis.host, config.redis.port);
});