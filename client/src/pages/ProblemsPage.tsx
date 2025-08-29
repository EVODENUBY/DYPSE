import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaArrowRight, 
  FaUsers, 
  FaExclamationTriangle, 
  FaChartLine, 
  FaGraduationCap,
  FaShieldAlt,
  FaGlobe,
  FaHandshake,
  FaLightbulb,
  FaSearch,
  FaClock
} from 'react-icons/fa';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';

export function ProblemStatementPage() {
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
              The Challenge We Face
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Understanding the critical issues in youth employment and skill development that DYPSE aims to solve
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
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
              The Youth Employment Crisis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Africa faces one of the most pressing challenges of our time: youth unemployment and underemployment that affects millions of young people and hinders economic development.
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
                title: "Critical Numbers",
                value: "60%",
                description: "Youth unemployment rate in many African countries",
                icon: <FaExclamationTriangle className="h-8 w-8" />,
                gradient: "from-[#0033FF] to-[#000333DD]"
              },
              {
                title: "Economic Impact",
                value: "$2.5T",
                description: "Annual economic loss due to youth unemployment",
                icon: <FaChartLine className="h-8 w-8" />,
                gradient: "from-blue-600 to-blue-700"
              },
              {
                title: "Social Cost",
                value: "Millions",
                description: "Young people at risk of social exclusion",
                icon: <FaUsers className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mx-auto mb-6`}>
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{stat.title}</h3>
                <p className="text-gray-600">{stat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Challenges for Youth Section */}
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
              Challenges Faced by Youth
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The barriers that prevent young people from accessing meaningful employment opportunities
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
                title: "Limited Access to Opportunities",
                description: "Many youth lack access to quality job postings, internships, and career development programs due to geographical, economic, or informational barriers.",
                icon: <FaSearch className="h-8 w-8" />,
                gradient: "from-[#0033FF] to-[#000333DD]"
              },
              {
                title: "Skills Mismatch",
                description: "There's a significant gap between the skills youth possess and what employers actually need in the current job market.",
                icon: <FaGraduationCap className="h-8 w-8" />,
                gradient: "from-blue-600 to-blue-700"
              },
              {
                title: "Lack of Professional Networks",
                description: "Young people often lack access to professional networks, mentors, and industry connections that could help them advance their careers.",
                icon: <FaHandshake className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Limited Entrepreneurial Support",
                description: "Youth with entrepreneurial aspirations face challenges in accessing funding, mentorship, and business development resources.",
                icon: <FaLightbulb className="h-8 w-8" />,
                gradient: "from-blue-400 to-blue-500"
              }
            ].map((challenge, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${challenge.gradient} flex items-center justify-center text-white mb-6`}>
                  {challenge.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{challenge.title}</h3>
                <p className="text-gray-600 leading-relaxed">{challenge.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Challenges for Employers Section */}
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
              Challenges Faced by Employers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The difficulties employers encounter in finding and hiring qualified young talent
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
                title: "Talent Discovery",
                description: "Employers struggle to find qualified candidates with the right skills and experience for their open positions.",
                icon: <FaSearch className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Skills Verification",
                description: "Difficulty in verifying the actual skills and competencies of job applicants beyond their resumes.",
                icon: <FaShieldAlt className="h-8 w-8" />,
                gradient: "from-indigo-500 to-indigo-600"
              },
              {
                title: "Recruitment Costs",
                description: "High costs associated with traditional recruitment processes and lengthy hiring cycles.",
                icon: <FaChartLine className="h-8 w-8" />,
                gradient: "from-purple-500 to-purple-600"
              },
              {
                title: "Retention Issues",
                description: "Challenges in retaining young employees due to lack of career development opportunities and growth paths.",
                icon: <FaUsers className="h-8 w-8" />,
                gradient: "from-violet-500 to-violet-600"
              }
            ].map((challenge, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${challenge.gradient} flex items-center justify-center text-white mb-6`}>
                  {challenge.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{challenge.title}</h3>
                <p className="text-gray-600 leading-relaxed">{challenge.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Challenges for Policymakers Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Challenges Faced by Policymakers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The obstacles policymakers face in creating effective employment and skill development policies
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
                title: "Data Deficiency",
                description: "Lack of comprehensive, real-time data on youth employment trends, skill gaps, and labor market demands.",
                icon: <FaChartLine className="h-8 w-8" />,
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Policy Coordination",
                description: "Difficulty in coordinating policies across different government departments and stakeholders in the employment ecosystem.",
                icon: <FaHandshake className="h-8 w-8" />,
                gradient: "from-indigo-500 to-indigo-600"
              },
              {
                title: "Resource Allocation",
                description: "Challenges in allocating limited resources effectively to address the most critical employment and skill development needs.",
                icon: <FaGlobe className="h-8 w-8" />,
                gradient: "from-purple-500 to-purple-600"
              },
              {
                title: "Impact Measurement",
                description: "Difficulty in measuring the effectiveness of employment and skill development programs and policies.",
                icon: <FaClock className="h-8 w-8" />,
                gradient: "from-violet-500 to-violet-600"
              }
            ].map((challenge, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${challenge.gradient} flex items-center justify-center text-white mb-6`}>
                  {challenge.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{challenge.title}</h3>
                <p className="text-gray-600 leading-relaxed">{challenge.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Root Causes Section */}
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
              Root Causes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The underlying factors that contribute to the youth employment crisis
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
                Systemic Issues
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="h-6 w-6 rounded-full bg-[#0033FF] flex items-center justify-center text-white text-sm font-bold mt-1">1</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Education-Employment Gap</h4>
                    <p className="text-gray-600">Educational systems not aligned with current and future labor market needs.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="h-6 w-6 rounded-full bg-[#0033FF] flex items-center justify-center text-white text-sm font-bold mt-1">2</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Digital Divide</h4>
                    <p className="text-gray-600">Limited access to digital tools and internet connectivity in many regions.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="h-6 w-6 rounded-full bg-[#0033FF] flex items-center justify-center text-white text-sm font-bold mt-1">3</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Economic Instability</h4>
                    <p className="text-gray-600">Economic challenges that limit job creation and business growth.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl">
                <div className="text-center">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white mx-auto mb-6">
                    <FaExclamationTriangle className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Urgent Action Needed</h3>
                  <p className="text-gray-600 mb-4">
                    The youth employment crisis requires immediate, coordinated action from all stakeholders to prevent long-term social and economic consequences.
                  </p>
                  <div className="text-sm text-gray-500">
                    Every year of inaction costs millions of young people their future opportunities.
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Be Part of the Solution?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join DYPSE in addressing these critical challenges and creating opportunities for youth
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/solution" 
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                See Our Solution <FaArrowRight className="ml-2" />
              </Link>
              <Link 
                to="/signup" 
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-red-600 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                Join DYPSE <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
