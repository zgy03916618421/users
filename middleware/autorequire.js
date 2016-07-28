var fs = require("fs");
var sep = require("path").sep;
var co_body = require('co-body');
var config = require("../config/config");
var mongoose = require("mongoose");
var controller_mod = {};
var service_mod =  {};
var entity_mod = {};
global.request = require('superagent');
global.bodyParse = function *(req){
    req.req_body = yield co_body(req);
    return req.req_body;
}
global.parse = require('co-busboy');

var autoRequire = function() {
    var path = config.baseDir + config.autoRequirePath;
    ls(path);
    imports( config.autoRequireFloder[0] );
    imports( config.autoRequireFloder[1] );
    global.C = controller_mod;
    global.S = service_mod;
    global.E = entity_mod;
}();

function ls(filepath){
    if( filepath.indexOf(".svn")> -1 ) return;
    var files = fs.readdirSync(filepath);
    for(fn in files) {
        var filePathItem = filepath + sep + files[fn];
        var stat = fs.lstatSync(filePathItem);
        if (stat.isDirectory()) {
            ls(filePathItem);
        }
        else {
            var fileName = filePathItem.substring(filePathItem.lastIndexOf(sep) + 1).split('.js')[0];
            if (fileName.indexOf("Controller") > -1) {
                controller_mod[fileName] = require(filePathItem);
            }
            else if (fileName.indexOf("Service") > -1) {
                service_mod[fileName] = require(filePathItem);
            }else if (fileName.indexOf("Entity") > -1) {
                require(filePathItem);
                var fileNameItem = fileName.substring(0,fileName.length-6).toLowerCase();
                entity_mod[fileNameItem] = mongoose.model(fileNameItem);
            }
        }
    }
};

function imports(floder){
    var path = config.baseDir + config.autoRequirePath + sep + floder;
    var filearray = fs.readdirSync(path);
    if(filearray){
        filearray.forEach(function(value){
            if( value.indexOf(".git") > -1 ) return;
            if(~value.indexOf(".js")) var val = value.split(".js")[0];
            try{
                global[val] = require(path + sep + val);
            }catch (e){
                console.error("imports: " + e.stack);
            }
        });
    }

};

