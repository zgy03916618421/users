var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var UserextSchema = new Schema({
    user_id : String,
    user_name : String,
    avatar : String,
    mobile_number : String,
    sex : String,
    birthday : Number,
    birthplace : String,
    client_ip : String,
    career : String,
    email : String,
    location : String,
    isAlpha : Boolean,
    recommend_msg : String,
    sort : Number,
    level :  {type : Number, default : 1},
    exp :  {type : Number, default : 0},
    keep_books : {type : Number, default : 0},
    book_money : {type : Number, default : 0},
    ab_strategy : String,
    invitated_code : String,
    invitation_code : String,
    point : Number,
    vip : {type : Number, default : 0},
    type: {type: String, enum: ['user', 'organization'], default: 'user'},
    organization: {type: ObjectId, ref: "organization"},

    tags : Array,
    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}

});

UserextSchema.index({user_id: 1});
UserextSchema.index({mobile_number: 1});

mongoose.model("userext", UserextSchema, "userext");




