var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ItemSchema = new Schema({
    floor_id : String,
    user_id : String,
    isbn : String,
    bid : String,
    title : String,
    publisher : String,
    pubdate : String,
    author : Array,
    cover : String,
    rating : String,
    price : String,
    remark : String,
    comment : String,
    recommender : String,
    favour :{type : Number, default :0},
    count :{type : Number, default : 0},

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}
});

ItemSchema.index({floor_id: 1, bid: 1});

var itemModel = mongoose.model("item", ItemSchema, "item");




