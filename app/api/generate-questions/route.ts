import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { jobDescription } = await req.json();

    if (!jobDescription) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
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
          { role: 'system', content: 'You are an AI assistant that generates interview questions based on job descriptions.' },
          { role: 'user', content: `Given the following job description, generate a list of 5 interview questions:\n\n${jobDescription}` }
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

    const questions = response.data.choices[0].message.content
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(question => question.replace(/^\d+\.\s*/, '').trim()); // Remove numbering if present

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json({ error: error.response.data.error.message }, { status: error.response.status });
    }
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
  }
}