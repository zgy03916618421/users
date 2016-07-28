var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var TopicSchema = new Schema({
    user_id : String,
    content : String,
    roles : Array,
    images : Array,
    favour : {type : Number, default :0},
    count : {type : Number, default :0},
    category : {type : String, default :"deafult"},

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}

});
var topicModel = mongoose.model("topic", TopicSchema, "topic");




