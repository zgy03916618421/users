var request = require('superagent');


/**
 * saveDefault
 */
exports.saveDefaultAsync =  function (user_id){
    var path = Const.SAVE_DEFAULT_FOLLOWED;
    var data = {user_id:user_id};
    request.post(path).send(data).set('Authorization','Basic bG9zZXI6ZW5nbGFuZA==').end(function(err,rs){
        if(!err){
            console.log('success');
        }else{
            console.log(err);
        }
    })
}


exports.followInvitationer =  function (code, user_id){
    if(Tools.isNotEmpty(code) && Tools.isNotEmpty(user_id)){
        E.invitation.findOne({code:code.toUpperCase()},function(err,invitation){
            if(!err){
                if(Tools.isNotEmpty(invitation)){
                    var path = Const.SAVE_BOTH_FOLLOWED;
                    var data = {follow_id:user_id,followed_id:invitation.user_id};
                    console.log('--------------------');
                    console.log(path, {follow_id:user_id,followed_id:invitation.user_id});
                    request.put(path).send(data).set('Authorization','Basic bG9zZXI6ZW5nbGFuZA==').end(function(err,rs){
                        if(!err){
                            console.log('success');
                        }else{
                            console.log(err);
                        }
                    })
                }
            }else{
                console.log(err)
            }
        });

    }
}

