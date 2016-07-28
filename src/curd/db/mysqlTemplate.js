var query = function(sql){
    return function(callback){
        mysql.query(sql,callback)
    }
}
var insert = function(user){
    return function(callback){
        var sql = "insert into userinfo set ?";
        mysql.query(sql,user,callback)
    }
}
var removeByUserId = function(user_id){
    return function(callback){
        var sql = "delete from userinfo where user_id = '" + user_id + "'";
        mysql.query(sql,callback)
    }
}
var update = function(user){
    return function(callback){
        var sql = 'update userinfo set ? where uid = "' + user.uid + '"';
        var update = {user_id:user.user_id,avatar: user.avatar, user_name: user.user_name, password:user.password}
        mysql.query(sql,update,callback)
    }
}

var setUser = function(user){
    var mysql_user = {};
    mysql_user.user_id = user.user_id;
    mysql_user.user_name = user.user_name;
    mysql_user.password = user.password;
    mysql_user.user_agent = user.user_agent;
    mysql_user.avatar = user.avatar;
    mysql_user.client_ip = user.client_ip;
    mysql_user.app_id = user.app_id;
    mysql_user.create_time =  user.createtime;
    mysql_user.mobile_number = user.mobile_number;
    return mysql_user;
}

exports.query = function *(sql){
    return yield query(sql);
}
exports.insert = function *(user){
    var mysql_user;
    if(user instanceof E.user){
        mysql_user = setUser(user);
    }else{
        mysql_user = user;
    }
    return yield insert(mysql_user);
}
exports.update = function *(user){
    var mysql_user;
    if(user instanceof E.user){
        mysql_user = setUser(user);
    }else{
        mysql_user = user;
    }
    return yield update(mysql_user);
}
exports.removeByUserId =function *(user_id){
    return yield removeByUserId(user_id);
}