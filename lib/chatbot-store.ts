// Simple in-memory store for chatbot messages (Dev only)
// In production, this should be replaced by Redis or a database.

type ChatMessage = {
  role: 'bot';
  content: string;
  timestamp: number;
};

const messageStore: Record<string, ChatMessage[]> = {};

export const saveChatbotMessage = (sessionId: string, message: string) => {
  if (!messageStore[sessionId]) {
    messageStore[sessionId] = [];
  }
  messageStore[sessionId].push({
    role: 'bot',
    content: message,
    timestamp: Date.now(),
  });
};

export const getChatbotMessages = (sessionId: string, since: number = 0) => {
  const messages = messageStore[sessionId] || [];
  return messages.filter(m => m.timestamp > since);
};

export const clearChatbotMessages = (sessionId: string) => {
  delete messageStore[sessionId];
};
