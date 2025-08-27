import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';

export function AboutUsPage() {
  const teamMembers = [
    {
      name: 'Evode',
      role: 'Software Engineer',
      image: '/team/evode.jpg'
    },
    {
      name: 'Nancy Sabrina',
      role: 'UI/UX Designer',
      image: '/team/nancy.jpg'
    },
    {
      name: 'Enock',
      role: 'CyberSecurity Expert',
      image: '/team/enock.jpg'
    },
    {
      name: 'JeanClaude',
      role: 'Data scientist',
      image: '/team/claude.jpg'
    },
    {
      name: 'Forbin',
      role: 'AI/ML Expert',
      image: '/team/forbin.jpg'
    }
  ];

  const platformFeatures = [
    {
      title: 'Job Matching',
      description: 'Advanced algorithms to match your skills with the perfect job opportunities.'
    },
    {
      title: 'Career Guidance',
      description: 'Personalized career advice and development plans.'
    },
    {
      title: 'Skill Development',
      description: 'Access to training and certification programs.'
    },
    {
      title: 'Networking',
      description: 'Connect with industry professionals and peers.'
    },
    {
      title: 'Real-time Updates',
      description: 'Stay informed about new job postings and opportunities.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#ddd3da] to-[#0033FF]">
      <NavBar />
      <main>
        {/* Video Section */}
        <section className="mb-10">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 w-full bg-gray-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="text-lg font-medium text-gray-600 mb-4">Video: Our Story</p>
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto cursor-pointer hover:bg-blue-700 transition-colors">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, About Section */}
        <section className="py-10">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mission Card */}
              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To connect talented youth with meaningful employment opportunities through innovative technology and personalized career guidance, bridging the gap between education and employment.
                </p>
              </div>

              {/* Vision Card */}
              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9m11 4v5h-5m5 0v-5h5M1 4h18v2H1V4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To become the leading platform for youth employment in Rwanda, empowering the next generation of professionals and driving economic growth through employment opportunities.
                </p>
              </div>

              {/* About Us */}
              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">About Us</h3>
                <p className="text-sm text-gray-600">
                  We are a dedicated team passionate about solving youth unemployment through technology. Our platform connects job seekers with employers, provides career guidance, and offers skill development resources.
                </p>
              </div>
            </div>
          </div>
        </section>

     
      
      {/* Team and Features Section */}
      <section className="px-11 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Team Section */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {teamMembers.map((member, index) => {
                    // Get first letter of first name and first letter of last name if exists
                    const [firstName, ...lastName] = member.name.split(' ');
                    const initials = (firstName[0] + (lastName.length > 0 ? lastName[0][0] : '')).toUpperCase();
                    
                    return (
                      <div key={index} className="text-center"> 
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 overflow-hidden flex items-center justify-center">
                          <span className="text-xl font-bold text-white">
                            {initials}
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-gray-900">{member.name}</h4>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Platform Features */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Platform Offers</h2>
                <ul className="space-y-3">
                  {platformFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 mr-2 mt-0.5 flex-shrink-0">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">{feature.title}: </span>
                      <span className="text-xs text-gray-600">{feature.description}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

export default AboutUsPage;
