var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ArticleSchema = new Schema({
    number : Number,
    title : String,
    author : String,
    author_intro : String,
    cover_picture_url : String,
    tags : Array,
    content : String,
    creator : String,
    bids : Array,
    related_authors : Array,
    related_books: Array,
    article_rank : Number,
    web_url : String,
    favimg : String,
    publisher : String,
    summary : String,
    favour :{type : Number, default :0},
    count :{type : Number, default : 0},
    top: {type: Boolean, default: false},
    user_id: String,

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()},

});
var articleModel = mongoose.model("article", ArticleSchema, "article");
