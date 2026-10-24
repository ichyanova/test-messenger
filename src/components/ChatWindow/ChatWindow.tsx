/**
 * Окно активного чата
 * - отображение сообщений
 * - поле ввода и кнопка отправки сообщения
 */

import { useLayoutEffect, useRef } from 'react';

import type { ChatInfo } from '@/types/chat.types';

import Hint from './Hint/Hint';
import NewMessage from './NewMessage/NewMessage';
import { useChatContext } from '@/context/use-chat-context';
import Header from './Header/Header';
import MessageBubble from './MessageBubble/MessageBubble';

const SCROLL_BOTTOM_THRESHOLD_PX = 48;

const isNearBottom = (list: HTMLElement) =>
  list.scrollHeight - list.scrollTop - list.clientHeight <=
  SCROLL_BOTTOM_THRESHOLD_PX;

interface ChatWindowProps {
  className?: string;
}

const ChatWindow = ({ className = '' }: ChatWindowProps) => {
  const { chatList, currentChatId } = useChatContext();

  const chat =
    chatList.find((chat: ChatInfo) => chat.chatId === currentChatId) ?? null;

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const chatIdRef = useRef<string | null>(null);

  const handleMessagesScroll = () => {
    const list = messagesContainerRef.current;
    if (!list || !chat) {
      return;
    }

    isNearBottomRef.current = isNearBottom(list);
  };

  // Прокрутка вниз, если отправили новое сообщение или открыли другой чат
  useLayoutEffect(() => {
    const list = messagesContainerRef.current;
    if (!list || !chat) {
      chatIdRef.current = null;
      isNearBottomRef.current = true;
      return;
    }

    const chatChanged = chatIdRef.current !== chat.chatId;
    chatIdRef.current = chat.chatId;

    const lastMessage = chat.messages[chat.messages.length - 1];

    if (chatChanged || isNearBottomRef.current || lastMessage?.isOutgoing) {
      list.scrollTop = list.scrollHeight;
      isNearBottomRef.current = true;
    }
  }, [chat, chat?.chatId, chat?.messages.length]);

  return (
    <div className={`${className} flex h-full w-full flex-col`}>
      {!chat && (
        <div className='flex flex-1 items-center justify-center text-sm'>
          <Hint>Выберите чат или создайте новый по&nbsp;номеру телефона</Hint>
        </div>
      )}

      {chat && (
        <>
          <Header className='mb-1 mx-4' />

          <div
            ref={messagesContainerRef}
            onScroll={handleMessagesScroll}
            className='custom-scrollbar flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto mx-1 px-4 py-4'
          >
            {chat.messages.length === 0 && (
              <div className='flex flex-1 items-center justify-center text-center text-sm'>
                <Hint>Сообщений пока нет</Hint>
              </div>
            )}

            {chat.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
              />
            ))}
          </div>

          <NewMessage
            key={chat.chatId}
            className='mt-1 mx-4 shrink-0'
          />
        </>
      )}
    </div>
  );
};

export default ChatWindow;
