var _ = require('underscore');

exports.getBaseUserDto = function(data){
    if(data instanceof Array){
        var dtos = [];
        for(var i=0;i<data.length;i++){
            var entity = data[i];
	        if(Tools.isNotEmpty(entity)){
                var dto = {
                    user_id : Tools.isEmpty(entity.user_id)?'':entity.user_id,
                    user_name :  Tools.isEmpty(entity.user_name)?'':entity.user_name,
                    avatar : Tools.isEmpty(entity.avatar)?'':entity.avatar,
                    mobile_number : Tools.isEmpty(entity.mobile_number)?'':entity.mobile_number,
                    recommend_msg : Tools.isEmpty(entity.recommend_msg)?'':entity.recommend_msg,
                    level : Tools.isEmpty(entity.level)?'':entity.level,
                    email : Tools.isEmpty(entity.email)?'':entity.email,
                    sex : Tools.isEmpty(entity.sex)?'':entity.sex,
                    location : Tools.isEmpty(entity.location)?'':entity.location,
                    createtime : Tools.isEmpty(entity.createtime)?new Date().valueOf():entity.createtime
                }
                dtos.push(dto);
             }
        }
        return dtos;
    }else{
        var dto = {
            user_id : Tools.isEmpty(data.user_id)?'':data.user_id,
            user_name :  Tools.isEmpty(data.user_name)?'':data.user_name,
            avatar : Tools.isEmpty(data.avatar)?'':data.avatar,
            mobile_number : Tools.isEmpty(data.mobile_number)?'':data.mobile_number,
            recommend_msg : Tools.isEmpty(data.recommend_msg)?'':data.recommend_msg,
            level : Tools.isEmpty(data.level)?'':data.level,
            email : Tools.isEmpty(data.email)?'':data.email,
            sex : Tools.isEmpty(data.sex)?'':data.sex,
            location : Tools.isEmpty(data.location)?'':data.location,
            createtime : Tools.isEmpty(data.createtime)?new Date().valueOf():data.createtime
        }
        return dto;
    }
}

exports.getDetailUserDto = function(data){
    if(data instanceof Array){
        var dtos = [];
        for(var i=0;i<data.length;i++){
            var entity = data[i];
            if(Tools.isNotEmpty(entity)){
                var dto = {
                    user_id : Tools.isEmpty(entity.user_id)?'':entity.user_id,
                    user_name :  Tools.isEmpty(entity.user_name)?'':entity.user_name,
                    avatar : Tools.isEmpty(entity.avatar)?'':entity.avatar,
                    mobile_number : Tools.isEmpty(entity.mobile_number)?'':entity.mobile_number,
                    email : Tools.isEmpty(entity.email)?'':entity.email,
                    sex : Tools.isEmpty(entity.sex)?'':entity.sex,
                    location : Tools.isEmpty(entity.location)?'':entity.location,
                    level : Tools.isEmpty(entity.level)?'':entity.level,
                    exp : Tools.isEmpty(entity.exp)?'':entity.exp,
                    recommend_msg : Tools.isEmpty(entity.recommend_msg)?'':entity.recommend_msg,
                    keep_books : Tools.isEmpty(entity.keep_books)?'':entity.keep_books,
                    book_money : Tools.isEmpty(entity.book_money)?'':entity.book_money,
                    createtime : Tools.isEmpty(entity.createtime)?new Date().valueOf():entity.createtime
                }
                dtos.push(dto);
            }
        }
        return dtos;
    }else{
        var dto = {
            user_id : Tools.isEmpty(data.user_id)?'':data.user_id,
            user_name :  Tools.isEmpty(data.user_name)?'':data.user_name,
            avatar : Tools.isEmpty(data.avatar)?'':data.avatar,
            mobile_number : Tools.isEmpty(data.mobile_number)?'':data.mobile_number,
            email : Tools.isEmpty(data.email)?'':data.email,
            sex : Tools.isEmpty(data.sex)?'':data.sex,
            location : Tools.isEmpty(data.location)?'':data.location,
            level : Tools.isEmpty(data.level)?'':data.level,
            exp : Tools.isEmpty(data.exp)?'':data.exp,
            recommend_msg : Tools.isEmpty(data.recommend_msg)?'':data.recommend_msg,
            keep_books : Tools.isEmpty(data.keep_books)?'':data.keep_books,
            book_money : Tools.isEmpty(data.book_money)?'':data.book_money,
            createtime : Tools.isEmpty(data.createtime)?new Date().valueOf():data.createtime
        }
        return dto;
    }
}

