'use client';

import { useState } from 'react';
import { MessageCircle, Send, Users } from 'lucide-react';

interface ChatMessage {
  user: string;
  message: string;
  time: string;
  type: 'user' | 'system';
}

interface ChatSidebarProps {
  messages: ChatMessage[];
}

export default function ChatSidebar({ messages }: ChatSidebarProps) {
  const [chatMessage, setChatMessage] = useState('');

  const defaultMessages: ChatMessage[] = [
    { user: 'Sistema', message: 'João entrou na sala', time: '14:30', type: 'system' },
    { user: 'Ana Silva', message: 'Olá pessoal! Como estão?', time: '14:32', type: 'user' },
    { user: 'Carlos M.', message: 'Tudo bem! Pronto para começar a apresentação', time: '14:33', type: 'user' },
    { user: 'Sistema', message: 'Maria conectou-se', time: '14:34', type: 'system' },
    { user: 'Maria Santos', message: 'Desculpem o atraso!', time: '14:35', type: 'user' },
  ];

  const displayMessages = messages && messages.length > 0 ? messages : defaultMessages;

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Aqui você adicionaria a lógica para enviar a mensagem
      setChatMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#00011f] to-[#000318] border-l border-blue-800/20 flex flex-col h-full shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="px-6 py-5 border-b border-blue-800/20 bg-gradient-to-r from-[#000318]/80 to-[#00011f]/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm tracking-wide">Chat ao Vivo</h3>
              <p className="text-xs text-blue-300/80">Conversas em tempo real</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-green-900/40 to-emerald-900/40 px-4 py-2 rounded-full border border-green-700/30 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <Users className="w-3 h-3 text-green-300" />
            <span className="text-green-300 text-xs font-medium">324 online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-5 space-y-5 overflow-y-auto bg-gradient-to-b from-[#000318]/50 to-[#00011f]/50 backdrop-blur-sm">
        {displayMessages.map((msg, index) => (
          <div key={index} className={`flex ${
            msg.type === 'system' ? 'justify-center' : 'items-start space-x-4'
          }`}>
            {msg.type === 'system' ? (
              <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-600/30 rounded-xl px-4 py-2 backdrop-blur-sm shadow-lg">
                <span className="text-blue-200 text-xs font-medium">{msg.message}</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-blue-400/20">
                  <span className="text-sm font-bold text-white">{msg.user[0]}</span>
                </div>
                <div className="flex-1 max-w-xs">
                  <div className="bg-gradient-to-br from-[#001133]/80 to-[#000318]/80 rounded-2xl p-4 shadow-xl border border-blue-700/20 backdrop-blur-md hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white text-xs tracking-wide">{msg.user}</span>
                      <span className="text-xs text-blue-300/70">{msg.time}</span>
                    </div>
                    <p className="text-sm text-blue-50 leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-5 bg-gradient-to-r from-[#00011f]/90 to-[#000318]/90 border-t border-blue-700/20 backdrop-blur-md">
        <div className="flex space-x-3">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-gradient-to-r from-[#000318]/80 to-[#001133]/80 border border-blue-700/30 rounded-xl px-5 py-3 text-sm text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50
                     transition-all duration-300 placeholder-blue-300/60 backdrop-blur-sm shadow-inner
                     hover:border-blue-600/40"
          />
          <button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-3 rounded-xl
                     transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl
                     focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-[#00011f]
                     disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            disabled={!chatMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-4 text-xs text-blue-300/70">
          <span>Pressione Enter para enviar</span>
          <span className="bg-blue-900/30 px-2 py-1 rounded-md">{chatMessage.length}/500</span>
        </div>
      </div>
    </div>
  );
}