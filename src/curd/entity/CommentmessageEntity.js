var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var commentmessageSchema = new Schema({
    bid : String,
    owner_id : String,
    sender_id : String,
    receiver_id : String,
    floor : Object,
    item : Object,
    review : Object,
    topic : Object,

    //下面为历史遗留问题仍然在用
    floor_id : String,
    floor_owner_id : String,
    floor_owner_name : String,
    floor_owner_avatar : String,
    floor_owner_id : String,
    floor_owner_name : String,
    floor_owner_avatar : String,
    item_id : String,
    item_owner_id : String,
    item_owner_name : String,
    item_owner_avatar : String,
    review_id : String,
    review_owner_id : String,
    topic_id : String,
    content : String,
    cover : String,
    author : String,
    publisher : String,
    title : String,
    summary : String,
    sender_name : String ,
    receiver_name : String,
    sender_avatar : String,
    type : String,
    style : String,
    status : {type : String, default : "visible"},   //状态分别可以为 visible,hidden,deleted
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}

});
var commentmessageModel = mongoose.model("commentmessage", commentmessageSchema, "commentmessage");




