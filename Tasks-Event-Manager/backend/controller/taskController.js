const Task = require('../models/Task');
const { io } = require('../server/server');
const mongoose = require('mongoose');

// Get all tasks for a user
const getTasks = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // If pagination params are present, return paginated data
        if (req.query.page || req.query.limit) {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const tasks = await Task.find({ user: req.user.id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const totalTasks = await Task.countDocuments({ user: req.user.id });
            const totalPages = Math.ceil(totalTasks / limit);

            return res.json({
                data: tasks,
                currentPage: page,
                totalPages: totalPages,
            });
        }
        // Otherwise, return all tasks for the dashboard
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create a task
const createTask = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { title, description, dueDate } = req.body;
  if (!title || !dueDate) {
    return res.status(400).json({ message: 'Please provide title and due date' });
  }
  try {
    const task = new Task({
      userId: mongoose.Types.ObjectId(req.user),
      title,
      description,
      dueDate: new Date(dueDate),
    });
    const savedTask = await task.save();
    const plainTask = savedTask.toObject();
    io.emit('taskCreated', plainTask); // Emit event
    res.status(201).json(plainTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a task
const updateTask = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { title, description, dueDate, completed } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      { title, description, dueDate, completed },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    io.emit('taskUpdated', task); // Emit event
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    io.emit('taskDeleted', { _id: req.params.id }); // Emit event with id
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };