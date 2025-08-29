'use client';

import { ReactNode, useState, useEffect } from 'react';
import { MessageCircle, X, GripVertical } from 'lucide-react';
import TopBar from './TopBar';
import ChatSidebar from './ChatSidebar';
import BottomNavigationBar from './BottomNavigationBar';
import { useChatStore } from '@/stores/chatStore';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

interface LayoutGameProps {
  children: ReactNode;
  chatMessages?: Array<{
    user: string;
    message: string;
    time: string;
    type: 'user' | 'system';
  }>;
}

export default function LayoutGame({ children, chatMessages = [] }: LayoutGameProps) {
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const { isVisible: isChatVisible, setVisibility } = useChatStore();
  const [chatPanelSize, setChatPanelSize] = useState(30);

  // Detectar quando o painel do chat é redimensionado para muito pequeno
  const handlePanelResize = (sizes: number[]) => {
    const chatSize = sizes[1]; // Segundo painel (chat)
    setChatPanelSize(chatSize);
    
    // Se o painel for redimensionado para menos de 5%, ocultar o chat
    if (chatSize < 5 && isChatVisible) {
      setVisibility(false);
    } else if (chatSize >= 5 && !isChatVisible) {
      setVisibility(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#00011f] text-white">
      <div className="flex h-screen">
        {/* Desktop Layout com Resizable */}
        <div className="hidden lg:flex flex-1">
          <ResizablePanelGroup 
            direction="horizontal" 
            className="h-full"
            onLayout={handlePanelResize}
          >
            {/* Painel Principal - Conteúdo */}
            <ResizablePanel defaultSize={isChatVisible ? 70 : 100} minSize={50} maxSize={isChatVisible ? 80 : 100}>
              <div className="h-full bg-gradient-to-br from-slate-900/50 to-[#00011f]/30 backdrop-blur-sm">
                {/* Conteúdo Scrollável com TopBar dentro */}
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#00011f]/50 scrollbar-track-transparent">
                  {/* Top Bar dentro do scroll */}
                  <div className="p-4 ">
                    <TopBar />
                  </div>

                  <div className="p-4">
                    <div className="max-w-full">
                      {children}
                    </div>
                  </div>

              
                
                </div>
              </div>
            </ResizablePanel>

            {/* Handle Redimensionável - Só aparece se chat estiver visível */}
            {isChatVisible && (
              <ResizableHandle className="w-2 bg-gradient-to-b from-[#00011f]/20 via-[#00011f]/40 to-[#00011f]/20 hover:bg-[#00011f]/60 transition-all duration-300 relative group">
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-[#00011f]/30 group-hover:bg-[#00011f]/80 transition-colors duration-300 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <GripVertical className="w-4 h-4 text-[#00011f]/50 group-hover:text-[#00011f] transition-colors duration-300" />
                </div>
              </ResizableHandle>
            )}

            {/* Painel Chat - Só aparece se estiver visível */}
            {isChatVisible && (
              <ResizablePanel defaultSize={30} minSize={5} maxSize={50}>
              <div className="h-full bg-slate-900 border-l border-slate-700">
                <div className="h-full flex flex-col">


                  {/* Chat Content - Maximizado */}
                  <div className="flex-1 overflow-hidden bg-slate-900">
                    <div className="h-full">
                      <ChatSidebar messages={chatMessages} />
                    </div>
                  </div>
                </div>
              </div>
              </ResizablePanel>
            )}
          </ResizablePanelGroup>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex-1">
          <div className="h-full">
            {/* Conteúdo Mobile com TopBar dentro do scroll */}
            <div className="h-full overflow-y-auto pb-24">
              {/* Top Bar Mobile dentro do scroll */}
              <div className="p-4 ">
                <TopBar />
              </div>

              <div className="p-4">
                {children}
              </div>
            </div>

           
          </div>

          {/* Mobile Chat Drawer */}
          <Drawer open={isChatDrawerOpen} onOpenChange={setIsChatDrawerOpen}>
            <DrawerTrigger asChild>
              <button className="fixed bottom-24 right-6 z-50 p-4 bg-blue-600 hover:bg-blue-700 rounded-full shadow-2xl shadow-blue-600/25 transition-all duration-300 hover:scale-110 border border-blue-500">
                <MessageCircle className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75" />
                </div>
              </button>
            </DrawerTrigger>
            <DrawerContent className="bg-[#00011f] border-slate-700 max-h-[95vh]">
             
              <div className="flex-1 overflow-hidden bg-[#00011f] min-h-0 bottom-0">
                <div className="h-full">
                  <ChatSidebar messages={chatMessages} />
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* Bottom Navigation Bar - Mobile Only */}
      <div className="lg:hidden">
        <BottomNavigationBar />
      </div>

    </main>
  );
}
