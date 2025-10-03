const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Product = require('./models/Product');
const Event = require('./models/Event');
const Meetup = require('./models/Meetup');
const Offer = require('./models/Offer');

// Sample data
const sampleProducts = [
  {
    name: 'Premium Business Cards',
    description: 'High-quality business cards with premium finishes. Perfect for making a lasting impression.',
    category: 'business-cards',
    price: 29.99,
    comparePrice: 39.99,
    images: [{ url: '/api/placeholder/300/200', alt: 'Premium Business Cards' }],
    specifications: {
      material: 'Premium cardstock',
      dimensions: '3.5" x 2"',
      finish: 'Matte or Glossy'
    },
    stock: 100,
    featured: true,
    tags: ['business', 'cards', 'premium', 'professional']
  },
  {
    name: 'Custom Packaging Boxes',
    description: 'Durable custom packaging boxes for your products. Various sizes and designs available.',
    category: 'boxes',
    price: 45.00,
    images: [{ url: '/api/placeholder/300/200', alt: 'Custom Packaging Boxes' }],
    specifications: {
      material: 'Corrugated cardboard',
      dimensions: 'Custom sizes',
      finish: 'Custom printing'
    },
    stock: 50,
    featured: true,
    tags: ['packaging', 'boxes', 'custom', 'shipping']
  },
  {
    name: 'Marketing Brochures',
    description: 'Eye-catching brochures to showcase your business. Full-color printing on quality paper.',
    category: 'brochures',
    price: 35.00,
    images: [{ url: '/api/placeholder/300/200', alt: 'Marketing Brochures' }],
    specifications: {
      material: 'Glossy paper',
      dimensions: '8.5" x 11"',
      finish: 'Full-color printing'
    },
    stock: 75,
    featured: true,
    tags: ['brochures', 'marketing', 'full-color', 'business']
  },
  {
    name: 'Vinyl Banners',
    description: 'Weather-resistant vinyl banners for outdoor advertising. Custom sizes and designs.',
    category: 'banners',
    price: 89.99,
    images: [{ url: '/api/placeholder/300/200', alt: 'Vinyl Banners' }],
    specifications: {
      material: '13oz vinyl',
      dimensions: 'Custom sizes',
      finish: 'Weather-resistant'
    },
    stock: 25,
    featured: false,
    tags: ['banners', 'vinyl', 'outdoor', 'advertising']
  },
  {
    name: 'Custom Labels & Stickers',
    description: 'High-quality labels and stickers for products, packaging, and promotional use.',
    category: 'labels',
    price: 19.99,
    images: [{ url: '/api/placeholder/300/200', alt: 'Custom Labels' }],
    specifications: {
      material: 'Vinyl or paper',
      dimensions: 'Various sizes',
      finish: 'Waterproof options'
    },
    stock: 200,
    featured: false,
    tags: ['labels', 'stickers', 'custom', 'waterproof']
  },
  {
    name: 'Gift Bags',
    description: 'Elegant gift bags for special occasions. Various sizes and colors available.',
    category: 'bags',
    price: 12.99,
    images: [{ url: '/api/placeholder/300/200', alt: 'Gift Bags' }],
    specifications: {
      material: 'Premium paper',
      dimensions: 'Small, Medium, Large',
      finish: 'Matte with handles'
    },
    stock: 150,
    featured: false,
    tags: ['gifts', 'bags', 'occasions', 'premium']
  }
];

const sampleEvents = [
  {
    title: 'Introduction to Print Design',
    description: 'Learn the basics of print design, color theory, and typography. Perfect for beginners.',
    category: 'workshop',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    time: { start: '10:00 AM', end: '2:00 PM' },
    location: {
      venue: 'Planet Scribbles Studio',
      address: '123 Business Street',
      city: 'City',
      state: 'State',
      zipCode: '12345'
    },
    price: 49.99,
    capacity: 20,
    featured: true,
    tags: ['design', 'beginner', 'workshop']
  },
  {
    title: 'Packaging Design Masterclass',
    description: 'Advanced techniques for creating compelling packaging designs that sell.',
    category: 'seminar',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    time: { start: '1:00 PM', end: '5:00 PM' },
    location: {
      venue: 'Conference Center',
      address: '456 Design Avenue',
      city: 'City',
      state: 'State',
      zipCode: '12345'
    },
    price: 89.99,
    capacity: 30,
    featured: true,
    tags: ['packaging', 'advanced', 'masterclass']
  }
];

const sampleOffers = [
  {
    title: 'New Customer Special',
    description: 'Get 20% off your first order! Use code WELCOME20 at checkout.',
    type: 'percentage',
    value: 20,
    code: 'WELCOME20',
    minimumOrderAmount: 25,
    maximumDiscount: 50,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    targetAudience: 'new_customers',
    usageLimit: 100,
    userUsageLimit: 1
  },
  {
    title: 'Free Shipping Weekend',
    description: 'Free shipping on all orders this weekend! No minimum required.',
    type: 'free_shipping',
    value: 10,
    code: 'FREESHIP',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    targetAudience: 'all',
    usageLimit: null,
    userUsageLimit: 1
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Event.deleteMany({});
    await Meetup.deleteMany({});
    await Offer.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@planetscribbles.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true
    });
    await adminUser.save();
    console.log('Created admin user');

    // Create sample customer
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customerUser = new User({
      name: 'John Doe',
      email: 'customer@example.com',
      password: customerPassword,
      role: 'customer',
      isVerified: true,
      phone: '+1 (555) 123-4567',
      address: {
        street: '789 Customer Lane',
        city: 'City',
        state: 'State',
        zipCode: '12345',
        country: 'United States'
      }
    });
    await customerUser.save();
    console.log('Created sample customer');

    // Seed products
    await Product.insertMany(sampleProducts);
    console.log('Seeded products');

    // Seed events
    await Event.insertMany(sampleEvents);
    console.log('Seeded events');

    // Create sample meetup
    const sampleMeetup = new Meetup({
      title: 'Creative Entrepreneurs Networking',
      description: 'Connect with fellow creative entrepreneurs and share experiences.',
      organizer: customerUser._id,
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      time: { start: '6:00 PM', end: '8:00 PM' },
      location: {
        venue: 'Community Center',
        address: '321 Community Street',
        city: 'City',
        state: 'State',
        zipCode: '12345'
      },
      maxAttendees: 25,
      category: 'networking',
      tags: ['networking', 'entrepreneurs', 'creative']
    });
    await sampleMeetup.save();
    console.log('Created sample meetup');

    // Seed offers
    await Offer.insertMany(sampleOffers);
    console.log('Seeded offers');

    console.log('Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@planetscribbles.com / admin123');
    console.log('Customer: customer@example.com / customer123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
seedDatabase();
