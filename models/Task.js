const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    future: {
        type: Boolean,
        default: false,
    },
    priority: {
        type: Boolean,
        default: false,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    calendarEventId: { type: String }  // Optional, to store Google Calendar event ID
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
