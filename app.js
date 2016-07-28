/**
 * 引入库
 * @type {dev|exports|*}
 */
var logger = require('koa-logger');
var koa = require('koa');
var app = koa();
var serve = require('koa-static');
require('./middleware/autorequire');
var session = require('koa-session');
var ejs = require('koa-ejs');
var router = require('./router/router');
var path = require('path');
var auth = require('basic-auth');
var config = require('./config/config');
var md5 = require('MD5');

var cors = require('koa-cors');
var options = {
	// origin: '*'
};
app.use(cors(options));
/**
 * 中间价
 */
app.use(function*(next) {
    this.send = function(status, body, headers) {
        if (headers) {
            for (var key in headers) {
                this.set(key, headers[key]);
            }
        }

        this.status = status;
        this.body = body;
    };
    yield next;
});
/**
 * 中间价
 */
app.use(function *(next){
    var token = this.query.token;
    var start = Date.now();
    yield next;
    var req = this;
    if(this.path == '/'){
        return;
    }
    var ms = Date.now() - start;
    S.UserService.findByTokenAsync(token,function(err,rs){
        var logs = E.logs();
        var user;
        if(!err){
            user = rs.body;
        }
        if(user && user!=null){
            logs.user_id = user.user_id;
            logs.user_name = user.user_name;
        }
        logs.ms = ms;
        logs.url = req.url;
        logs.path = req.path;
        logs.base_path = logs.path.replace(/[a-fA-F0-9]{32,32}.*/,'');
        logs.body = req.req_body;
        logs.params = req.params;
        logs.headers = req.headers;;
        logs.status_code = req.status;
        if(req.body instanceof Object){
            logs.msg =  JSON.stringify(req.body);
        }
        logs.ip = req.ip;
        logs.project = Const.PROJECT_NAME;
        logs = Tools.setBaseFields(logs);
        S.LogsService.saveAsync(logs)
    });
});
// app.use(require('koa-validate')());
require('koa-validate')(app);
app.use(serve(__dirname + '/public'));
app.use(serve(__dirname + '/swaggerui'));
app.keys = ['poem key'];
app.use(session(app));
ejs(app, {
  root: path.join(__dirname, 'view'),
  layout: false,
  viewExt: 'html',
  cache: false,
  debug: true
});
app.use(logger());

app.use(function*(next){
    var credentials = auth(this);
    if ( !credentials  || (credentials.name !== 'loser' || !(credentials.pass == 'england' || credentials.pass == md5('england')))
        && (credentials.name !== 'iEileen' || !(credentials.pass == 'shi6jie' || credentials.pass == md5('shi6jie')))
        && (credentials.name !== 'M0GUjIe' || !(credentials.pass == 'england' || credentials.pass == md5('england')))
        ) {
        if(this.url.indexOf('uploadfile')>0 || this.url.indexOf('report')>0 || this.url.indexOf('share')>0 || (this.url == '/') || (this.url == '')){
            yield next;
        }else{
            this.status = 401;
            yield this.body = {"status":false,"error":"Not authorized"};
        }
    }else{
        this.basic = credentials;
        yield next;
    }
});

require('./middleware/connectMongo');
require('./middleware/connectRedis');
require('./middleware/connectMysql');
app.use(router.routes()).use(router.allowedMethods());
if (process.env.BS_ENV != 'dev') app.use(require('koa-router-newrelic')(app));

app.listen(config.http.port);
console.log('listening on port '+config.http.port);
