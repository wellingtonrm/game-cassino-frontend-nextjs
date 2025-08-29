'use client';

import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

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

  return (
    <div className="w-72 bg-gradient-to-b from-gray-800/50 to-gray-900/50 border-l border-gray-700/50 flex flex-col">
      {/* Cabeçalho do Chat */}
      <div className="p-3 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-sm">Chat ao Vivo</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs">324 online</span>
          </div>
        </div>
      </div>

      {/* Mensagens do Chat */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start space-x-2 ${
            msg.type === 'system' ? 'justify-center' : ''
          }`}>
            {msg.type === 'system' ? (
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-2 py-1 text-center">
                <span className="text-blue-400 text-xs">{msg.message}</span>
              </div>
            ) : (
              <>
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold">{msg.user[0]}</span>
                </div>
                <div className="flex-1">
                  <div className="bg-white/10 rounded-lg p-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-xs">{msg.user}</span>
                      <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                    <p className="text-xs">{msg.message}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Campo de Entrada do Chat */}
      <div className="p-3 border-t border-gray-700/50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-blue-400 transition-all duration-300"
          />
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-1 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}