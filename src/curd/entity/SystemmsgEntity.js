var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var SystemmsgSchema = new Schema({
    type: String,
    content : String,
    user_id : String,
    count : Number,
    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}

});
var systemmsgModel = mongoose.model("systemmsg", SystemmsgSchema, "systemmsg");




