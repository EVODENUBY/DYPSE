import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaArrowRight, 
  FaUsers, 
  FaLightbulb, 
  FaHandshake, 
  FaChartLine,
  FaGlobe,
  FaRocket,
  FaGraduationCap,
  FaSearch,
  FaBell,
  FaRobot,
  FaLinkedin,
  FaDatabase,
  FaDesktop,
  FaServer,
  FaClock
} from 'react-icons/fa';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';

export function SolutionPage() {
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
              Our Solution
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              How DYPSE addresses the youth employment crisis through innovative technology and comprehensive ecosystem building
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solution Overview Section */}
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
              The DYPSE Approach
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've developed a comprehensive, technology-driven solution that addresses the root causes of youth unemployment
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
                Holistic Ecosystem Design
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                DYPSE doesn't just connect job seekers with employers. We create a complete ecosystem that addresses every aspect of the employment journey, from skill development to career advancement and entrepreneurship.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform integrates multiple stakeholders - youth, employers, training institutions, and policymakers - into a unified system that creates value for everyone involved.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
                <div className="text-center">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#0033FF] to-[#000333DD] flex items-center justify-center text-white mx-auto mb-6">
                    <FaGlobe className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Unified Platform</h3>
                  <p className="text-gray-600">
                    One platform that serves all stakeholders in the employment ecosystem, creating seamless connections and data flow.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Solutions Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Core Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The key components that make DYPSE effective in solving youth employment challenges
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
                title: "AI-Powered Matching",
                description: "Advanced algorithms that analyze skills, experience, and preferences to create optimal matches between youth and opportunities.",
                icon: <FaRobot className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Comprehensive Skill Mapping",
                description: "Detailed assessment and mapping of youth skills, including both technical and soft skills, to identify development areas.",
                icon: <FaChartLine className="h-8 w-8" />,
                gradient: "from-green-500 to-green-600"
              },
              {
                title: "Real-Time Updates",
                description: "Instant notifications about new opportunities, skill requirements, and market trends to keep users informed.",
                icon: <FaBell className="h-8 w-8" />,
                gradient: "from-purple-500 to-purple-600"
              },
              {
                title: "LinkedIn Integration",
                description: "Seamless connection with professional networks and job portals to expand opportunity access.",
                icon: <FaLinkedin className="h-8 w-8" />,
                gradient: "from-indigo-500 to-indigo-600"
              },
              {
                title: "Entrepreneurial Support",
                description: "Comprehensive support for youth entrepreneurs, including validation, mentorship, and resource access.",
                icon: <FaRocket className="h-8 w-8" />,
                gradient: "from-orange-500 to-orange-600"
              },
              {
                title: "Data Analytics",
                description: "Real-time insights and analytics for all stakeholders to make informed decisions about employment and skill development.",
                icon: <FaDatabase className="h-8 w-8" />,
                gradient: "from-pink-500 to-pink-600"
              }
            ].map((solution, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${solution.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {solution.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{solution.title}</h3>
                <p className="text-gray-600 leading-relaxed">{solution.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technology Stack Section */}
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
              Technology Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with modern, scalable technologies to ensure reliability and performance
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
                title: "Frontend Technologies",
                description: "Modern React-based frontend with responsive design and smooth animations using Framer Motion.",
                icon: <FaDesktop className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600",
                features: ["React 19", "TypeScript", "Tailwind CSS", "Framer Motion"]
              },
              {
                title: "Backend Infrastructure",
                description: "Scalable Node.js backend with Express framework and comprehensive API design.",
                icon: <FaServer className="h-8 w-8" />,
                gradient: "from-green-500 to-green-600",
                features: ["Node.js", "Express", "TypeScript", "REST APIs"]
              },
              {
                title: "Database Solutions",
                description: "Hybrid database approach combining structured data (Supabase) with unstructured data (MongoDB).",
                icon: <FaDatabase className="h-8 w-8" />,
                gradient: "from-purple-500 to-purple-600",
                features: ["Supabase", "MongoDB", "PostgreSQL", "Real-time"]
              },
              {
                title: "AI & Machine Learning",
                description: "Advanced AI models for CV analysis, skill matching, and personalized recommendations.",
                icon: <FaRobot className="h-8 w-8" />,
                gradient: "from-orange-500 to-orange-600",
                features: ["NLP", "ML Models", "Recommendation Engine", "CV Parsing"]
              }
            ].map((tech, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${tech.gradient} flex items-center justify-center text-white mb-6`}>
                  {tech.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{tech.title}</h3>
                <p className="text-gray-600 mb-4">{tech.description}</p>
                <div className="flex flex-wrap gap-2">
                  {tech.features.map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Solves Problems Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How DYPSE Solves Each Challenge
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Direct mapping of our solutions to the identified problems
            </p>
          </motion.div>

          <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                problem: "Limited Access to Opportunities",
                solution: "DYPSE provides a centralized platform with real-time job updates, internship postings, and career development programs accessible from anywhere.",
                icon: <FaSearch className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600"
              },
              {
                problem: "Skills Mismatch",
                solution: "Our AI-powered skill assessment and matching engine ensures youth are connected with opportunities that align with their actual capabilities.",
                icon: <FaGraduationCap className="h-8 w-8" />,
                gradient: "from-green-500 to-green-600"
              },
              {
                problem: "Lack of Professional Networks",
                solution: "Built-in networking features and LinkedIn integration help youth build professional connections and access mentorship opportunities.",
                icon: <FaHandshake className="h-8 w-8" />,
                gradient: "from-purple-500 to-purple-600"
              },
              {
                problem: "Limited Entrepreneurial Support",
                solution: "Comprehensive entrepreneurship module with business validation, mentorship access, and resource connections.",
                icon: <FaLightbulb className="h-8 w-8" />,
                gradient: "from-orange-500 to-orange-600"
              },
              {
                problem: "Talent Discovery for Employers",
                solution: "Advanced search and AI matching help employers find qualified candidates quickly and efficiently.",
                icon: <FaUsers className="h-8 w-8" />,
                gradient: "from-pink-500 to-pink-600"
              },
              {
                problem: "Data Deficiency for Policymakers",
                solution: "Real-time analytics and comprehensive reporting provide policymakers with the data needed for informed decision-making.",
                icon: <FaChartLine className="h-8 w-8" />,
                gradient: "from-indigo-500 to-indigo-600"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-start space-x-6">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      <span className="text-red-600">Problem:</span> {item.problem}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      <span className="text-green-600 font-semibold">Solution:</span> {item.solution}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Impact Metrics Section */}
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
              Expected Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The measurable outcomes we expect to achieve through DYPSE implementation
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
                title: "Employment Rate",
                value: "85%+",
                description: "Target youth employment rate within 2 years",
                icon: <FaUsers className="h-8 w-8" />,
                gradient: "from-green-500 to-green-600"
              },
              {
                title: "Skills Match",
                value: "90%+",
                description: "Improved skills-job alignment",
                icon: <FaChartLine className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Time to Employment",
                value: "50%",
                description: "Reduction in job search time",
                icon: <FaClock className="h-8 w-8" />,
                gradient: "from-purple-500 to-purple-600"
              },
              {
                title: "Entrepreneur Success",
                value: "75%+",
                description: "Business survival rate after 2 years",
                icon: <FaRocket className="h-8 w-8" />,
                gradient: "from-orange-500 to-orange-600"
              }
            ].map((metric, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center text-white mx-auto mb-6`}>
                  {metric.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{metric.value}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{metric.title}</h3>
                <p className="text-gray-600">{metric.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Experience the Solution?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join DYPSE and be part of the transformation in youth employment
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/signup" 
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                Get Started <FaArrowRight className="ml-2" />
              </Link>
              <Link 
                to="/features" 
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-green-600 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                Explore Features <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
