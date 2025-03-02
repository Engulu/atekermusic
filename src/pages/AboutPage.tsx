import React from 'react';
import { Music2, Mail, Phone, MapPin, Facebook, Twitter, Youtube } from 'lucide-react';
import { useState } from 'react';

export default function AboutPage() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', contactForm);
  };

  return (
    <main className="min-h-screen bg-navy-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Music2 className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">About Ateker Music</h1>
            <p className="text-xl text-gray-400">
              Empowering Teso Artists, Preserving Our Culture
            </p>
          </div>

          <div className="bg-navy-800 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
            <p className="text-gray-400 mb-6">
              At Ateker Music, we are on a mission to revolutionize the Teso music industry by providing
              a modern digital platform that connects artists with their audience. We believe in preserving
              our rich cultural heritage while embracing technological innovation to give our artists
              the global reach they deserve.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mb-4">What We Offer</h2>
            <ul className="text-gray-400 space-y-4">
              <li>• A secure platform for artists to showcase and sell their music</li>
              <li>• Direct artist-to-fan engagement through our digital platform</li>
              <li>• Promotion of both traditional and modern Teso music</li>
              <li>• Coverage of local music events and industry news</li>
              <li>• Support for emerging artists through our platform</li>
            </ul>
          </div>

          <div className="bg-navy-800 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-blue-400 mb-2">Cultural Preservation</h3>
                <p className="text-gray-400">
                  Dedicated to preserving and promoting the rich musical heritage of the Teso region
                  for future generations.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-400 mb-2">Artist Support</h3>
                <p className="text-gray-400">
                  Empowering artists with tools and resources to reach a global audience and build
                  sustainable careers.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-400 mb-2">Community</h3>
                <p className="text-gray-400">
                  Building a vibrant community where artists and fans can connect, share, and celebrate
                  Teso music.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-400 mb-2">Innovation</h3>
                <p className="text-gray-400">
                  Leveraging technology to create new opportunities for artists while preserving
                  traditional values.
                </p>
              </div>
            </div>
          </div>

          {/* Admin Section */}
          <div className="bg-navy-800 rounded-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Meet the Admin</h2>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">EE</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Enocha Engulu</h3>
                <p className="text-gray-400 mb-4">
                  Platform Administrator & Founder
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>Soroti, Uganda</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <a href="mailto:enocha@atekermusic.com" className="hover:text-blue-400">
                      enocha@atekermusic.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-navy-800 rounded-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Contact Us</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={6}
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}