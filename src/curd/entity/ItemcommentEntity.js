var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var itemcommentSchema = new Schema({
    floor_id : String,
    item_id : String,
    item_owner_id : String,
    item_owner_name : String,
    item_owner_avatar : String,
    sender_id : String,
    receiver_id : String,
    content : String,
    title : String,
    sender_name : String ,
    receiver_name : String,
    sender_avatar : String,
    style : {type : String, default : "normal"},

    status : {type : String, default : "visible"},   //状态分别可以为 visible,hidden,deleted
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}

});
var itemcommentModel = mongoose.model("itemcomment", itemcommentSchema, "itemcomment");




