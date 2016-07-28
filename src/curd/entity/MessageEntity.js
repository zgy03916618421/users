'use strict';
/* jshint node: true */

var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var MessageSchema = new Schema({
	user: {type: ObjectId, ref: 'userext', required: true},
	user_id: {type: String, required: true},
	type: {type: String, enum: ['book_audit'], required: true},
	content: {type: String, required: true},
	is_read: {type: Boolean, default: false},
	params: {type: Schema.Types.Mixed},

	created_at: {type: Date, default: Date.now}
});

mongoose.model('message', MessageSchema, 'message');

module.exports = MessageSchema;