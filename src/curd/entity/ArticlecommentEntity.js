var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var articlecommentSchema = new Schema({
    article_id : String,
    content : String,
    sender_id : String,
    receiver_id : String,
    style : {type : String, default : "normal"},

    status : {type : String, default : "visible"},   //状态分别可以为 visible,hidden,deleted
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}
});
var articleModel = mongoose.model("articlecomment", articlecommentSchema, "articlecomment");




