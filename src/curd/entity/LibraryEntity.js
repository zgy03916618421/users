var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var LibrarySchema = new Schema({
    user_id : String,
    bid : String,
    title : String,
    publisher : String,
    pubdate : String,
    translator : Array,
    author : Array,
    cover : String,
    rating : String,
    price : String,
    isbn : String,
    copyright_page : String,
    remark: String,
    remark_images : Array,
    clc : String,
    clc_first : String,
    clc_second : String,
    sources : String,
    favour :{type : Number, default :0},
    count :{type : Number, default : 0},
    location : {type : Array, default : []},
    read_status: {type: String, enum: ['unread', 'reading', 'read'], default: 'unread'},
    read_status_update_time: {type: Date, default: Date.now},

    status : {type : String, default :"visable"},
    version : {type : Date, default : Date.now},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()},

});

var libraryModel = mongoose.model("library", LibrarySchema, "library");




