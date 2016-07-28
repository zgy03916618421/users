var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var WeixinShareLogSchema = new Schema({
    _id: {type: String, unique: true, required: true},
    parent_id: {type: String, ref: 'weixin_share_log'},
    children: [{type: String, ref: 'weixin_share_log'}],
    article_id: {type: ObjectId, ref: 'article', required: true},
    is_read: {type: Boolean, default: false},
    createuserid : {type : String, required: true},
    createtime : {type : Date, default : Date.now}
});

mongoose.model("weixinsharelog", WeixinShareLogSchema, "weixin_share_log");