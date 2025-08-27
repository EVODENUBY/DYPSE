import { useState } from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export function ContactUsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    { 
      question: 'How do I join the program?', 
      answer: 'To join our program, simply fill out the application form on our website. After submission, our team will review your application and contact you within 2-3 business days with the next steps.' 
    },
    { 
      question: 'What are the requirements?', 
      answer: 'Our program is open to individuals who are between 18-35 years old, have completed high school education, and demonstrate a strong interest in technology and career development. No prior experience is required for our beginner programs.' 
    },
    { 
      question: 'Is there a cost to join?', 
      answer: 'Our basic program is completely free of charge. We also offer premium services and advanced courses at a reasonable fee for those who want additional career support, mentorship, and specialized training.' 
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#ddd3da] to-[#0033FF]">
      <NavBar />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-12">Contact Us</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form*/}
            <div className="lg:col-span-2">
              <form className="space-y-4">
                <div>
                  <input type="text" placeholder='Add your Full name' className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <input type="email" placeholder='Add your Email' className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <div>
                  <textarea rows={3} placeholder='Type Your message' className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>

                <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                  Send The Message
                </button>
              </form>
            </div>

            {/* Right Column - Contact Info and FAQ */}
            <div className="space-y-4">
              {/* Contact Info Card */}
              <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="h-32 mb-4 rounded-lg overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.527762567957!2d30.06108631475396!3d-1.9440729985847988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca4258ed2f5b9%3A0x1b3b3d5d3a3e0b0a5!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy"
                    title="Kigali, Rwanda"
                  ></iframe>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-3 text-base text-gray-700">
                      <p>KG500 Nyarugenge</p>
                      <p>Kigali, Rwanda</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3 text-base text-gray-700">
                      <p>dypse.ict.chamber@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-3 text-base text-gray-700">
                      <p>+(250)791 783 308</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
                <div className="space-y-2 text-sm">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full flex justify-between items-center p-3 text-left hover:bg-gray-50 transition-colors text-sm"
                        aria-expanded={openIndex === index}
                        aria-controls={`faq-${index}`}
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {openIndex === index ? (
                          <FiChevronUp className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        ) : (
                          <FiChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      <div 
                        id={`faq-${index}`}
                        className={`px-3 pb-3 text-sm ${openIndex === index ? 'block' : 'hidden'}`}
                      >
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ContactUsPage;
