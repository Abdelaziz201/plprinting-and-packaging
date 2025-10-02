const express = require('express');
const { body, validationResult } = require('express-validator');
const Meetup = require('../models/Meetup');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/meetups
// @desc    Get all meetups with filtering and pagination
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
    const filter = { isActive: true, isPublic: true };
    
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

    const meetups = await Meetup.find(filter)
      .populate('organizer', 'name')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-attendees');

    const total = await Meetup.countDocuments(filter);

    res.json({
      meetups,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get meetups error:', error);
    res.status(500).json({ message: 'Server error while fetching meetups' });
  }
});

// @route   GET /api/meetups/:id
// @desc    Get single meetup
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const meetup = await Meetup.findOne({ _id: req.params.id, isActive: true })
      .populate('organizer', 'name email')
      .populate('attendees.user', 'name');
    
    if (!meetup) {
      return res.status(404).json({ message: 'Meetup not found' });
    }

    res.json(meetup);
  } catch (error) {
    console.error('Get meetup error:', error);
    res.status(500).json({ message: 'Server error while fetching meetup' });
  }
});

// @route   POST /api/meetups
// @desc    Create new meetup
// @access  Private
router.post('/', auth, [
  body('title').trim().isLength({ min: 3 }).withMessage('Meetup title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['business', 'networking', 'creative', 'educational', 'social']).withMessage('Invalid category'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('maxAttendees').isInt({ min: 2 }).withMessage('Max attendees must be at least 2')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const meetup = new Meetup({
      ...req.body,
      organizer: req.user._id
    });

    await meetup.save();
    await meetup.populate('organizer', 'name email');

    res.status(201).json({
      message: 'Meetup created successfully',
      meetup
    });
  } catch (error) {
    console.error('Create meetup error:', error);
    res.status(500).json({ message: 'Server error while creating meetup' });
  }
});

// @route   POST /api/meetups/:id/join
// @desc    Join meetup
// @access  Private
router.post('/:id/join', auth, async (req, res) => {
  try {
    const meetup = await Meetup.findOne({ _id: req.params.id, isActive: true });
    
    if (!meetup) {
      return res.status(404).json({ message: 'Meetup not found' });
    }

    // Check if meetup is in the future
    if (new Date(meetup.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot join past meetups' });
    }

    // Check if user is already attending
    const existingAttendee = meetup.attendees.find(
      att => att.user.toString() === req.user._id.toString()
    );

    if (existingAttendee) {
      return res.status(400).json({ message: 'Already joined this meetup' });
    }

    // Check capacity
    const activeAttendees = meetup.attendees.filter(att => att.status === 'joined');
    if (activeAttendees.length >= meetup.maxAttendees) {
      return res.status(400).json({ message: 'Meetup is full' });
    }

    // Add attendee
    meetup.attendees.push({
      user: req.user._id,
      status: meetup.requiresApproval ? 'maybe' : 'joined'
    });

    await meetup.save();

    res.json({
      message: meetup.requiresApproval ? 
        'Join request sent for approval' : 
        'Successfully joined meetup',
      meetup: {
        id: meetup._id,
        title: meetup.title,
        date: meetup.date
      }
    });
  } catch (error) {
    console.error('Join meetup error:', error);
    res.status(500).json({ message: 'Server error while joining meetup' });
  }
});

// @route   DELETE /api/meetups/:id/join
// @desc    Leave meetup
// @access  Private
router.delete('/:id/join', auth, async (req, res) => {
  try {
    const meetup = await Meetup.findOne({ _id: req.params.id, isActive: true });
    
    if (!meetup) {
      return res.status(404).json({ message: 'Meetup not found' });
    }

    // Find and remove attendee
    const attendeeIndex = meetup.attendees.findIndex(
      att => att.user.toString() === req.user._id.toString()
    );

    if (attendeeIndex === -1) {
      return res.status(400).json({ message: 'Not attending this meetup' });
    }

    meetup.attendees.splice(attendeeIndex, 1);
    await meetup.save();

    res.json({ message: 'Left meetup successfully' });
  } catch (error) {
    console.error('Leave meetup error:', error);
    res.status(500).json({ message: 'Server error while leaving meetup' });
  }
});

module.exports = router;

