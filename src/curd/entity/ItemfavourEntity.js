var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ItemfavourSchema = new Schema({
    user_id : String,
    user_name : String,
    avatar : String,
    floor_id : String,
    item_id : String,
    aim_id : String,
    aim_name : String,
    aim_avatar : String,
    title : String,
    cover : String,
    type : String,
    value : Number,

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}

});
var itemfavourModel = mongoose.model("itemfavour", ItemfavourSchema, "itemfavour");




