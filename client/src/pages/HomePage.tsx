import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, } from 'framer-motion';
import { 
  FaArrowRight, 
  FaChartLine, 
  FaUsers, 
  FaHandshake, 
  FaUser,
  FaGraduationCap,
  FaBuilding,
  FaShieldAlt,
  FaRocket,
  FaSearch,
  FaBell,
  FaIdCard,
  FaComments,
  FaLinkedin,
} from 'react-icons/fa';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';
import { Chatbot } from '@/components/chatbot/Chatbot';

export function HomePage() {
  const [linePositions, setLinePositions] = useState<Array<{x1: number, y1: number, x2: number, y2: number, id: number}>>([]);
  
  // Initialize line positions
  useEffect(() => {
    const positions = [];
    const lineCount = 8;
    
    for (let i = 0; i < lineCount; i++) {
      const isDiagonal = Math.random() > 0.5;
      const startFromLeft = Math.random() > 0.5;
      const startFromTop = Math.random() > 0.5;
      
      const x1 = startFromLeft ? Math.random() * 40 : 60 + Math.random() * 40;
      const y1 = startFromTop ? Math.random() * 50 : 30 + Math.random() * 70;
      const x2 = isDiagonal 
        ? (startFromLeft ? x1 + 20 + Math.random() * 30 : x1 - 20 - Math.random() * 30)
        : x1;
      const y2 = isDiagonal 
        ? (startFromTop ? y1 + 20 + Math.random() * 30 : y1 - 20 - Math.random() * 30)
        : (startFromTop ? y1 + 20 + Math.random() * 30 : y1 - 20 - Math.random() * 30);
      
      positions.push({ 
        x1, y1, x2, y2, 
        id: i,
      });
    }
    
    setLinePositions(positions);
  }, []);

  // Animation variants
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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#0033FF] to-[#000333DD] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Empowering Youth, Employers, and Policymakers through a Unified Skills & Employment Ecosystem
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              DYPSE bridges the gap between youth talents and opportunities they deserve, connecting young people with growth, learning, and employment opportunities through AI-powered matching and real-time updates.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                Get Started <FaArrowRight className="ml-2" />
              </Link>
              <Link 
                to="/about" 
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Animated Lines */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <svg className="w-full h-full">
            {linePositions.map((pos) => {
              const length = Math.sqrt(
                Math.pow(pos.x2 - pos.x1, 2) + 
                Math.pow(pos.y2 - pos.y1, 2)
              );
              const duration = 10 + (length / 20);
              
              return (
                <line
                  key={pos.id}
                  x1={`${pos.x1}%`}
                  y1={`${pos.y1}%`}
                  x2={`${pos.x2}%`}
                  y2={`${pos.y2}%`}
                  stroke="white"
                  strokeWidth="1.5"
                  strokeDasharray="8,4"
                  className="animate-dash"
                  style={{
                    animationDuration: `${duration}s`,
                    animationDelay: `${Math.random() * 5}s`,
                    opacity: 0.6 + Math.random() * 0.4,
                  }}
                />
              );
            })}
          </svg>
        </div>
      </section>
      
      {/* Who It Serves Section */}
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
              Who It Serves
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              DYPSE creates value for all stakeholders in the employment ecosystem
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
                title: "Youth",
                description: "Build profiles, upload CVs, find jobs, and connect with opportunities",
                icon: <FaUsers className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600",
                bgGradient: "from-blue-50 to-blue-100"
              },
              {
                title: "Employers",
                description: "Discover talent, AI-powered CV analysis, and easier recruitment",
                icon: <FaBuilding className="h-8 w-8" />,
                gradient: "from-green-500 to-green-600",
                bgGradient: "from-green-50 to-green-100"
              },
              {
                title: "Institutions",
                description: "Match curricula with skill gaps and provide training programs",
                icon: <FaGraduationCap className="h-8 w-8" />,
                gradient: "from-purple-500 to-purple-600",
                bgGradient: "from-purple-50 to-purple-100"
              },
              {
                title: "Policymakers",
                description: "Access dashboards, skill-gap insights, and workforce analytics",
                icon: <FaShieldAlt className="h-8 w-8" />,
                gradient: "from-orange-500 to-orange-600",
                bgGradient: "from-orange-50 to-orange-100"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="group p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-transparent hover:border-opacity-30 bg-white"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                <div className={`mt-6 h-1 w-12 bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-300 group-hover:w-16`}></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Overview Section */}
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
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive platform capabilities designed for modern employment needs
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Unemployed Youth Module",
                description: "Build comprehensive profiles, upload CVs, and access job opportunities",
                icon: <FaUser className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Employed Youth Module",
                description: "Showcase career progress, skills, and experiences for growth",
                icon: <FaChartLine className="h-8 w-8" />,
                gradient: "from-green-500 to-green-600"
              },
              {
                title: "Entrepreneurs Module",
                description: "Validate businesses, showcase projects, and get referrals",
                icon: <FaRocket className="h-8 w-8" />,
                gradient: "from-purple-500 to-purple-600"
              },
              {
                title: "Real-Time Updates",
                description: "Get instant notifications about new opportunities and deadlines",
                icon: <FaBell className="h-8 w-8" />,
                gradient: "from-orange-500 to-orange-600"
              },
              {
                title: "Advanced Search & AI Matching",
                description: "Smart filters and AI-powered recommendations for optimal matches",
                icon: <FaSearch className="h-8 w-8" />,
                gradient: "from-pink-500 to-pink-600"
              },
              {
                title: "LinkedIn Integration",
                description: "Seamless connection with professional networks and job portals",
                icon: <FaLinkedin className="h-8 w-8" />,
                gradient: "from-indigo-500 to-indigo-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
                </div>
      </section>

      {/* Data Visuals Preview Section */}
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
              Data Insights & Analytics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-time data visualization for informed decision-making
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
                <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Comprehensive Analytics Dashboard
                  </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Employment trends and patterns</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Skill gap analysis</span>
              </div>
                <div className="flex items-center space-x-4">
                  <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Geographic distribution</span>
            </div>
              <div className="flex items-center space-x-4">
                  <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">Industry demand insights</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
              <div className="space-y-4">
                <div className="h-4 bg-blue-200 rounded-full w-3/4"></div>
                <div className="h-4 bg-green-200 rounded-full w-1/2"></div>
                <div className="h-4 bg-purple-200 rounded-full w-5/6"></div>
                <div className="h-4 bg-orange-200 rounded-full w-2/3"></div>
                <div className="h-4 bg-pink-200 rounded-full w-4/5"></div>
                </div>
              <div className="mt-8 text-center text-gray-500 text-sm">
                Interactive charts and graphs coming soon
                </div>
              </div>
          </motion.div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-600">Simple steps to start your journey with DYPSE</p>
          </motion.div>
          
          <motion.div 
            className="relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 hidden md:block"></div>
            
            <div className="space-y-12">
              {[
                {
                  title: "Create Profile",
                  description: "Sign up and build your comprehensive profile with skills, experience, and goals.",
                  icon: <FaUser className="h-6 w-6" />,
                gradient: "from-blue-500 to-blue-600",
                  step: "1"
                },
                {
                  title: "Upload & Analyze",
                  description: "Upload your CV and let our AI analyze your skills and experience.",
                  icon: <FaChartLine className="h-6 w-6" />,
                gradient: "from-purple-500 to-purple-600",
                  step: "2"
              },
              {
                title: "Get Matched",
                  description: "Receive personalized job recommendations and opportunities based on your profile.",
                  icon: <FaHandshake className="h-6 w-6" />,
                gradient: "from-pink-500 to-pink-600",
                  step: "3"
              }
            ].map((step, index) => (
                <motion.div
                key={index} 
                  variants={itemVariants}
                  className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className="flex-1 md:text-right md:pr-8">
                    <div className={`inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br ${step.gradient} text-white font-bold text-lg mb-4 md:mb-0`}>
                      {step.step}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  
                  <div className=" md:block flex-shrink-0 w-16 h-16 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center shadow-lg">
                    <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white`}>
                  {step.icon}
                </div>
                  </div>
                  
                  <div className="flex-1 md:text-left md:pl-8">
                    <div className="md:hidden">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
              </div>
                </motion.div>
            ))}
          </div>
          </motion.div>
        </div>
      </section>

      {/* Entrepreneurship Section with Animated Stats */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Entrepreneurship Hub
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering young entrepreneurs to validate and grow their businesses
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Total Registered Businesses",
                value: "500+",
                icon: <FaBuilding className="h-8 w-8" />,
                gradient: "from-green-500 to-green-600"
              },
              {
                title: "Partnerships Formed",
                value: "150+",
                icon: <FaHandshake className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Verified Entrepreneurs",
                value: "300+",
                icon: <FaUsers className="h-8 w-8" />,
                gradient: "from-purple-500 to-purple-600"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <p className="text-gray-600">{stat.title}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link 
              to="/entrepreneurship" 
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
            >
              Explore Entrepreneurship Hub <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
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
              Our Partners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Collaborating with leading institutions to create opportunities for youth
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
                name: "DTP Rwanda",
                description: "Digital Talent Program Rwanda",
                logo: "DTP Logo",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                name: "ICT Chamber Rwanda",
                description: "Information and Communication Technology Chamber",
                logo: "ICT Logo",
                gradient: "from-green-500 to-green-600"
              },
              {
                name: "Ministry of ICT & Innovation",
                description: "Government Ministry for ICT and Innovation",
                logo: "Ministry Logo",
                gradient: "from-purple-500 to-purple-600"
              }
            ].map((partner, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300"
              >
                <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${partner.gradient} flex items-center justify-center text-white mx-auto mb-6 text-lg font-bold`}>
                  {partner.logo}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{partner.name}</h3>
                <p className="text-gray-600">{partner.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Coming Soon
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Exciting new features under development to enhance your experience
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Digital ID Integration",
                description: "Secure digital identity verification for enhanced security and trust",
                icon: <FaIdCard className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "NLP Chatbot",
                description: "Advanced AI-powered conversational assistant for better user support",
                icon: <FaComments className="h-8 w-8" />,
                gradient: "from-green-500 to-green-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="p-8 rounded-2xl bg-gray-800 hover:bg-gray-700 transition-all duration-300 border border-gray-700"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0033FF] to-[#000333DD] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of youth who have been empowered through our platform
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/signup" 
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
          >
            Sign Up Now <FaArrowRight className="ml-2" />
          </Link>
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                Login <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Chatbot />
      <Footer />
    </div>
  );
}
