import React from 'react';
import { 
  PrinterIcon, 
  GiftIcon, 
  UsersIcon, 
  StarIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const About = () => {
  const features = [
    {
      icon: PrinterIcon,
      title: 'Premium Quality',
      description: 'We use only the finest materials and latest printing technology to ensure exceptional results.'
    },
    {
      icon: GiftIcon,
      title: 'Custom Solutions',
      description: 'Every project is unique. We work closely with you to create tailored solutions.'
    },
    {
      icon: UsersIcon,
      title: 'Expert Team',
      description: 'Our experienced professionals are passionate about bringing your vision to life.'
    },
    {
      icon: StarIcon,
      title: 'Customer Satisfaction',
      description: 'Your success is our priority. We go above and beyond to exceed expectations.'
    }
  ];

  const values = [
    'Quality craftsmanship in every project',
    'Sustainable and eco-friendly practices',
    'Innovative design and technology',
    'Exceptional customer service',
    'Competitive pricing and fast turnaround',
    'Community engagement and support'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Planet Scribbles</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Your trusted partner for premium printing and packaging solutions since our founding. 
            We combine creativity, quality, and innovation to bring your ideas to life.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Planet Scribbles was born from a simple belief: that every business, 
                  no matter how small, deserves access to professional-quality printing 
                  and packaging solutions that help them stand out in the marketplace.
                </p>
                <p>
                  What started as a small local print shop has grown into a comprehensive 
                  creative partner, serving businesses across various industries with 
                  everything from business cards to custom packaging solutions.
                </p>
                <p>
                  Today, we're proud to be at the forefront of printing innovation, 
                  combining traditional craftsmanship with cutting-edge technology 
                  to deliver results that exceed expectations.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/api/placeholder/600/400"
                alt="Planet Scribbles workshop"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're more than just a printing company. We're your creative partners 
              committed to your success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
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

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="/api/placeholder/600/400"
                alt="Our values in action"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
              <p className="text-gray-600 mb-6">
                These core principles guide everything we do and shape how we serve our community:
              </p>
              <ul className="space-y-3">
                {values.map((value, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Work Together?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Let's discuss how we can help bring your next project to life. 
            Get in touch with our team today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Contact Us
            </a>
            <a
              href="/products"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              View Our Work
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
