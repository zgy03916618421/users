var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var EmotionSchema = new Schema({
    bid: {type: String, required: true},
    user_id: {type: String, required: true},
    score: {
    	yellow: {type: Number, default: 0},
    	green: {type: Number, default: 0},
    	purple: {type: Number, default: 0},
    	blue: {type: Number, default: 0},
    	red: {type: Number, default: 0}
    },
    createtime: {type: Date, default: Date.now}
});

EmotionSchema.index({bid: 1, user_id: 1}, {unique: true});
EmotionSchema.index({'score.yellow': 1});
EmotionSchema.index({'score.green': 1});
EmotionSchema.index({'score.purple': 1});
EmotionSchema.index({'score.blue': 1});
EmotionSchema.index({'score.red': 1});

var EmotionModel = mongoose.model("emotion", EmotionSchema, "emotion");




