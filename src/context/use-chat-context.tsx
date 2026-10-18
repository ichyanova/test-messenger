/**
 * Контекст для работы с чатами
 */
import { createContext, useContext, useState, useCallback } from 'react';
import type { ChatInfo, MessageInfo, ShortChatInfo } from '@/types/chat.types';
import type { UserData } from '@/types/auth.types';
import {
  sendMessage as sendMessageService,
  type SendMessageResult,
  type ReceivedMessage,
} from '@/services/chat';
import { useAuthContext } from '@/context/use-auth-context';
import { useMessagePoller } from '@/hooks/use-message-poller';

export interface ChatContextProps {
  chatList: ChatInfo[];
  addChat: (data: ShortChatInfo) => void;
  addMessage: (chatId: string, messageData: MessageInfo) => void;
  currentChatId: string | null;
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
  const { userData } = useAuthContext();
  const [chatList, setChatList] = useState<ChatInfo[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  /**
   * Добавить новый чат в список и установить его активным
   */
  const addChat = useCallback((data: ShortChatInfo) => {
    setChatList((prev: ChatInfo[]) => {
      const existingChat = prev.some(
        (chat: ChatInfo) => chat.chatId === data.chatId,
      );

      if (existingChat) {
        return prev;
      }

      const newChat: ChatInfo = {
        chatId: data.chatId,
        username: data.username,
        phoneNumber: data.phoneNumber,
        lastMessage: '',
        lastMessageTime: '',
        messages: [],
      };

      return [newChat, ...prev];
    });
    setCurrentChatId(data.chatId);
  }, []);

  /**
   * Добавить новое сообщение в чат по его chatId
   */
  const addMessage = useCallback((chatId: string, messageData: MessageInfo) => {
    setChatList((prev: ChatInfo[]) => {
      const activeChat = prev.find((chat: ChatInfo) => chat.chatId === chatId);

      if (!activeChat) {
        return prev;
      }

      const updatedChat: ChatInfo = {
        ...activeChat,
        lastMessage: messageData.message,
        lastMessageTime: messageData.time,
        messages: [...activeChat.messages, messageData],
      };
      const chatListWithoutUpdatedChat = prev.filter(
        (chat: ChatInfo) => chat.chatId !== chatId,
      );
      return [updatedChat, ...chatListWithoutUpdatedChat];
    });
  }, []);

  /**
   * Добавить входящее сообщение. Если чата ещё нет, создать его
   */
  const addIncomingMessage = useCallback((data: ReceivedMessage) => {
    setChatList((prev: ChatInfo[]) => {
      const existingChat = prev.find(
        (chat: ChatInfo) => chat.chatId === data.chatId,
      );

      if (!existingChat) {
        const newChat: ChatInfo = {
          chatId: data.chatId,
          username: data.username,
          phoneNumber: data.phoneNumber,
          lastMessage: data.messageData.message,
          lastMessageTime: data.messageData.time,
          messages: [data.messageData],
        };

        return [newChat, ...prev];
      }

      const existingMessage = existingChat.messages.some(
        (message: MessageInfo) => message.id === data.messageData.id,
      );

      if (existingMessage) {
        return prev;
      }

      const updatedChat: ChatInfo = {
        ...existingChat,
        lastMessage: data.messageData.message,
        lastMessageTime: data.messageData.time,
        messages: [...existingChat.messages, data.messageData],
      };

      const chatListWithoutUpdatedChat = prev.filter(
        (chat: ChatInfo) => chat.chatId !== data.chatId,
      );
      return [updatedChat, ...chatListWithoutUpdatedChat];
    });
  }, []);

  /**
   * Отправить сообщение в Telegram
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

  /**
   * Получение входящих сообщений
   */
  useMessagePoller({ userData, onMessageReceived: addIncomingMessage });

  return (
    <ChatContext.Provider
      value={{
        chatList,
        addChat,
        currentChatId,
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
