const express = require('express');
const { body, validationResult } = require('express-validator');
const Offer = require('../models/Offer');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/offers
// @desc    Get all active offers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      category,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter object
    const filter = { 
      isActive: true, 
      isPublic: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    };
    
    if (type) filter.type = type;
    if (category) filter.applicableCategories = category;

    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const offers = await Offer.find(filter)
      .populate('applicableProducts', 'name price')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-usedBy');

    const total = await Offer.countDocuments(filter);

    res.json({
      offers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({ message: 'Server error while fetching offers' });
  }
});

// @route   GET /api/offers/:code
// @desc    Get offer by code and validate
// @access  Public
router.get('/:code', async (req, res) => {
  try {
    const offer = await Offer.findOne({ 
      code: req.params.code.toUpperCase(),
      isActive: true 
    }).populate('applicableProducts', 'name price');
    
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    // Check if offer is currently valid
    if (!offer.isValid()) {
      return res.status(400).json({ message: 'Offer is not currently valid' });
    }

    res.json({
      offer,
      isValid: true,
      message: 'Offer is valid'
    });
  } catch (error) {
    console.error('Get offer error:', error);
    res.status(500).json({ message: 'Server error while fetching offer' });
  }
});

// @route   POST /api/offers/validate
// @desc    Validate offer for specific user and cart
// @access  Private
router.post('/validate', auth, [
  body('code').trim().notEmpty().withMessage('Offer code is required'),
  body('cartItems').isArray({ min: 1 }).withMessage('Cart items are required'),
  body('cartTotal').isFloat({ min: 0 }).withMessage('Cart total must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, cartItems, cartTotal } = req.body;

    const offer = await Offer.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    }).populate('applicableProducts');
    
    if (!offer) {
      return res.status(404).json({ message: 'Invalid offer code' });
    }

    // Check if offer is currently valid
    if (!offer.isValid()) {
      return res.status(400).json({ message: 'Offer has expired or is not active' });
    }

    // Check if user can use this offer
    if (!offer.canUserUse(req.user._id)) {
      return res.status(400).json({ message: 'You have already used this offer' });
    }

    // Check minimum order amount
    if (cartTotal < offer.minimumOrderAmount) {
      return res.status(400).json({ 
        message: `Minimum order amount of $${offer.minimumOrderAmount} required` 
      });
    }

    // Calculate discount
    let discount = 0;
    let applicableItems = cartItems;

    // Filter applicable items if offer is product/category specific
    if (offer.applicableProducts.length > 0) {
      applicableItems = cartItems.filter(item => 
        offer.applicableProducts.some(p => p._id.toString() === item.product.toString())
      );
    } else if (offer.applicableCategories.length > 0) {
      // This would require populating product details to check categories
      // For simplicity, we'll assume all items are applicable
    }

    if (applicableItems.length === 0) {
      return res.status(400).json({ message: 'No applicable items in cart for this offer' });
    }

    const applicableTotal = applicableItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    switch (offer.type) {
      case 'percentage':
        discount = applicableTotal * (offer.value / 100);
        break;
      case 'fixed_amount':
        discount = Math.min(offer.value, applicableTotal);
        break;
      case 'free_shipping':
        discount = 10; // Assuming $10 shipping cost
        break;
      case 'buy_one_get_one':
        // Simplified BOGO logic
        discount = applicableTotal * 0.5;
        break;
    }

    // Apply maximum discount limit
    if (offer.maximumDiscount && discount > offer.maximumDiscount) {
      discount = offer.maximumDiscount;
    }

    res.json({
      isValid: true,
      discount: Math.round(discount * 100) / 100,
      offer: {
        id: offer._id,
        title: offer.title,
        code: offer.code,
        type: offer.type,
        value: offer.value
      }
    });
  } catch (error) {
    console.error('Validate offer error:', error);
    res.status(500).json({ message: 'Server error while validating offer' });
  }
});

// @route   POST /api/offers
// @desc    Create new offer (Admin only)
// @access  Private/Admin
router.post('/', adminAuth, [
  body('title').trim().isLength({ min: 3 }).withMessage('Offer title must be at least 3 characters'),
  body('code').trim().isLength({ min: 3 }).withMessage('Offer code must be at least 3 characters'),
  body('type').isIn(['percentage', 'fixed_amount', 'buy_one_get_one', 'free_shipping']).withMessage('Invalid offer type'),
  body('value').isFloat({ min: 0 }).withMessage('Offer value must be a positive number'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const offer = new Offer({
      ...req.body,
      code: req.body.code.toUpperCase()
    });

    await offer.save();

    res.status(201).json({
      message: 'Offer created successfully',
      offer
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Offer code already exists' });
    }
    console.error('Create offer error:', error);
    res.status(500).json({ message: 'Server error while creating offer' });
  }
});

module.exports = router;

