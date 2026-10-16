/**
 * Хук для работы с контекстом чатов
 *
 */
import { createContext, useContext, useState } from 'react';
import type { ChatInfo, MessageInfo, ShortChatInfo } from '@/types/chat.types';

export interface ChatContextProps {
  chatList: ChatInfo[];
  addChat: (data: ShortChatInfo) => void;
  addMessage: (chatId: string, message: string, time: string) => void;
  currentChatId: string | null;
  setCurrentChatId: (currentChatId: string | null) => void;
}

interface ChatContextProviderProps {
  children: React.ReactNode;
}

const ChatContext = createContext<ChatContextProps | null>(null);

export const ChatContextProvider = ({ children }: ChatContextProviderProps) => {
  const [chatList, setChatList] = useState<ChatInfo[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  /**
   * Добавить новый чат в список и установить его активным
   * @param data - данные о чате
   */
  const addChat = (data: ShortChatInfo) => {
    const existingChat = chatList.find(
      (chat: ChatInfo) => chat.chatId === data.chatId,
    );

    if (existingChat) {
      setCurrentChatId(existingChat.chatId);
      return;
    }

    const newChat: ChatInfo = {
      chatId: data.chatId,
      username: data.username,
      phoneNumber: data.phoneNumber,
      lastMessage: '',
      lastMessageTime: '',
      messages: [],
    };

    setChatList((prev: ChatInfo[]) => {
      const alreadyExists = prev.some(
        (chat: ChatInfo) => chat.chatId === data.chatId,
      );
      return alreadyExists ? prev : [newChat, ...prev];
    });
    setCurrentChatId(newChat.chatId);
  };

  /**
   * Добавить новое сообщение в чат по его chatId
   * @param chatId - chatId чата
   * @param message - новое сообщение
   * @param time - время сообщения
   */
  const addMessage = (chatId: string, message: string, time: string) => {
    const newMessageData: MessageInfo = {
      id: Date.now(),
      message: message,
      time,
      isOutgoing: true,
    };

    setChatList((prev: ChatInfo[]) =>
      prev.map((chat: ChatInfo) =>
        chat.chatId === chatId
          ? {
              ...chat,
              lastMessage: message,
              lastMessageTime: time,
              messages: [...chat.messages, newMessageData],
            }
          : chat,
      ),
    );
  };

  return (
    <ChatContext.Provider
      value={{
        chatList,
        addChat,
        currentChatId,
        setCurrentChatId,
        addMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = (): ChatContextProps => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error(
      'useChatContext must be used within an ChatContextProvider',
    );
  }
  return context;
};
