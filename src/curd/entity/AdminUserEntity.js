var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var AdminUserSchema = new Schema({
    userid : String,
    username : String,
    password : String,
    auth : Array,
    task_users : Array,
    ischecked : Boolean,

    type : {type : String, default : "admin"},    
    way : {type : String, default : "web"},       
    version : {type : Number, default : Date.now()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : Date, default : Date.now()},
    updatetime : {type : Date, default : Date.now()}
});

mongoose.model("adminuser", AdminUserSchema, "admin_user");

module.exports = AdminUserSchema;


