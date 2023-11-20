const { Schema, model } = require('mongoose');

const trainerSchema = new Schema(
    {
        status: {
            type: String,
            enum: ['pending', 'approved', 'declined', 'blocked'],
            default: 'pending',
        },
        user: {
            type: Schema.ObjectId,
            ref: 'User',
        },
        organization: {
            type: Schema.ObjectId,
            ref: 'Organization',
        },
    },
    { timestamps: true, id: true },
);

const Trainer = model('Trainer', trainerSchema);

module.exports = Trainer;
