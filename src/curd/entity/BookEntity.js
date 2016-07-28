var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var BookSchema = new Schema({
    bid : String,
    url : String,
    smurl : String,
    midurl : String,
    shelfid : String,
    isbn : String ,
    clc : String,
    clc_first : String,
    clc_second : String,

    isgetful : Boolean,
    isgetcheck : Boolean,
    isbuild : Boolean,
    sources : {type: String, default: 'byManual'},
    from: {type: String, enum: ['douban', 'amazon'], default: 'douban'},
    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}


});
var bookModel = mongoose.model("book", BookSchema, "book");




