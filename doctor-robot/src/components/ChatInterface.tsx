import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Send, Info } from 'lucide-react';
import type { TranscriptMessage } from '../hooks/usePipecat';
import chatIcon from '../assets/chat_icon_100x100.png';

interface ChatInterfaceProps {
  messages: TranscriptMessage[];
  onSendText: (text: string) => void;
  disabled?: boolean;
}

export const ChatInterface = ({ messages, onSendText, disabled }: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendText(inputValue.trim());
    setInputValue('');
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 xl:p-6 bg-surface rounded-xl border border-gray-100 shadow-inner min-h-0">
      <div className="flex items-center gap-2 text-text-muted text-sm xl:text-base font-medium shrink-0">
        <Info size={16} />
        Sử dụng giọng nói để tra cứu thông tin y tế, đặt lịch hẹn hoặc kiểm tra kết quả xét nghiệm của bạn.
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-200 min-h-0"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-end gap-2 xl:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-8 h-8 xl:w-10 xl:h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-primary/10' : 'bg-white shadow-sm'
              }`}
            >
              {msg.role === 'user' ? (
                <User size={16} className="text-primary" />
              ) : (
                <img src={chatIcon} alt="AI" className="w-4 h-4 xl:w-5 xl:h-5 object-contain" />
              )}
            </div>
            <div
              className={`max-w-[85%] px-4 py-3 xl:px-5 xl:py-3.5 rounded-2xl text-sm xl:text-base leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-white text-text-main border border-gray-100 rounded-bl-none shadow-sm'
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative w-full shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Hoặc nhập câu hỏi của bạn tại đây..."
          disabled={disabled}
          className="w-full bg-white border border-gray-200 rounded-full pl-6 xl:pl-8 pr-14 xl:pr-16 py-4 xl:py-5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm xl:text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || disabled}
          className="absolute right-2 xl:right-3 top-1.5 xl:top-2 p-2.5 xl:p-3 rounded-full bg-primary text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-primary/90"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
