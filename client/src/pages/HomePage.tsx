import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaChartLine, FaUsers, FaLightbulb, FaHandshake, FaUser } from 'react-icons/fa';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';
import {Chatbot} from '@/components/chatbot/Chatbot'

export function HomePage() {
  // State for the animated line positions
  const [linePositions, setLinePositions] = useState<Array<{x1: number, y1: number, x2: number, y2: number, id: number}>>([]);
  
  // Initialize line positions
  useEffect(() => {
    // Generate random dashed lines across the hero section
    const positions = [];
    const lineCount = 8; // Number of dashed lines
    
    for (let i = 0; i < lineCount; i++) {
      const isDiagonal = Math.random() > 0.5;
      const startFromLeft = Math.random() > 0.5;
      const startFromTop = Math.random() > 0.5;
      
      // Random start and end points within the hero section
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r  text-white overflow-hidden bg-gray-400   
      ">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-600">
              Dynamic Youth Profiling System For Employment and Skills Mapping
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-500">
              This platform is designed to bridge the Gap between Youth Talents And opportunities They deserve!.   
              Connecting young talents with opportunities for growth, learning, and employment
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white-700 bg-blue-500 hover:bg-blue-300 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                Get Started <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Animated Lines */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <svg className="w-full h-full text-green-300">
            {linePositions.map((pos) => {
              // Calculate line length for animation duration
              const length = Math.sqrt(
                Math.pow(pos.x2 - pos.x1, 2) + 
                Math.pow(pos.y2 - pos.y1, 2)
              );
              const duration = 10 + (length / 20); // Longer lines move slower
              
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
                    opacity: 0.6 + Math.random() * 0.4, // Random opacity for depth
                  }}
                />
              );
            })}
          </svg>
        </div>
      </section>
      
      {/* Stats Section with Wheat Background */}
      <section className="py-16 bg-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Card 1 */}
            <div className="group bg-wheat/80 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-wheat/90">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white">
                  <FaUsers className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
                    10,000+
                  </h3>
                  <p className="text-base font-medium text-amber-900/80">Youth Employed</p>
                </div>
              </div>
            </div>
            
            {/* Stat Card 2 */}
            <div className="group bg-wheat/80 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-wheat/90">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white">
                  <FaChartLine className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
                    85%
                  </h3>
                  <p className="text-base font-medium text-amber-900/80">Employment Rate</p>
                </div>
              </div>
            </div>
            
            {/* Stat Card 3 - Green Theme */}
            <div className="group bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-green-100">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white">
                  <FaLightbulb className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">
                    50+
                  </h3>
                  <p className="text-base font-medium text-green-900/80">Training Programs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section - Compact */}
      <section className="py-16 bg-gray-400">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-gray-600">Simple steps to start your journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Sign Up",
                description: "Create your account and complete your profile.",
                icon: <FaUser className="h-5 w-5" />,
                gradient: "from-blue-500 to-blue-600",
                bgGradient: "bg-white"
              },
              {
                title: "Take Assessment",
                description: "Complete our skills assessment to identify your strengths.",
                icon: <FaChartLine className="h-5 w-5" />,
                gradient: "from-purple-500 to-purple-600",
                bgGradient: "bg-white"
              },
              {
                title: "Get Matched",
                description: "We'll connect you with personalized opportunities Matching With Your skills.",
                icon: <FaHandshake className="h-5 w-5" />,
                gradient: "from-pink-500 to-pink-600",
                bgGradient: "bg-white"
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className={`group p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-opacity-30 ${step.bgGradient} hover:bg-opacity-100`}
              >
                <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white mb-4`}>
                  {step.icon}
                </div>
                <h3 className={`text-xl font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent mb-2`}>
                  {step.title}
                </h3>
                <p className="text-gray-700 text-sm">{step.description}</p>
                <div className={`mt-4 h-0.5 w-10 bg-gradient-to-r ${step.gradient} opacity-50`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of youth who have Empowered through our platform
          </p>
          <Link 
            to="/signup" 
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#0033FF] to-[#000333DD] hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
          >
            Sign Up Now <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
      <Chatbot/>
      <Footer />
    </div>
  );
}
