/**
 * Окно активного чата
 * - отображение сообщений
 * - поле ввода и кнопка отправки сообщения
 */

import { useLayoutEffect, useRef } from 'react';

import type { ChatInfo } from '@/types/chat.types';

import UserAvatar from '@/components/UI/UserAvatar/UserAvatar';
import Hint from './Hint/Hint';
import NewMessage from './NewMessage/NewMessage';
import { useChatContext } from '@/context/use-chat-context';

const SCROLL_BOTTOM_THRESHOLD_PX = 48;

const isNearBottom = (list: HTMLElement) =>
  list.scrollHeight - list.scrollTop - list.clientHeight <=
  SCROLL_BOTTOM_THRESHOLD_PX;

interface ChatWindowProps {
  className?: string;
}

//TODO custom scrollbar
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

  // Прокрутка вниз, если лента уже у нижнего края или открыт другой чат
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
    <div className={`${className} flex h-full w-full flex-col overflow-hidden`}>
      {!chat && (
        <div className='flex flex-1 items-center justify-center text-center text-sm'>
          <Hint>Выберите чат или создайте новый по&nbsp;номеру телефона</Hint>
        </div>
      )}

      {chat && (
        <>
          <header className='flex items-center gap-3 p-1 rounded-4xl bg-white'>
            <UserAvatar className='w-10 h-10' />
            <h2 className='truncate text-base font-medium text-gray-900'>
              {chat.username}
              {chat.phoneNumber && (
                <span className='text-sm text-gray-400'>
                  {' '}
                  (+{chat.phoneNumber})
                </span>
              )}
            </h2>
          </header>

          <div
            ref={messagesContainerRef}
            onScroll={handleMessagesScroll}
            className='flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-1 py-4'
          >
            {chat.messages.length === 0 && (
              <div className='flex flex-1 items-center justify-center text-center text-sm'>
                <Hint>Сообщений пока нет</Hint>
              </div>
            )}

            {chat.messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                  message.isOutgoing
                    ? 'self-end bg-[var(--message-outgoing-bg)]'
                    : 'self-start bg-white'
                }`}
              >
                <p className='wrap-break-word whitespace-pre-wrap'>
                  {message.message}
                </p>
                <p
                  className={`mt-1 text-right text-[10px] ${
                    message.isOutgoing
                      ? 'text-[var(--message-out-time-color)]'
                      : 'text-gray-400'
                  }`}
                >
                  {message.time}
                </p>
              </div>
            ))}
          </div>

          <NewMessage
            key={chat.chatId}
            className='mt-2 shrink-0'
          />
        </>
      )}
    </div>
  );
};

export default ChatWindow;
