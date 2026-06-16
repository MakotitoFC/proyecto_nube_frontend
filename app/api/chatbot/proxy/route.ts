import { NextResponse } from 'next/server';

const WEBHOOK_URL = process.env.CHATBOT_WEBHOOK_URL || 
  process.env.NEXT_PUBLIC_CHATBOT_WEBHOOK_URL || '';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.body) {
      return NextResponse.json({ error: 'No response body' }, { status: 500 });
    }


    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Error connecting to chatbot' }, { status: 500 });
  }
}
