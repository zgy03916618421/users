var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var BookfulSchema = new Schema({
    bid : String,
    title : String,
    subtitle : String,
    origin_title : String,
    author : Array,
    authors: Array,
    author_intro : String,
    pubdate : String,
    publisher : String,
    translator : Array,        //译者
    image : String ,           //封面
    images : Object ,           //封面
    catalog : String,          //分类
    pages : String,
    isbn10 : String,
    isbn13 : String,
    summary : String,
    price : String,
    price_detail: Object,
    binding: String,        //装订
    tags : Array,
    rating : Object,
    copyright_page : String,
    clc : String,
    clc_first : String,
    clc_second : String,
    emotion_score : Object,
    spine_url: String,

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}

});

BookfulSchema.index({status: 1, bid: 1});

var bookfulModel = mongoose.model("bookful", BookfulSchema, "bookful");




