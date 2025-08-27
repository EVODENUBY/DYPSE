import axios from 'axios';

const getAIResponse = async (message: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/chat`,
      { message },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    
    return response.data.response;
  } catch (error) {
    console.error('Error calling chat API:', error);
    return "I'm having trouble connecting to the chat service. Please try again later.";
  }
};

export default getAIResponse;
