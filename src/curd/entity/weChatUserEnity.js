/**
 * Created by Administrator on 2016/7/26.
 */
var mongoose=require('mongoose'),
    Schema=mongoose.Schema,
    ObjectId=Schema.ObjectId;

var weChatUerSchema=new Schema({
    openid:String,
    nickname:String,
    sex:{type: Number, enum: [1, 2], default: 1},
    language:String,
    city:String,
    province:String,
    country:String,
    headimgurl:String,
    privilege:Array,
    type:String
});
weChatUserSchema.index({openid:1});
mongoose.model("weChatUser", weChatUserSchema, "weChatUser");

