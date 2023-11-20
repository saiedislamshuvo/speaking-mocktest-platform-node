const { Schema, model } = require('mongoose');

const userSchema = new Schema(
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
		password: String,
		role: {
			type: String,
			enum: ['user', 'trainer', 'admin'],
			default: 'user',
		},
		status: {
			type: String,
			enum: ['pending', 'approved', 'declined', 'blocked'],
			default: 'approved',
		},
	},
	{ timestamps: true, id: true },
);

const User = model('User', userSchema);

module.exports = User;
