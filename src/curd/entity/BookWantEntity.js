var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var BookWantSchema = new Schema({
	user_id: {type: String, required: true},
	book_id: {type: String, required: true},
	user: {type: ObjectId, ref: 'user', required: true},
	book: {type: ObjectId, ref: 'bookful', required: true},
	want: {type: Boolean, default: true},

	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now}
});

BookWantSchema.index({user_id: 1, book_id: 1}, {unique: 1});

mongoose.model('bookwant', BookWantSchema, 'book_want');

module.exports = BookWantSchema;