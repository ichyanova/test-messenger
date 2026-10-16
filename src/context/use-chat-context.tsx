/**
 * Хук для работы с контекстом чатов
 *
 */
import { createContext, useContext, useState } from 'react';
import type { ChatInfo, MessageInfo, ShortChatInfo } from '@/types/chat.types';
import type { UserData } from '@/types/user.types';
import {
  sendMessage as sendMessageService,
  type SendMessageResult,
} from '@/services/chat';

export interface ChatContextProps {
  chatList: ChatInfo[];
  addChat: (data: ShortChatInfo) => void;
  addMessage: (chatId: string, messageData: MessageInfo) => void;
  currentChatId: string;
  setCurrentChatId: (currentChatId: string) => void;
  sendMessage: (
    chatId: string,
    message: string,
    userData: UserData,
  ) => Promise<SendMessageResult>;
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
   * @param messageData - данные о сообщении
   * @param time - время сообщения
   */
  const addMessage = (chatId: string, messageData: MessageInfo) => {
    setChatList((prev: ChatInfo[]) =>
      prev.map((chat: ChatInfo) =>
        chat.chatId === chatId
          ? {
              ...chat,
              lastMessage: messageData.message,
              lastMessageTime: messageData.time,
              messages: [...chat.messages, messageData],
            }
          : chat,
      ),
    );
  };

  /**
   * Отправить сообщение в Telegram
   * @param chatId - chatId чата
   * @param message - сообщение
   */
  const sendMessage = async (
    chatId: string,
    message: string,
    userData: UserData,
  ): Promise<SendMessageResult> => {
    const result = await sendMessageService(chatId, message, userData);
    if (result.isSuccess) {
      addMessage(chatId, {
        id: String(result.idMessage),
        message,
        time: new Date().toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isOutgoing: true,
      });
    }
    return result;
  };

  return (
    <ChatContext.Provider
      value={{
        chatList,
        addChat,
        currentChatId: currentChatId ?? '',
        setCurrentChatId,
        addMessage,
        sendMessage,
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
