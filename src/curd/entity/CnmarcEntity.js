var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CnmarcSchema = new Schema({
    isbn : String,
    clc : String,
    category : String,
    clc_path : String,
    clc_first : String,
    clc_second : String,

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}


});
var cnmarcModel = mongoose.model("cnmarc", CnmarcSchema, "cnmarc");




