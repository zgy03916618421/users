var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ReviewSchema = new Schema({
    bid : String,                  //书ID
    user_id : String,
    user_name : String,
    content : String,
    avatar : String,
    cover : String,
    author : Array,
    publisher : String,
    title : String,
    mood : {type : Number, default : 0},
    count: {type : Number, default : 0},
    favour: {type : Number, default : 0},

    status : {type : String, default : "visible"},   //状态分别可以为 visible,hidden,deleted
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}

});
var reviewModel = mongoose.model("review", ReviewSchema, "review");




