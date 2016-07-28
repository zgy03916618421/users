var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var LogsSchema = new Schema({
    ms : Number,
    url : String,
    path : String,
    base_path : String,
    status_code : String,
    msg : String,
    ip : String,
    project : String,
    user_id : String,
    user_name : String,
    body : Object,
    params : Object,
    token : String,
    headers : Object,
    status : {type : String, default : "visible"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}

});
mongoose.model("logs", LogsSchema, "logs");




