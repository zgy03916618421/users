var config = require("../config/config");       // 配置文件
var mongoose = require("mongoose");
{
    if(process.env.USERV3_ENV !== 'dev'){
      // var _auth = '';
        var _auth = config.mongo.user+':'+config.mongo.pass+'@';
    }else{
        var _auth = '';
    }
    var clusters = [];
    var hosts = String(config.mongo.host).split(',');
    var ports = String(config.mongo.port).split(',');
    hosts.map(function(host, index) {
        clusters.push(host + ':' + (ports[index] || 27017));
    });
    console.log('mongodb://' + _auth + clusters.join(',') + '/' + config.mongo.db);

    mongoose.connect('mongodb://' + _auth + clusters.join(',') + '/' + config.mongo.db, function (err) {
        if (err) {
            console.error("connect to %s error: %s", config.mongo.db, err.message);
            process.exit(1);
        } else {
            console.log("connect to %s [%s] success!", config.mongo.db, clusters.join(','));
        }
    });
}
