/**
 * Хук для работы с контекстом чатов
 *
 */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ChatInfo, MessageInfo, ShortChatInfo } from '@/types/chat.types';
import type { UserData } from '@/types/user.types';
import {
  sendMessage as sendMessageService,
  type SendMessageResult,
  type ReceivedMessage,
  receiveNotification as receiveNotificationService,
  deleteNotification as deleteNotificationService,
} from '@/services/chat';
import { useAuthContext } from '@/context/use-auth-context';

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
   * Добавить входящее сообщение. Если чата ещё нет, создать его
   */
  const addIncomingMessage = (data: ReceivedMessage) => {
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

      // TODO: Поднять чат с новым сообщением вверх списка
      return prev.map((chat: ChatInfo) =>
        chat.chatId === data.chatId
          ? {
              ...chat,
              lastMessage: data.messageData.message,
              lastMessageTime: data.messageData.time,
              messages: [...chat.messages, data.messageData],
            }
          : chat,
      );
    });
  };

  /**
   * Получение входящих сообщений
   */
  // TODO: Добавить abortController в receiveNotification
  useEffect(() => {
    if (!userData.idInstance || !userData.apiTokenInstance) {
      return;
    }

    let stopped = false;

    const poll = async () => {
      while (!stopped) {
        const result = await receiveNotificationService(userData);

        if (stopped) {
          return;
        }

        if (!result.isSuccess) {
          console.error(result.errorMessage);
          await new Promise((resolve) => setTimeout(resolve, 5000));
          continue;
        }

        if (result.data) {
          addIncomingMessage(result.data);
        }

        if (result.receiptId) {
          await deleteNotificationService(result.receiptId, userData);
        }
      }
    };

    poll();

    return () => {
      stopped = true;
    };
  }, [userData]);

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
