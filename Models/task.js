// models/task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: { type: String, default: 'pending' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
