var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var BookshelfSchema = new Schema({
    user_id : String,
    name : String,
    desc : String,
    cover : String,
    floor_list : Array,
    favour :{type : Number, default :0},
    count :{type : Number, default : 0},

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}

});
var bookshelfModel = mongoose.model("bookshelf", BookshelfSchema, "bookshelf");




