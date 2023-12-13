// models/task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: { type: String, default: 'pending' },
    // You might want to include a user reference here if you plan to add authentication
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
