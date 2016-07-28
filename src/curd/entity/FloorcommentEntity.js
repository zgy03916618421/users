var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var floorcommentSchema = new Schema({
    floor_id : String,
    floor_owner_id : String,
    floor_owner_name : String,
    floor_owner_avatar : String,
    sender_id : String,
    receiver_id : String,
    content : String,
    title : String,
    cover : String,
    summary : String,
    sender_name : String ,
    receiver_name : String,
    sender_avatar : String,
    style : String,

    status : {type : String, default : "visible"},   //状态分别可以为 visible,hidden,deleted
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}


});
var floorcommentModel = mongoose.model("floorcomment", floorcommentSchema, "floorcomment");




