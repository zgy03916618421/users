var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var EmotionTextSchema = new Schema({
    emotion: {type: String, enum: ['yellow', 'green', 'purple', 'blue', 'red'], required: true},
    gender: {type: String, enum: ['male', 'female'], required: true},
    title: {type: String, required: true},
    text: {type: String, required: true},

    createdBy: {type: String, required: true},
    createtime: {type: Date, default: Date.now}
});

EmotionTextSchema.index({emotion: 1, gender: 1, createtime: -1});

var EmotionTextSchema = mongoose.model("emotiontext", EmotionTextSchema, "emotiontext");




