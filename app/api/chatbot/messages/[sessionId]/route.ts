import { NextResponse } from 'next/server';
import { getChatbotMessages } from '@/lib/chatbot-store';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const { searchParams } = new URL(request.url);
  const since = parseInt(searchParams.get('since') || '0');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  const messages = getChatbotMessages(sessionId, since);

  return NextResponse.json({ messages });
}
