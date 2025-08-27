import { Router } from 'express';
import { requireAuth as auth } from '../middlewares/auth';
import OpenAI from 'openai';
import { Request, Response } from 'express';

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant for the DYSEM (Dynamic Youth Skills and Employment Management) program. Your goal is to assist youth with employment opportunities, skills development, and career guidance. Be concise, friendly, and professional in your responses.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request. Could you please rephrase your question?";
    
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

export default router;
