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
    <div className="w-full bg-gray-900/50 border-l border-gray-700/30 flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-white text-sm">Chat ao Vivo</h3>
              <p className="text-xs text-gray-400">Conversas em tempo real</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-3">
          <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <Users className="w-3 h-3 text-green-300" />
            <span className="text-green-300 text-xs font-medium">324 online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {displayMessages.map((msg, index) => (
          <div key={index} className={`flex ${
            msg.type === 'system' ? 'justify-center' : 'items-start space-x-3'
          }`}>
            {msg.type === 'system' ? (
              <div className="bg-blue-500/20 rounded-lg px-3 py-1.5">
                <span className="text-blue-200 text-xs font-medium">{msg.message}</span>
              </div>
            ) : (
              <>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-white">{msg.user[0]}</span>
                </div>
                <div className="flex-1 max-w-xs">
                  <div className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white text-xs">{msg.user}</span>
                      <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-200">{msg.message}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700/30">
        <div className="flex space-x-3">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-white/5 border border-gray-600/30 rounded-lg px-4 py-2.5 text-sm text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50
                     transition-all duration-200 placeholder-gray-400
                     hover:border-gray-500/50"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg
                     transition-all duration-200 flex items-center justify-center
                     focus:outline-none focus:ring-2 focus:ring-blue-400/50
                     disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!chatMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
          <span>Pressione Enter para enviar</span>
          <span className="bg-white/10 px-2 py-1 rounded">{chatMessage.length}/500</span>
        </div>
      </div>
    </div>
  );
}