exports.save = function(obj){
    return function(callback){
        obj.save(callback)
    }
}

exports.saveAsync = function(obj){
    obj.save(function(err,rs){
        if(err){
            console.log(err)
        }
    })
}


/*
exports.remove = function(filter,entity_name){
    return function(callback){
        if(filter instanceof Object){
            filter = JSON.stringify(filter);
        }
        eval('E.'+entity_name+'.update('+filter+',{$set:{status:"disable"}},callback)');
    }
}
*/

exports.remove = function(filter,entity_name){
    return function(callback){
        if(filter instanceof Object)
            filter = JSON.stringify(filter);
        eval('E.'+entity_name+'.remove('+filter+',callback)');
    }
}

exports.list = function(filter,entity_name,sort){
    return function(callback){
        if(filter && filter instanceof Object ){
            filter.status = {$ne:'disable'};
            filter = JSON.stringify(filter);
        }else {
            filter = {};
            filter.status = {$ne:'disable'};
            filter = JSON.stringify(filter);
        }
        if(sort && sort instanceof Object){
            sort = JSON.stringify(sort);
        }else {
            sort = JSON.stringify({createtime:-1});
        }
        eval('E.'+entity_name+'.find('+filter+',callback).sort('+sort+')');
    }
}

exports.list_sort = function(filter,sort,entity_name){
    return function(callback){
        if(filter instanceof Object){
            filter.status = {$ne:'disable'};
            filter = JSON.stringify(filter);
        }else if(Tools.isEmpty(filter)){
            filter = {};
            filter.status = {$ne:'disable'};
            filter = JSON.stringify(filter);
        }else{
            filter = '{}';
        }
        if(sort instanceof Object){
            sort = JSON.stringify(sort);
        }else if(Tools.isEmpty(sort)){
            sort = JSON.stringify(sort);
        }else{
            sort = '{createtime:-1}';
        }
        eval('E.'+entity_name+'.find('+filter+').sort('+sort+').exec(callback)');
    }
}


exports.list_skip_page = function(filter,skip,limit,entity_name,sort){
    return function(callback){
        if(filter && filter instanceof Object){
            filter.status = {$ne:'disable'};
            filter = JSON.stringify(filter);
        }else {
            filter = {};
            filter.status = {$ne:'disable'};
            filter = JSON.stringify(filter);
        }
        if(sort && sort instanceof Object){
            sort = JSON.stringify(sort);
        }else {
            sort = JSON.stringify({createtime:-1});
        }
        var query = eval('E.'+entity_name+'.find('+filter+').skip('+skip+').limit('+limit+').sort('+sort+')');
        query.exec(callback);
    }
}

exports.list_skip_page_sort = function(filter,skip,limit,sort,entity_name){
    return function(callback){
        if( filter instanceof Object ){
            filter.status = {$ne:'disable'};
            filter = JSON.stringify(filter);
        }else {
            filter = {};
            filter.status = {$ne:'disable'};
            filter = JSON.stringify(filter);
        }
        if(sort instanceof Object){
            sort = JSON.stringify(sort);
        }else {
            sort = JSON.stringify({createtime:-1});
        }
        var query = eval('E.'+entity_name+'.find('+filter+').skip('+skip+').limit('+limit+').sort('+sort+')');
        query.exec(callback);
    }
}

exports.all_skip_page = function(filter,skip,limit,entity_name,sort){
    return function(callback){
        if(filter && filter instanceof Object ){
            filter = JSON.stringify(filter);
        }else {
            filter = '{}';
        }
        if(sort && sort instanceof Object){
            sort = JSON.stringify(sort);
        }else {
            sort = JSON.stringify({createtime:-1});
        }
        var query = eval('E.'+entity_name+'.find('+filter+').skip('+skip+').limit('+limit+').sort('+sort+')');
        query.exec(callback);
    }
}

exports.count = function(filter,entity_name){
    return function(callback){
        if(filter instanceof Object){
            filter.status = {$ne:'disable'};
            filter = JSON.stringify(filter);
        }else if(Tools.isEmpty(filter)){
            filter = {};
            filter.status = {$ne:'disable'};
            filter = JSON.stringify(filter);
        }else{
            filter = '{}';
        }
        eval('E.'+entity_name+'.count('+filter+',callback)');
    }
}


exports.findOne = function(filter,entity_name){
    return function(callback){
        if(filter instanceof Object){
            filter.status = {$ne:'disable'};
            filter = JSON.stringify(filter);
        }else if(Tools.isEmpty(filter)){
            filter = {};
            filter.status = {$ne:'disable'};
            filter = JSON.stringify(filter);
        }else{
            filter = '{}';
        }
        eval('E.'+entity_name+'.findOne('+filter+',callback)');
    }
}

exports.distinct = function(filter,field,entity_name){
    return function(callback){
        if(filter instanceof Object){
            filter.status = {$ne:'disable'};
            filter = JSON.stringify(filter);
        }else if(Tools.isEmpty(filter)){
            filter = {};
            filter.status = {$ne:'disable'};
            filter = JSON.stringify(filter);
        }else{
            filter = '{}';
        }
        eval('E.'+entity_name+'.find('+filter+').distinct('+field+',callback)');
    }
}

exports.aggregate= function(filter,entity_name){
    return function(callback){
        eval('E.'+entity_name+'.aggregate('+filter+',callback)');
    }
}
