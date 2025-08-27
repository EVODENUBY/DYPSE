import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';
import getAIResponse from '../../utils/openai';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! I\'m your DYPSM assistant. I can help you with job applications, skills training, and career guidance. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    try {
      // Show typing indicator
      const typingMessage: Message = {
        id: messages.length + 2,
        text: '...',
        sender: 'bot',
        timestamp: new Date(),
        isTyping: true
      };
      
      setMessages((prev) => [...prev, typingMessage]);

      // Get AI response
      const aiResponse = await getAIResponse(inputValue);
      
      // Remove typing indicator and add AI response
      setMessages((prev) => {
        const newMessages = prev.filter(msg => !msg.isTyping);
        return [
          ...newMessages,
          {
            id: messages.length + 2,
            text: aiResponse,
            sender: 'bot',
            timestamp: new Date(),
          }
        ];
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages((prev) => {
        const newMessages = prev.filter(msg => !msg.isTyping);
        return [
          ...newMessages,
          {
            id: messages.length + 2,
            text: "I'm having trouble connecting to the AI service. Please try again later.",
            sender: 'bot',
            timestamp: new Date(),
          }
        ];
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div 
          ref={modalRef}
          className="bg-white rounded-t-2xl rounded-bl-2xl shadow-xl w-80 h-[500px] flex flex-col overflow-hidden border border-gray-300"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0033FF] to-[#000333DD] p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FaRobot className="h-5 w-5" />
              <h3 className="font-semibold">DYPSE Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <div className={`text-sm ${message.isTyping ? 'text-gray-500' : ''}`}>
                      {message.isTyping ? 'Typing...' : message.text}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                aria-label="Send message"
              >
                <FiSend className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-[#0033FF] to-[#000333DD] text-white px-5 py-3 rounded-full shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-1 focus:outline-none flex items-center space-x-2"
          aria-label="Open chat"
        >
          <FiMessageSquare className="h-5 w-5" />
          <span className="font-medium">Chat with Us?</span>
        </button>
      )}
    </div>
  );
}
