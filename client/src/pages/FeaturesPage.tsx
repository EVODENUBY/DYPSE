import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaArrowRight, 
 
  FaRocket,
  FaShieldAlt,
  FaGraduationCap,

  FaSearch,
  FaBell,
  FaRobot,
  
  FaLinkedin,
  
  FaMobile,
  FaUserGraduate,
  FaBriefcase,
  FaNetworkWired,
  FaCogs,
  FaEye,
  FaLock,
  FaSync,
  FaChartBar,
  FaFileAlt,
  FaVideo,
  FaHeadset,
  FaCreditCard
} from 'react-icons/fa';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';

export function FeaturesPage() {
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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#0033FF] to-[#000333DD] text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Platform Features
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover the comprehensive tools and capabilities that make DYPSE the ultimate platform for youth employment and skill development
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Modules Section */}
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
              Core Modules
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three specialized modules designed to serve different user types with tailored experiences
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Unemployed Youth Module",
                description: "Comprehensive tools for job seekers to build profiles, develop skills, and find opportunities.",
                icon: <FaUserGraduate className="h-8 w-8" />,
                gradient: "from-[#0033FF] to-[#000333DD]",
                features: [
                  "Profile Creation & Management",
                  "CV Upload & AI Analysis",
                  "Skills Assessment",
                  "Job Search & Applications",
                  "Career Guidance",
                  "Training Recommendations"
                ]
              },
              {
                title: "Employed Youth Module",
                description: "Platform for employed professionals to showcase growth, network, and advance careers.",
                icon: <FaBriefcase className="h-8 w-8" />,
                gradient: "from-blue-600 to-blue-700",
                features: [
                  "Career Progress Tracking",
                  "Skills Showcase",
                  "Professional Networking",
                  "Mentorship Opportunities",
                  "Career Advancement Tools",
                  "Industry Insights"
                ]
              },
              {
                title: "Entrepreneurs Module",
                description: "Comprehensive support for young entrepreneurs to validate and grow businesses.",
                icon: <FaRocket className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600",
                features: [
                  "Business Registration",
                  "Document Validation",
                  "Project Showcase",
                  "Partnership Matching",
                  "Resource Access",
                  "Mentorship Network"
                ]
              }
            ].map((module, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${module.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {module.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{module.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{module.description}</p>
                <ul className="space-y-2">
                  {module.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${module.gradient} mr-3`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Advanced Features Section */}
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
              Advanced Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge technologies and capabilities that set DYPSE apart
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
                title: "Real-Time Updates",
                description: "Instant notifications and live updates about opportunities, deadlines, and market changes.",
                icon: <FaBell className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600",
                details: [
                  "Live job postings",
                  "Application status updates",
                  "Market trend alerts",
                  "Deadline reminders"
                ]
              },
              {
                title: "Advanced Search & AI Matching",
                description: "Intelligent search algorithms and AI-powered recommendations for optimal matches.",
                icon: <FaSearch className="h-8 w-8" />,
                gradient: "from-green-500 to-green-600",
                details: [
                  "Smart filters",
                  "AI-powered matching",
                  "Skills-based recommendations",
                  "Preference learning"
                ]
              },
              {
                title: "LinkedIn Integration",
                description: "Seamless connection with professional networks and external job portals.",
                icon: <FaLinkedin className="h-8 w-8" />,
                gradient: "from-purple-500 to-purple-600",
                details: [
                  "Profile synchronization",
                  "Job import/export",
                  "Network expansion",
                  "Professional visibility"
                ]
              },
              {
                title: "AI-Powered CV Analysis",
                description: "Advanced natural language processing to extract and analyze CV content.",
                icon: <FaRobot className="h-8 w-8" />,
                gradient: "from-orange-500 to-orange-600",
                details: [
                  "Skills extraction",
                  "Experience analysis",
                  "Gap identification",
                  "Improvement suggestions"
                ]
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${feature.gradient} mr-3`}></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technical Features Section */}
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
              Technical Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Robust infrastructure and technical capabilities that ensure reliability and performance
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
                title: "Multi-Platform Support",
                description: "Access DYPSE from any device with responsive design and native mobile experience.",
                icon: <FaMobile className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Real-Time Data Sync",
                description: "Instant synchronization across all devices and platforms for seamless user experience.",
                icon: <FaSync className="h-8 w-8" />,
                gradient: "from-green-500 to-green-600"
              },
              {
                title: "Advanced Analytics",
                description: "Comprehensive data insights and reporting for all user types and stakeholders.",
                icon: <FaChartBar className="h-8 w-8" />,
                gradient: "from-purple-500 to-purple-600"
              },
              {
                title: "Document Management",
                description: "Secure storage and management of CVs, certificates, and business documents.",
                icon: <FaFileAlt className="h-8 w-8" />,
                gradient: "from-orange-500 to-orange-600"
              },
              {
                title: "Video Integration",
                description: "Support for video profiles, interviews, and multimedia content sharing.",
                icon: <FaVideo className="h-8 w-8" />,
                gradient: "from-pink-500 to-pink-600"
              },
              {
                title: "24/7 Support",
                description: "Round-the-clock customer support and assistance for all users.",
                icon: <FaHeadset className="h-8 w-8" />,
                gradient: "from-indigo-500 to-indigo-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="group p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300"
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

      {/* Security & Privacy Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Security & Privacy
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Enterprise-grade security measures to protect your data and privacy
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
                title: "Data Encryption",
                description: "End-to-end encryption for all sensitive data and communications.",
                icon: <FaLock className="h-8 w-8" />,
                gradient: "from-green-500 to-green-600"
              },
              {
                title: "Privacy Controls",
                description: "Granular privacy settings allowing users to control their data visibility.",
                icon: <FaEye className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Secure Authentication",
                description: "Multi-factor authentication and secure login protocols.",
                icon: <FaShieldAlt className="h-8 w-8" />,
                gradient: "from-purple-500 to-purple-600"
              },
              {
                title: "Compliance",
                description: "Full compliance with international data protection regulations.",
                icon: <FaCogs className="h-8 w-8" />,
                gradient: "from-orange-500 to-orange-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-2xl bg-gray-800 hover:bg-gray-700 transition-all duration-300 border border-gray-700"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Integration Features Section */}
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
              Integrations & APIs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seamless connections with external platforms and services
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
                title: "LinkedIn Integration",
                description: "Direct connection with LinkedIn for job postings, profile synchronization, and network expansion.",
                icon: <FaLinkedin className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Job Portal APIs",
                description: "Integration with major job portals and recruitment platforms for comprehensive opportunity access.",
                icon: <FaNetworkWired className="h-8 w-8" />,
                gradient: "from-green-500 to-green-600"
              },
              {
                title: "Training Platform APIs",
                description: "Connection with educational and training platforms for skill development resources.",
                icon: <FaGraduationCap className="h-8 w-8" />,
                gradient: "from-purple-500 to-purple-600"
              },
              {
                title: "Payment Gateways",
                description: "Secure payment processing for premium features and business services.",
                icon: <FaCreditCard className="h-8 w-8" />,
                gradient: "from-orange-500 to-orange-600"
              }
            ].map((integration, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${integration.gradient} flex items-center justify-center text-white mb-6`}>
                  {integration.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{integration.title}</h3>
                <p className="text-gray-600 leading-relaxed">{integration.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Experience These Features?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join DYPSE and access all these powerful features designed to transform your career journey
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/signup" 
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                Get Started <FaArrowRight className="ml-2" />
              </Link>
              <Link 
                to="/demo" 
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-purple-600 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
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
