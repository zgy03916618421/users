var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var ThirdSchema = new Schema({
    type: String,
    openid: String,
    uuid : String,
    user_id : String,
    user_name: String,
    avatar: String,
    mobile_number: String,
    originalopenid: String,

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}

});
mongoose.model("third", ThirdSchema, "third");




