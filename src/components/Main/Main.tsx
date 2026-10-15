import { useState } from 'react';
import ChatWindow from '@/components/ChatWindow/ChatWindow';
import Sidebar from '@/components/Sidebar/Sidebar';
import type { ChatInfo, MessageInfo } from './Main.types';

interface MainProps {
  className?: string;
  userData: {
    idInstance: string;
    apiTokenInstance: string;
  };
}

// TODO: в будущем можно вынести в utils
const getPhoneDigits = (phone: string) => phone.replace(/\D/g, '');

// TODO: в будущем можно вынести в utils
const formatMessageTime = (date: Date) =>
  date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

/**
 * Главный компонент приложения
 * @param className
 * @returns
 */
const Main = ({ className = '' }: MainProps) => {
  const [chatList, setChatList] = useState<ChatInfo[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);

  const currentChat =
    chatList.find((chat) => chat.id === currentChatId) ?? null;

  const handleChatSelect = (chatId: number) => {
    setCurrentChatId(chatId);
  };

  const handleCreateChat = (phone: string) => {
    const digits = getPhoneDigits(phone);
    const existingChat = chatList.find(
      (chat) => getPhoneDigits(chat.phone) === digits,
    );

    if (existingChat) {
      setCurrentChatId(existingChat.id);
      return;
    }

    const newChat: ChatInfo = {
      id: Date.now(),
      phone,
      lastMessage: '',
      lastMessageTime: '',
      messages: [],
    };

    setChatList((prev) => {
      const alreadyExists = prev.some(
        (chat) => getPhoneDigits(chat.phone) === digits,
      );
      return alreadyExists ? prev : [newChat, ...prev];
    });
    setCurrentChatId(newChat.id);
  };

  const handleSendMessage = (text: string) => {
    const messageText = text.trim();
    if (!messageText || currentChatId === null) {
      return;
    }

    const time = formatMessageTime(new Date());
    const message: MessageInfo = {
      id: Date.now(),
      message: messageText,
      time,
      isOutgoing: true,
    };

    setChatList((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              lastMessage: messageText,
              lastMessageTime: time,
              messages: [...chat.messages, message],
            }
          : chat,
      ),
    );
  };

  return (
    <div className={`${className} flex h-full w-full min-h-0`}>
      <div className='flex h-full w-80 shrink-0 flex-col p-4 md:w-96'>
        <Sidebar
          chats={chatList}
          activeChatId={currentChatId}
          onCreateChat={handleCreateChat}
          onSelectChat={handleChatSelect}
        />
      </div>
      <div className='flex h-full min-w-0 flex-1 flex-col p-4 pl-0'>
        <ChatWindow
          chat={currentChat}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default Main;
