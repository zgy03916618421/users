0/**
 * find
 * @param filter
 */
exports.find = function *(filter){
    var rs = yield mongoTemplate.find(filter,'logs');
    return rs;
}

exports.findOne = function *(filter){
    var rs = yield mongoTemplate.findOne(filter,'logs');
    return rs;
}
exports.saveAsync = function (obj){
    mongoTemplate.saveAsync(obj);
}