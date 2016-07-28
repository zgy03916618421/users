var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var ValidateSchema = new Schema({
    mobile_number : String,
    account: String,
    validate_code : String,

    status : {type : String, default :"visable"},
    version : {type : Date, default : Date.now},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}
});

ValidateSchema.index({mobile_number: 1});
ValidateSchema.index({createtime: -1});

mongoose.model("validate", ValidateSchema, "validate");



