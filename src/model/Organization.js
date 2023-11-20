const { Schema, model } = require('mongoose');

const organizationSchema = new Schema(
	{
		name: {
			type: String,
			maxLength: 50,
			minLength: 1,
			required: true,
		},
		email: {
			type: String,
			unique: true,
		},
		status: {
			type: String,
			enum: ['pending', 'approved', 'declined', 'blocked'],
			default: 'pending',
		},
		createdBy: {
			type: Schema.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true, id: true },
);

const Organization = model('Organization', organizationSchema);

module.exports = Organization;
