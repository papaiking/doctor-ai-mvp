import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  isThinking: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isThinking }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scroll-smooth"
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
                message.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
              }`}
            >
              <p className="text-[17px] leading-relaxed">{message.content}</p>
            </div>
          </motion.div>
        ))}

        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-gray-300" 
              />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 rounded-full bg-gray-300" 
              />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 rounded-full bg-gray-300" 
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
