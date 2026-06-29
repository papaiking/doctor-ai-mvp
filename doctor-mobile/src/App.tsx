import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { VoiceVisualizer } from './components/VoiceVisualizer';
import { ChatInterface, Message } from './components/ChatInterface';
import { BottomNav } from './components/BottomNav';
import HistoryPage from './components/HistoryPage';
import { Mic, Square, Activity } from 'lucide-react';
import { usePipecat } from './hooks/usePipecat';

export default function App() {
  const [activeTab, setActiveTab] = useState('doctor');

  const {
    connectionStatus,
    isSpeaking,
    isConnected,
    messages,
    error,
    connect,
    disconnect,
    addMessage,
  } = usePipecat();

  const isListening = isConnected && !isSpeaking;
  const isConnecting = connectionStatus === 'connecting';

  const handleToggle = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('message-input') as HTMLInputElement;
    const text = input.value.trim();
    if (!text) return;
    addMessage(text);
    input.value = '';
  }, [addMessage]);

  const renderDoctorView = () => (
    <>
      <main className="flex-1 pt-[calc(64px+env(safe-area-inset-top))] pb-[calc(148px+env(safe-area-inset-bottom))] overflow-hidden flex flex-col">
        <VoiceVisualizer
          isListening={isListening}
          isSpeaking={isSpeaking}
          connectionStatus={connectionStatus}
        />

        <div className="flex-1 overflow-y-auto min-h-0">
          <ChatInterface messages={messages as Message[]} isThinking={isSpeaking} />
        </div>
      </main>

      <div className="fixed bottom-[calc(64px+env(safe-area-inset-bottom))] left-0 right-0 bg-gradient-to-t from-[#F4F7FA] via-[#F4F7FA] to-transparent pb-4 pt-8 z-40">
        <div className="px-6 flex flex-col gap-4">
          <form onSubmit={handleSendMessage} className="max-w-sm mx-auto w-full relative">
            <input
              name="message-input"
              type="text"
              placeholder="Nhập câu trả lời..."
              disabled={!isConnected}
              className="w-full bg-white border border-gray-200 rounded-full py-3 px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={!isConnected}
            >
              <Activity className="w-4 h-4" />
            </button>
          </form>

          {error && (
            <p className="text-center text-sm text-error">{error}</p>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleToggle}
              disabled={isConnecting}
              className={`flex items-center justify-center gap-3 font-semibold py-4 px-10 rounded-full shadow-lg active:scale-95 transition-all w-full max-w-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                isConnected
                  ? 'bg-error text-white hover:bg-red-600'
                  : 'bg-primary text-white hover:bg-blue-700'
              }`}
            >
              {isConnecting ? (
                <>
                  <Square className="w-6 h-6" />
                  <span className="text-lg">Đang kết nối...</span>
                </>
              ) : isConnected ? (
                <>
                  <Square className="w-6 h-6" />
                  <span className="text-lg">Dừng cuộc hội thoại</span>
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6" />
                  <span className="text-lg">Bắt đầu nói</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const renderHistoryView = () => (
    <HistoryPage />
  );

  const renderHomeView = () => (
    <main className="flex-1 pt-[calc(64px+env(safe-area-inset-top))] pb-[calc(96px+env(safe-area-inset-bottom))] overflow-y-auto flex items-center justify-center">
      <p className="text-text-muted text-lg">Trang chủ</p>
    </main>
  );

  const renderSettingsView = () => (
    <main className="flex-1 pt-[calc(64px+env(safe-area-inset-top))] pb-[calc(96px+env(safe-area-inset-bottom))] overflow-y-auto flex items-center justify-center">
      <p className="text-text-muted text-lg">Cài đặt</p>
    </main>
  );

  return (
    <div className="flex flex-col h-dvh bg-[#F4F7FA]">
      <Header />

      {activeTab === 'doctor' && renderDoctorView()}
      {activeTab === 'history' && renderHistoryView()}
      {activeTab === 'home' && renderHomeView()}
      {activeTab === 'settings' && renderSettingsView()}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
