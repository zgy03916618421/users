/**
 * Created by Administrator on 2016/1/15.
 */
exports.getToken = function(callback){
    var url = 'https://a1.easemob.com/beautifulreading/beautifulreading/token';
    var grant_type = 'client_credentials';
    var client_id = 'YXA6pr5e4L5gEeWyZqm0-mXx_w';
    var client_secret = 'YXA6J9P1LTvXpItOgNhj5JAELU5YcQY';
    var data = {
        grant_type : grant_type,
        client_id : client_id,
        client_secret : client_secret
    }
    request.post(url).send(data).end(function(err,rs){
        callback(err,rs);
    });
}

