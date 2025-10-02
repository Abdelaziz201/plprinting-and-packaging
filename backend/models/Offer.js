const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed_amount', 'buy_one_get_one', 'free_shipping'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  minimumOrderAmount: {
    type: Number,
    default: 0
  },
  maximumDiscount: {
    type: Number
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [String],
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usageCount: {
    type: Number,
    default: 0
  },
  userUsageLimit: {
    type: Number,
    default: 1
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    orderNumber: String
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  targetAudience: {
    type: String,
    enum: ['all', 'new_customers', 'returning_customers', 'vip_customers'],
    default: 'all'
  },
  image: {
    url: String,
    alt: String
  }
}, {
  timestamps: true
});

// Check if offer is currently valid
offerSchema.methods.isValid = function() {
  const now = new Date();
  return this.isActive && 
         this.startDate <= now && 
         this.endDate >= now &&
         (this.usageLimit === null || this.usageCount < this.usageLimit);
};

// Check if user can use this offer
offerSchema.methods.canUserUse = function(userId) {
  if (!this.isValid()) return false;
  
  const userUsage = this.usedBy.filter(usage => 
    usage.user.toString() === userId.toString()
  ).length;
  
  return userUsage < this.userUsageLimit;
};

module.exports = mongoose.model('Offer', offerSchema);

