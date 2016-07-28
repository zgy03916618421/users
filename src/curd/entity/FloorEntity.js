var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var FloorSchema = new Schema({
    bsid: String,
    user_id : String,
    name : String,
    desc : String,
    cover : String,
    item_list : Array,
    axis :  Array,
    decoration : {type : String, default :'public'},                     //权限修饰符 public private
    favour :{type : Number, default :0},
    count :{type : Number, default : 0},
    type : String,
    top: {type: Boolean, default: false},
    theme_id: {type: ObjectId, ref: 'theme'},

    isdefault : {type : Boolean, default : false},
    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}
});

FloorSchema.index({'user_id': 1});

var floorModel = mongoose.model("floor", FloorSchema, "floor");




