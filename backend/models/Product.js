const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['printing', 'packaging', 'business-cards', 'banners', 'brochures', 'boxes', 'bags', 'labels']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  comparePrice: {
    type: Number,
    min: 0
  },
  images: [{
    url: String,
    alt: String
  }],
  specifications: {
    material: String,
    dimensions: String,
    weight: String,
    color: String,
    finish: String
  },
  customizable: {
    type: Boolean,
    default: false
  },
  customOptions: [{
    name: String,
    type: {
      type: String,
      enum: ['text', 'select', 'color', 'file']
    },
    options: [String],
    required: Boolean,
    additionalCost: Number
  }],
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderQuantity: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  seo: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);

