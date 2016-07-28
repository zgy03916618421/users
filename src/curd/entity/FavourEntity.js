var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var FavourSchema = new Schema({
    user_id : String,
    user_name : String,
    avatar : String,
    bid : String,
    floor_id : String,
    topic_id : String,
    article_id : String,
    aim_id : String,
    aim_name : String,
    aim_avatar : String,
    cover : String,
    type : String,

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}


});
var favourModel = mongoose.model("favour", FavourSchema, "favour");




