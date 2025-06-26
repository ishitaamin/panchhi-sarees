import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Namaste! I'm here to help you find the perfect traditional wear. How can I assist you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(userMessage.text),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);

    inputRef.current?.focus();
  };

  const getBotResponse = (message) => {
    const lower = message.toLowerCase();

    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('namaste')) {
      return "Hi there! 👋 Welcome to Panchhi Sarees. How can I assist you today?";
    }
    if (lower.includes('saree')) {
      return "We offer a wide range of sarees: Silk, Banarasi, Georgette, Organza, and more. Looking for something festive or casual?";
    }
    if (lower.includes('kurti')) {
      return "Explore our cotton, rayon, embroidered & Anarkali kurtis. Great for casual and festive wear!";
    }
    if (lower.includes('lehenga')) {
      return "We have bridal, semi-stitched, and ready-to-wear lehengas in multiple colors and fabrics.";
    }
    if (lower.includes('blouse')) {
      return "We provide stitched, semi-stitched, and designer blouses. Want to match one with your saree?";
    }
    if (lower.includes('salwar') || lower.includes('suit')) {
      return "Our salwar suits are available in Punjabi, Anarkali, and straight-cut styles. Want to see our latest arrivals?";
    }
    if (lower.includes('bridal') || lower.includes('wedding')) {
      return "Our bridal collection includes rich lehengas, sarees & gowns. Want help curating a wedding trousseau?";
    }
    if (lower.includes('offer') || lower.includes('discount') || lower.includes('sale')) {
      return "🎉 We currently have up to 50% OFF on selected collections! Don't miss our Summer Sale going on this week.";
    }
    if (lower.includes('price') || lower.includes('cost') || lower.includes('budget')) {
      return "Our products start at ₹999 and go up to ₹59,999 for premium bridal wear. Tell me your preferred range!";
    }
    if (lower.includes('size')) {
      return "We offer sizes S to XXL for most kurtis and suits. Sarees and lehengas are free-size with adjustable options.";
    }
    if (lower.includes('timing') || lower.includes('open') || lower.includes('close') || lower.includes('hours')) {
      return "🕒 Store Timings:\nMon–Sat: 10:30 AM to 8:00 PM\nSunday: 11:00 AM to 6:00 PM\n\nYou can shop online 24/7!";
    }
    if (lower.includes('location') || lower.includes('store') || lower.includes('shop') || lower.includes('address')) {
      return "📍 Our store is located at Panchhi Sarees - GF-10, Sukun Ananta Complex, Near Muktanand Circle, Karelibaug, Vadodara - 390018.\n\nAvailable on Google Maps too!";
    }
    if (lower.includes('delivery') || lower.includes('shipping')) {
      return "🚚 We offer pan-India delivery. Standard: 3–5 days | Express: 1–2 days. Free delivery on orders above ₹1999.";
    }
    if (lower.includes('order') || lower.includes('track') || lower.includes('status')) {
      return "You can track your order via the 'My Orders' section on our website. Need help? Just share your order ID.";
    }
    if (lower.includes('return') || lower.includes('exchange') || lower.includes('refund')) {
      return "🛍️ We offer 7-day easy returns/exchanges. Items must be unused, in original packaging with tags intact.";
    }
    if (lower.includes('payment') || lower.includes('pay') || lower.includes('method')) {
      return "We accept UPI, credit/debit cards, net banking, and COD (Cash on Delivery) for selected pincodes.";
    }
    if (lower.includes('custom') || lower.includes('stitch') || lower.includes('tailor')) {
      return "Yes, we offer blouse stitching and minor alterations. You can share your measurements during checkout.";
    }
    if (lower.includes('available') || lower.includes('stock') || lower.includes('restock')) {
      return "We update stock regularly. If a product is sold out, you can opt for 'Notify Me' or contact us directly.";
    }
    if (lower.includes('gift') || lower.includes('pack')) {
      return "🎁 Gift packaging is available! You can also buy gift cards for loved ones starting at ₹599.";
    }
    if (lower.includes('contact') || lower.includes('support') || lower.includes('help')) {
      return "📞 Reach us at +91 63510 22494 or 📧 panchhisarees@gmail.com.\nCustomer Care: Mon–Sat, 11 AM – 7 PM.";
    }
    if (lower.includes('thank') || lower.includes('thanks')) {
      return "You're most welcome! 😊 Let me know if there's anything else I can assist you with.";
    }
    if (lower.includes('product') || lower.includes('items') || lower.includes('wearables') || lower.includes('collection')) {
      return "Our collections include Sarees, Kurtis, Lehengas, Bridal Wear, Blouses, and Salwar Suits — all rooted in Indian tradition with a modern flair. Looking for anything specific?";
    }
    return "I'm here to help you with collections, offers, delivery, returns, and more! Try asking about products or store info 😊";
  };

  const formatTime = (timestamp) =>
    timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-[#f15a59] to-[#20283a] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
          <div className="bg-gradient-to-r from-[#f15a59] to-[#20283a] text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#f15a59] font-bold text-sm">P</span>
              </div>
              <span className="font-medium">Panchhi Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-xs p-3 rounded-lg text-sm ${msg.isBot ? 'bg-gray-100 text-gray-800' : 'bg-[#f15a59] text-white'}`}>
                  <div>{msg.text}</div>
                  <div className={`text-[10px] mt-1 ${msg.isBot ? 'text-gray-500' : 'text-white/80'}`}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#f15a59] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#f15a59] rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-[#f15a59] rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59] focus:border-transparent text-sm"
                disabled={isTyping}
              />
              <button
                type="submit"
                className="bg-[#f15a59] text-white p-2 rounded-lg hover:bg-[#d63031] transition-colors"
                disabled={!inputMessage.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;