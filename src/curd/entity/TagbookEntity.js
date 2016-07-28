var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var TagbookSchema = new Schema({
    tag_id : String,
    bid : String,
    user_id : String,

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}

});
var tagbookModel = mongoose.model("tagbook", TagbookSchema, "tagbook");




