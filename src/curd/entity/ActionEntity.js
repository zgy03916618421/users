var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ActionSchema = new Schema({
    bsid: String,
    user_id : String ,
    receiver_id : String,
    bid : String,
    floor_id : String,
    target : String,                //floor 或者 item
    type : String,                   //枚举   add   move  delete
    from_floor : Number,            //当动作为新增的时候，起点层不为当前书架，所以为空
    to_floor : Number,              //移动到目标层
    from_index : Number,            //起点排序号
    to_index : Number,              //终点排序号
    floor_id : String,

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}


});
var actionModel = mongoose.model("action", ActionSchema, "action");




