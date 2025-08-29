import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';

import { 
  FaArrowRight, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
} from 'react-icons/fa';

export function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: ''
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#0033FF] to-[#000333DD] text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-xl mb-8 max-w-3xl mx-auto">
              Get in touch with our team for inquiries, partnerships, support, or to learn more about DYPSE
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to reach our team and get the support you need
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Email Us",
                description: "Send us a detailed message and we'll get back to you within 24 hours.",
                icon: <FaEnvelope className="h-8 w-8" />,
                gradient: "from-[#0033FF] to-[#000333DD]",
                contact: "dypse.ict.chamber@gmail.com",
                action: "Send Email"
              },
              {
                title: "Call Us",
                description: "Speak directly with our team for immediate assistance and support.",
                icon: <FaPhone className="h-8 w-8" />,
                gradient: "from-blue-600 to-blue-700",
                contact: "+250 791 783 308",
                action: "Call Now"
              },
              {
                title: "Visit Us",
                description: "Drop by our office for in-person meetings and consultations.",
                icon: <FaMapMarkerAlt className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600",
                contact: "Kigali, Rwanda",
                action: "Get Directions"
              }
            ].map((info, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${info.gradient} flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{info.title}</h3>
                <p className="text-gray-600 mb-4">{info.description}</p>
                <div className="text-lg font-semibold text-gray-900 mb-4">{info.contact}</div>
                <button className={`px-6 py-2 rounded-lg bg-gradient-to-r ${info.gradient} text-white font-medium hover:opacity-90 transition-opacity duration-200`}>
                  {info.action}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Send Us a Message
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fill out the form below and we'll get back to you as soon as possible
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter your email address"
                  />
                </div>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter your company name"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="media">Media & Press</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                </div>

                <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Tell us more about your inquiry..."
                />
                </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#0033FF] to-[#000333DD] hover:from-blue-700 hover:to-blue-800 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                >
                  Send Message <FaArrowRight className="ml-2" />
                </button>
              </div>
              </form>
          </motion.div>
            </div>
      </section>

      {/* Office Location Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Office
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Visit us in Kigali, Rwanda for in-person meetings and consultations
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                DYPSE Headquarters
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="h-6 w-6 rounded-full bg-[#0033FF] flex items-center justify-center text-white text-sm font-bold mt-1">📍</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-600">KG 123 St, Kigali, Rwanda</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="h-6 w-6 rounded-full bg-[#0033FF] flex items-center justify-center text-white text-sm font-bold mt-1">🕒</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                </div>
                    </div>
                <div className="flex items-start space-x-4">
                  <div className="h-6 w-6 rounded-full bg-[#0033FF] flex items-center justify-center text-white text-sm font-bold mt-1">📞</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Phone</h4>
                    <p className="text-gray-600">+250 788 123 456</p>
                    <p className="text-gray-600">+250 788 123 457</p>
                    </div>
                  </div>
                <div className="flex items-start space-x-4">
                  <div className="h-6 w-6 rounded-full bg-[#0033FF] flex items-center justify-center text-white text-sm font-bold mt-1">✉️</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Email</h4>
                    <p className="text-gray-600">info@dypse.rw</p>
                    <p className="text-gray-600">support@dypse.rw</p>
                    </div>
                    </div>
                  </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
                <div className="text-center">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#0033FF] to-[#000333DD] flex items-center justify-center text-white mx-auto mb-6">
                    <FaMapMarkerAlt className="h-10 w-10" />
                    </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Directions</h3>
                  <p className="text-gray-600 mb-6">
                    Our office is located in the heart of Kigali, easily accessible by public transport and car.
                  </p>
                  <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#0033FF] to-[#000333DD] text-white font-medium hover:opacity-90 transition-opacity duration-200">
                    Open in Maps
                  </button>
                    </div>
                  </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Social Media & Additional Contact Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Connect With Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow us on social media and stay updated with the latest news and opportunities
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                platform: "LinkedIn",
                description: "Follow us for professional updates and networking opportunities",
                icon: <FaLinkedin className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600",
                handle: "@dypse-rwanda"
              },
              {
                platform: "Twitter",
                description: "Get real-time updates and announcements",
                icon: <FaTwitter className="h-8 w-8" />,
                gradient: "from-sky-500 to-sky-600",
                handle: "@dypse_rwanda"
              },
              {
                platform: "Facebook",
                description: "Join our community and engage with other members",
                icon: <FaFacebook className="h-8 w-8" />,
                gradient: "from-indigo-500 to-indigo-600",
                handle: "DYPSE Rwanda"
              },
              {
                platform: "Instagram",
                description: "Visual updates and behind-the-scenes content",
                icon: <FaInstagram className="h-8 w-8" />,
                gradient: "from-pink-500 to-pink-600",
                handle: "@dypse_rwanda"
              }
            ].map((social, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${social.gradient} flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {social.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{social.platform}</h3>
                <p className="text-gray-600 mb-4">{social.description}</p>
                <div className="text-lg font-semibold text-gray-900">{social.handle}</div>
              </motion.div>
            ))}
          </motion.div>
              </div>
      </section>

              {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions about contacting and working with DYPSE
            </p>
          </motion.div>

          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                question: "How quickly do you respond to inquiries?",
                answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly."
              },
              {
                question: "Can I schedule a meeting with your team?",
                answer: "Yes! We welcome meetings and consultations. You can schedule through our contact form or call us directly to arrange a convenient time."
              },
              {
                question: "Do you offer support in multiple languages?",
                answer: "Yes, we provide support in English, French, and Kinyarwanda to serve our diverse community effectively."
              },
              {
                question: "How can I become a partner or collaborator?",
                answer: "We're always open to partnerships! Please use our contact form and select 'Partnership Opportunity' as the subject to get started."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
                  ))}
          </motion.div>
                </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Contact us today to learn more about DYPSE and how we can help you achieve your goals
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/signup" 
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                Get Started <FaArrowRight className="ml-2" />
              </Link>
              <Link 
                to="/demo" 
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                Request Demo <FaArrowRight className="ml-2" />
              </Link>
              </div>
          </motion.div>
            </div>
      </section>

      <Footer />
    </div>
  );
}

export default ContactUsPage;