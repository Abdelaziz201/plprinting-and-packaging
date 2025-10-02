const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      upcoming = 'true',
      sort = 'date',
      order = 'asc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (upcoming === 'true') {
      filter.date = { $gte: new Date() };
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const events = await Event.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-registrations');

    const total = await Event.countDocuments(filter);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error while fetching events' });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, isActive: true })
      .populate('registrations.user', 'name');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error while fetching event' });
  }
});

// @route   POST /api/events/:id/register
// @desc    Register for event
// @access  Private
router.post('/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, isActive: true });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event is in the future
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot register for past events' });
    }

    // Check if user is already registered
    const existingRegistration = event.registrations.find(
      reg => reg.user.toString() === req.user._id.toString()
    );

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check capacity
    const activeRegistrations = event.registrations.filter(reg => reg.status === 'registered');
    if (activeRegistrations.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Add registration
    event.registrations.push({
      user: req.user._id,
      paymentStatus: event.price > 0 ? 'pending' : 'paid'
    });

    await event.save();

    res.json({
      message: 'Successfully registered for event',
      event: {
        id: event._id,
        title: event.title,
        date: event.date,
        price: event.price
      }
    });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   DELETE /api/events/:id/register
// @desc    Cancel event registration
// @access  Private
router.delete('/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, isActive: true });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Find and remove registration
    const registrationIndex = event.registrations.findIndex(
      reg => reg.user.toString() === req.user._id.toString()
    );

    if (registrationIndex === -1) {
      return res.status(400).json({ message: 'Not registered for this event' });
    }

    // Check if cancellation is allowed (e.g., not too close to event date)
    const eventDate = new Date(event.date);
    const now = new Date();
    const hoursUntilEvent = (eventDate - now) / (1000 * 60 * 60);

    if (hoursUntilEvent < 24) {
      return res.status(400).json({ 
        message: 'Cannot cancel registration less than 24 hours before event' 
      });
    }

    event.registrations.splice(registrationIndex, 1);
    await event.save();

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ message: 'Server error during cancellation' });
  }
});

// @route   POST /api/events
// @desc    Create new event (Admin only)
// @access  Private/Admin
router.post('/', adminAuth, [
  body('title').trim().isLength({ min: 3 }).withMessage('Event title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['workshop', 'seminar', 'exhibition', 'networking', 'training']).withMessage('Invalid category'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = new Event(req.body);
    await event.save();

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error while creating event' });
  }
});

module.exports = router;
