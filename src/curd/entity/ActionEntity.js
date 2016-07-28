var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ActionSchema = new Schema({
    bsid: String,
    user_id : String ,
    receiver_id : String,
    bid : String,
    floor_id : String,
    target : String,                //floor ���� item
    type : String,                   //ö��   add   move  delete
    from_floor : Number,            //������Ϊ������ʱ�����㲻Ϊ��ǰ��ܣ�����Ϊ��
    to_floor : Number,              //�ƶ���Ŀ���
    from_index : Number,            //��������
    to_index : Number,              //�յ������
    floor_id : String,

    status : {type : String, default :"visable"},
    version : {type : Date, default : new Date()},
    createuserid : {type : String, default : "admin"},
    updateuserid : {type : String, default : "admin"},
    createtime : {type : String, default : new Date().valueOf()},
    updatetime : {type : String, default : new Date().valueOf()}


});
var actionModel = mongoose.model("action", ActionSchema, "action");




