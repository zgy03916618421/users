var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var BookupSchema = new Schema({
    image : String,
    isbn : String,
    ip : String,
    userid : String,
    imei : String,
    istran: Boolean,

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : Date, default : Date.now()},
    updatetime : {type : Date, default : Date.now()}


});
var bookupModel = mongoose.model("bookup", BookupSchema, "bookup");




