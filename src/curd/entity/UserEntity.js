var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var UserSchema = new Schema({
    user_id : String,
    mobile_number : String,
    email: {type: String, pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/},
    password : String,
    avatar : String,
    user_name : String,
    app_id : String,
    user_agent : String,
    client_ip : String,
    location : String,      //ËùÔÚµØ
    keep_books : {type : Number, default : 0},
    book_money : {type : Number, default : 0},
    gender : {type: Number, enum: [1, 2], default: 1},
    invitated_code: {type: String},
    invitation_code: {type: String},
    vip: {type: Number, default: 0},
    type: {type: String, enum: ['user', 'organization'], default: 'user'},
    organization: {type: ObjectId, ref: "organization"},

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()},
    language:String,
    nickname:String,
    city:String,
    province:String,
    country:String,
    headimage:String
});

UserSchema.index({email: 1}, {unique: 1, sparse: true});

mongoose.model("user", UserSchema, "user");