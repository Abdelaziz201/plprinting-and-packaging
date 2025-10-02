import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import {
  PrinterIcon,
  GiftIcon,
  CalendarDaysIcon,
  UsersIcon,
  TagIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const Home = () => {
  // Fetch featured products
  const { data: featuredProducts } = useQuery(
    'featuredProducts',
    () => axios.get('/api/products?featured=true&limit=6').then(res => res.data),
    { staleTime: 10 * 60 * 1000 }
  );

  // Fetch upcoming events
  const { data: upcomingEvents } = useQuery(
    'upcomingEvents',
    () => axios.get('/api/events?limit=3').then(res => res.data),
    { staleTime: 5 * 60 * 1000 }
  );

  const features = [
    {
      icon: PrinterIcon,
      title: 'Quality Printing',
      description: 'Professional printing services with premium materials and cutting-edge technology.',
    },
    {
      icon: GiftIcon,
      title: 'Custom Packaging',
      description: 'Bespoke packaging solutions tailored to your brand and product requirements.',
    },
    {
      icon: CalendarDaysIcon,
      title: 'Events & Workshops',
      description: 'Join our educational events and workshops to learn about printing and design.',
    },
    {
      icon: UsersIcon,
      title: 'Community Meetups',
      description: 'Connect with fellow creatives and business owners in our regular meetups.',
    },
    {
      icon: TagIcon,
      title: 'Special Offers',
      description: 'Exclusive deals and discounts for our valued customers and community members.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">Planet Scribbles</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Your one-stop destination for premium printing, packaging, and creative solutions. 
              Join our community of creators and bring your ideas to life!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
              >
                Shop Products
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/events"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
              >
                Explore Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Planet Scribbles?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We offer comprehensive solutions for all your printing and packaging needs, 
              plus a vibrant community to help you grow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts?.products?.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Featured Products
                </h2>
                <p className="text-xl text-gray-600">
                  Discover our most popular printing and packaging solutions
                </p>
              </div>
              <Link
                to="/products"
                className="btn-outline hidden sm:inline-flex items-center"
              >
                View All Products
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.products.slice(0, 6).map((product) => (
                <div key={product._id} className="card-hover">
                  <div className="aspect-w-16 aspect-h-12 mb-4">
                    <img
                      src={product.images?.[0]?.url || '/api/placeholder/300/200'}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary-600">${product.price}</span>
                    <Link
                      to={`/products/${product._id}`}
                      className="btn-primary text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8 sm:hidden">
              <Link to="/products" className="btn-outline">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingEvents?.events?.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Upcoming Events
                </h2>
                <p className="text-xl text-gray-600">
                  Join our workshops, seminars, and networking events
                </p>
              </div>
              <Link
                to="/events"
                className="btn-outline hidden sm:inline-flex items-center"
              >
                View All Events
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.events.slice(0, 3).map((event) => (
                <div key={event._id} className="card-hover">
                  <div className="aspect-w-16 aspect-h-10 mb-4">
                    <img
                      src={event.images?.[0]?.url || '/api/placeholder/300/200'}
                      alt={event.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                  <div className="mb-2">
                    <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                      {event.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <Link
                      to={`/events/${event._id}`}
                      className="btn-primary text-sm"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8 sm:hidden">
              <Link to="/events" className="btn-outline">
                View All Events
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Get in touch with our team to discuss your printing and packaging needs. 
            We're here to help bring your vision to life!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Contact Us
            </Link>
            <Link
              to="/offers"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              View Special Offers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

