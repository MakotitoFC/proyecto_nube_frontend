'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IconMessageChatbot, IconX, IconSend, IconLoader2 } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_CHATBOT_WEBHOOK_URL || '';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const lastPollTime = useRef(Date.now());
  const pollingActive = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generar sessionId único al montar el componente
    const id = crypto.randomUUID?.() || Math.random().toString(36).substring(7);
    setSessionId(id);
    
    // Mensaje de bienvenida inicial
    setMessages([{ role: 'bot', content: '¡Hola! ¿En qué puedo ayudarte hoy?' }]);

    return () => {
      pollingActive.current = false;
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const startPolling = async (sid: string) => {
    if (pollingActive.current) return;
    pollingActive.current = true;
    
    const poll = async () => {
      if (!pollingActive.current) return;

      try {
        const res = await fetch(`/api/chatbot/messages/${sid}?since=${lastPollTime.current}`);
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.messages.length > 0) {
            setMessages((prev) => {
              // Filtrar mensajes duplicados por si acaso
              const existingHashes = new Set(prev.map(m => m.content + m.role));
              const newMessages = data.messages.filter((m: any) => !existingHashes.has(m.content + m.role));
              return [...prev, ...newMessages];
            });
            lastPollTime.current = Date.now();
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }

      if (pollingActive.current) {
        setTimeout(poll, 2000);
      }
    };

    poll();
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          key: process.env.NEXT_PUBLIC_CHATBOT_KEY,
          type: 'web',
          sessionId: sessionId,
        }),
      });

      if (!response.ok) throw new Error('Error en el envío');
      if (!response.body) throw new Error('Cuerpo vacío');

      const parseBlocks = (text: string): string[] => {
        const blocks: string[] = [];
        
        // 1. Try parsing as a complete JSON
        try {
          const data = JSON.parse(text.trim());
          if (Array.isArray(data)) {
            data.forEach(item => {
              if (item && typeof item.bloque === 'string') {
                blocks.push(item.bloque);
              }
            });
            return blocks;
          } else if (data && typeof data.bloque === 'string') {
            return [data.bloque];
          }
        } catch (e) {
          // Fall through
        }

        // 2. Try parsing individual lines if they are valid JSONs (e.g. streaming chunks)
        const lines = text.split('\n').filter(l => l.trim());
        let processedLines = false;
        for (const line of lines) {
          try {
            const data = JSON.parse(line.trim());
            if (Array.isArray(data)) {
              data.forEach(item => {
                if (item && typeof item.bloque === 'string') {
                  blocks.push(item.bloque);
                }
              });
              processedLines = true;
            } else if (data && typeof data.bloque === 'string') {
              blocks.push(data.bloque);
              processedLines = true;
            }
          } catch (e) {
            // Ignore line parse error
          }
        }

        if (processedLines) {
          return blocks;
        }

        // 3. Fallback: regex matching for "bloque" fields
        const regex = /"bloque"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
          try {
            const cleanContent = JSON.parse(`"${match[1]}"`);
            blocks.push(cleanContent);
          } catch (e) {
            blocks.push(match[1]);
          }
        }

        return blocks;
      };

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          accumulatedText += decoder.decode(value, { stream: !done });
          const parsedBlocks = parseBlocks(accumulatedText);
          if (parsedBlocks.length > 0) {
            setMessages((prev) => {
              const lastUserIdx = prev.reduce((acc, msg, idx) => msg.role === 'user' ? idx : acc, -1);
              if (lastUserIdx !== -1) {
                return [
                  ...prev.slice(0, lastUserIdx + 1),
                  ...parsedBlocks.map(content => ({ role: 'bot' as const, content }))
                ];
              }
              return prev;
            });
          }
        }
      }

    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages((prev) => [...prev, { role: 'bot', content: 'Lo siento, hubo un problema al procesar tu respuesta.' }]);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="fixed bottom-10 right-10 z-[100] font-principal flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-20 right-0 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
          >
            {/* Header Premium */}
            <div className="p-5 bg-gradient-to-r from-[#07A0A2] to-[#058587] text-white flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <IconMessageChatbot size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg leading-tight">Veracruz AI</h3>
                  <p className="text-xs text-white/80">En línea ahora</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/20 p-2 rounded-xl transition-colors"
                aria-label="Cerrar chat"
              >
                <IconX size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#fcfaf7] custom-scrollbar"
            >
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#07A0A2] text-white rounded-tr-none shadow-md' 
                      : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 rounded-tl-none">
                    <IconLoader2 className="animate-spin text-[#07A0A2]" size={20} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Premium */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="¿En qué te ayudamos?"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#07A0A2]/20 focus:border-[#07A0A2] transition-all outline-none"
              />
              <button 
                type="submit" 
                disabled={isLoading || !message.trim()}
                className="bg-[#07A0A2] text-white p-3 rounded-xl hover:shadow-lg hover:shadow-[#07A0A2]/30 transition-all disabled:opacity-40 disabled:hover:shadow-none"
              >
                <IconSend size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#07A0A2] text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#07A0A2]/40 transition-all flex items-center justify-center relative overflow-hidden group w-16 h-16"
      >
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
        {isOpen ? <IconX size={32} /> : <IconMessageChatbot size={32} />}
      </button>
    </div>
  );
};

