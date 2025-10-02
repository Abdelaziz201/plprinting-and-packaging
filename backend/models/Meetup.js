const mongoose = require('mongoose');

const meetupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    start: String,
    end: String
  },
  location: {
    venue: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    isOnline: {
      type: Boolean,
      default: false
    },
    onlineLink: String
  },
  maxAttendees: {
    type: Number,
    required: true,
    min: 2
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['joined', 'maybe', 'declined'],
      default: 'joined'
    }
  }],
  category: {
    type: String,
    enum: ['business', 'networking', 'creative', 'educational', 'social'],
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },
  tags: [String],
  images: [{
    url: String,
    alt: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for available spots
meetupSchema.virtual('availableSpots').get(function() {
  return this.maxAttendees - this.attendees.filter(att => att.status === 'joined').length;
});

module.exports = mongoose.model('Meetup', meetupSchema);

