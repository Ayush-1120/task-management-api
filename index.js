// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Task = require('./models/task');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/taskmanagement', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

app.use(bodyParser.json());

// Set up sessions
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set up Passport local strategy
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        // Check if the user is an admin
        if (req.user.isAdmin) {
            return next(); // Admin has full access
        }
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

// ...

// Register a new user
app.post('/register', async (req, res) => {
    try {
        const { username, password, isAdmin } = req.body;
        const user = new User({ username, isAdmin });
        await User.register(user, password);
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'Login successful' });
});

// Logout
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// CRUD operations

// Create a new task
app.post('/tasks', isAuthenticated, async (req, res) => {
    try {
        const task = new Task({ ...req.body, user: req.user._id });
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve all tasks with pagination
app.get('/tasks', isAuthenticated, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; // Default limit is 10 tasks per page

        let query;
        if (req.user.isAdmin) {
            // Admin gets all tasks
            query = Task.find();
        } else {
            // Regular user gets tasks owned by them
            query = Task.find({ user: req.user._id });
        }

        const tasks = await query
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get task by id
app.get('/tasks/:id', isAuthenticated, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a task
app.put('/tasks/:id', isAuthenticated, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a task
app.delete('/tasks/:id', isAuthenticated, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ...

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
