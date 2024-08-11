// app/api/evaluate-response/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { question, answer } = await req.json();

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key is not set' }, { status: 500 });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an AI assistant that evaluates interview responses and provides constructive feedback.' },
          { role: 'user', content: `Question: ${question}\n\nAnswer: ${answer}\n\nPlease evaluate this answer, provide a rating out of 10, and suggest improvements.` }
        ],
        temperature: 0.7,
        max_tokens: 300,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const feedback = response.data.choices[0].message.content;
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Error evaluating response:', error);
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json({ error: error.response.data.error.message }, { status: error.response.status });
    }
    return NextResponse.json({ error: 'Failed to evaluate response' }, { status: 500 });
  }
}