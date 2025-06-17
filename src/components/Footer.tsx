
import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#20283a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#f15a59]">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#f15a59]" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#f15a59]" />
                <span>info@panchhi-sarees.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#f15a59] mt-1" />
                <div>
                  <p>123 Fashion Street,</p>
                  <p>Textile Market, Mumbai - 400001</p>
                  <p>Maharashtra, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#f15a59]">Quick Links</h3>
            <div className="space-y-2">
              <a href="/about" className="block hover:text-[#f15a59] transition-colors">About Us</a>
              <a href="/size-guide" className="block hover:text-[#f15a59] transition-colors">Size Guide</a>
              <a href="/shipping" className="block hover:text-[#f15a59] transition-colors">Shipping Info</a>
              <a href="/returns" className="block hover:text-[#f15a59] transition-colors">Returns & Exchange</a>
              <a href="/privacy" className="block hover:text-[#f15a59] transition-colors">Privacy Policy</a>
              <a href="/terms" className="block hover:text-[#f15a59] transition-colors">Terms & Conditions</a>
            </div>
          </div>

          {/* Store Location & Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#f15a59]">Visit Our Store</h3>
            <div className="mb-6">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.1234567890123!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzMzLjYiTiA3MsKwNTInMzkuNyJF!5e0!3m2!1sen!2sin!4v1234567890123"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </div>
            
            <h4 className="font-semibold mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-[#f15a59] hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-[#f15a59] hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-[#f15a59] hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>&copy; 2024 Panchhi Sarees. All rights reserved. Made with ❤️ for traditional fashion lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
