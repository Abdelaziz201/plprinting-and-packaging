# Planet Scribbles - Printing & Packaging Company

A comprehensive ecommerce platform for Planet Scribbles, featuring product catalog, event booking, meetups, offers, and online payment integration.

## 🚀 Features

### Core Functionality

- **Product Catalog**: Browse and search printing & packaging products
- **User Authentication**: Secure registration and login system
- **Shopping Cart**: Add products with customizations
- **Order Management**: Complete order processing and tracking
- **Payment Integration**: Secure payments via Stripe
- **Events Booking**: Register for workshops and seminars
- **Meetups**: Create and join community meetups
- **Offers System**: Discount codes and special promotions

### Technical Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: React Query for efficient data management
- **Secure Backend**: JWT authentication and input validation
- **Database**: MongoDB with Mongoose ODM
- **Modern UI**: Clean, professional design with smooth animations

## 🛠 Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Heroicons** - Beautiful SVG icons
- **React Hot Toast** - Notifications

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Stripe** - Payment processing
- **Bcrypt** - Password hashing

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Stripe account for payments

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment variables:

   ```bash
   # Copy the example file and update with your values
   cp .env.example .env
   ```

4. Update `.env` with your configuration:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/planet-scribbles
   JWT_SECRET=your_jwt_secret_key_here
   STRIPE_SECRET_KEY=your_stripe_secret_key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   FRONTEND_URL=http://localhost:3000
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🗂 Project Structure

```
planet-scribbles/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── server.js        # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── contexts/    # React contexts
│   │   ├── pages/       # Page components
│   │   ├── App.js       # Main app component
│   │   └── index.js     # Entry point
│   ├── public/
│   └── package.json
└── README.md
```

## 🎯 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories` - Get categories
- `POST /api/products` - Create product (Admin)

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events/:id/register` - Register for event

### Meetups

- `GET /api/meetups` - Get all meetups
- `POST /api/meetups` - Create meetup
- `POST /api/meetups/:id/join` - Join meetup

### Offers

- `GET /api/offers` - Get all offers
- `GET /api/offers/:code` - Get offer by code
- `POST /api/offers/validate` - Validate offer

### Payment

- `POST /api/payment/create-intent` - Create payment intent
- `POST /api/payment/confirm` - Confirm payment

## 🎨 Design System

### Colors

- **Primary**: Blue shades (#0ea5e9)
- **Secondary**: Purple shades (#d946ef)
- **Success**: Green
- **Warning**: Yellow
- **Error**: Red

### Typography

- **Font**: Inter (Google Fonts)
- **Headings**: Bold weights
- **Body**: Regular weight

## 🔧 Development

### Available Scripts

#### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

#### Frontend

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Code Style

- ESLint for JavaScript linting
- Prettier for code formatting
- Consistent naming conventions

## 🚀 Deployment

### Backend Deployment

1. Set up MongoDB Atlas or your preferred database
2. Configure environment variables for production
3. Deploy to Heroku, Railway, or your preferred platform

### Frontend Deployment

1. Build the production version: `npm run build`
2. Deploy to Netlify, Vercel, or your preferred platform
3. Update API URLs for production

## 📝 Features Roadmap

- [ ] Advanced product filtering
- [ ] Wishlist functionality
- [ ] Order tracking system
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Customer reviews
- [ ] Social media integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@planetscribbles.com or join our community meetups!

---

Built with ❤️ for Planet Scribbles - Your trusted printing & packaging partner.
