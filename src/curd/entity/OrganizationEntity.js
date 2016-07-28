'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

let OrganizationSchema = new Schema({
	name: {type: String, requied: true},
	owner_name: {type: String, required: true},
	owner_contact: {type: String, required: true},
	intro: {type: String, required: true},
	address: {type: String},
	business_time: {type: String},
	avatar: {type: String, pattern: /^(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?$/i},

	status: {type: String, enum: ['unchecked', 'visable', 'disable'], default: 'unchecked'},
	created_at: {type: Date, default: Date.now},
	created_by: {type: String, required: true},
	updated_at: {type: Date, default: Date.now},
	updated_by: {type: String, required: true}
});

mongoose.model('organization', OrganizationSchema, 'organization');

module.exports = OrganizationSchema;