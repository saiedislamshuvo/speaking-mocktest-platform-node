const { dateTime } = require('express-openapi-validator/dist/framework/base.serdes');
const { Schema, model } = require('mongoose');

const mocktestSchema = new Schema(
    {
        user: {
            type: Schema.ObjectId,
            ref: 'User',
        },
        mocktestAssignTo: {
            type: String,
            enum: ['trainer', 'organization'],
            default: 'trainer',
        },
        meetingStartAt: {
            type: Date,
            require: true,
        },
        meetingLink: {
            type: String,
            maxLength: 50,
            minLength: 1,
        },
        trainer: {
            type: Schema.ObjectId,
            ref: 'Trainer',
        },
        organization: {
            type: Schema.ObjectId,
            ref: 'Organization',
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'declined', 'completed', 'expired'],
            default: 'pending',
        },
        feedback: String,
    },
    { timestamps: true, id: true },
);

const Mocktest = model('Mocktest', mocktestSchema);

module.exports = Mocktest;
