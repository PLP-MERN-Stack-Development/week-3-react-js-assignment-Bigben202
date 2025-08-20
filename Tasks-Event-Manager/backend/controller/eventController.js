const Event = require('../models/Event');
const { io } = require('../server/server');
const mongoose = require('mongoose');

// Get all events for a user
const getEvents = async (req, res) => {
    try {
        // If pagination params are present, return paginated data
        if (req.query.page || req.query.limit) {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const events = await Event.find({ user: req.user.id })
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit);
            
            const totalEvents = await Event.countDocuments({ user: req.user.id });
            const totalPages = Math.ceil(totalEvents / limit);

            return res.json({
                data: events,
                currentPage: page,
                totalPages: totalPages,
            });
        }

        // Otherwise, return all events for the dashboard
        const events = await Event.find({ user: req.user.id }).sort({ date: -1 });
        res.json(events);

    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create an event
const createEvent = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: No user in request' });
  }
  if (!mongoose.Types.ObjectId.isValid(req.user)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  const { title, description, startDate, endDate, recurrence } = req.body;
  if (!title || !startDate || !endDate) {
    return res.status(400).json({ message: 'Please provide title, start date, and end date' });
  }
  // Defensive: Check startDate and endDate are valid dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ message: 'Invalid start or end date' });
  }
  try {
    const event = new Event({
      userId: mongoose.Types.ObjectId(req.user),
      title,
      description,
      startDate: start,
      endDate: end,
      recurrence
    });
    const savedEvent = await event.save();
    let plainEvent = savedEvent.toObject();
    if (plainEvent.userId && typeof plainEvent.userId === 'object') {
      plainEvent.userId = String(plainEvent.userId._id || plainEvent.userId);
    }
    try {
      console.log('Emitting eventCreated:', JSON.stringify(plainEvent));
      io.emit('eventCreated', plainEvent);
    } catch (emitErr) {
      console.error('Error emitting eventCreated:', emitErr);
    }
    res.status(201).json(plainEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an event
const updateEvent = async (req, res) => {
  const { title, description, startDate, endDate, recurrence } = req.body;
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      { title, description, startDate, endDate, recurrence },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    io.emit('eventUpdated', event); // Emit event
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, userId: req.user });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    io.emit('eventDeleted', { _id: req.params.id }); // Emit event with id
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };