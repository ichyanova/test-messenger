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
import './ChatWindow.css';

const SCROLL_BOTTOM_THRESHOLD_PX = 48;
const NEW_MESSAGE_GAP_PX = 16;

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
  const newMessageBlockRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const chatIdRef = useRef<string | null>(null);

  const handleMessagesScroll = () => {
    const list = messagesContainerRef.current;
    if (!list || !chat) {
      return;
    }

    isNearBottomRef.current = isNearBottom(list);
  };

  // Прокрутка вниз, если отправили новое сообщение или открыли другой чат.
  // Спейсер в конце списка равен перекрытию поля ввода: последнее сообщение остаётся над ним.
  useLayoutEffect(() => {
    const list = messagesContainerRef.current;
    const newMessageBlock = newMessageBlockRef.current;
    const spacer = spacerRef.current;

    if (!list || !newMessageBlock || !spacer || !chat) {
      chatIdRef.current = null;
      isNearBottomRef.current = true;
      return;
    }

    const pinMessagesToBottom = (shouldPin: boolean) => {
      const listBottom = list.getBoundingClientRect().bottom;
      const newMessageBlockTop = newMessageBlock.getBoundingClientRect().top;
      const inset = Math.ceil(
        Math.max(0, listBottom - newMessageBlockTop) + NEW_MESSAGE_GAP_PX,
      );
      const nextHeight = `${inset}px`;

      if (spacer.style.height !== nextHeight) {
        spacer.style.height = nextHeight;
      }

      if (shouldPin) {
        list.scrollTop = list.scrollHeight;
        isNearBottomRef.current = true;
      }
    };

    const chatChanged = chatIdRef.current !== chat.chatId;
    chatIdRef.current = chat.chatId;
    const lastMessage = chat.messages[chat.messages.length - 1];

    pinMessagesToBottom(
      chatChanged ||
        isNearBottomRef.current ||
        Boolean(lastMessage?.isOutgoing),
    );

    const observer = new ResizeObserver(() => {
      pinMessagesToBottom(isNearBottomRef.current);
    });
    observer.observe(newMessageBlock);

    return () => observer.disconnect();
  }, [chat, chat?.chatId, chat?.messages.length]);

  return (
    <div
      className={`${className} flex h-full w-full mx-auto flex-col relative chat-window`}
    >
      {!chat && (
        <div className='flex flex-1 items-center justify-center text-sm'>
          <Hint>Выберите чат или создайте новый по&nbsp;номеру телефона</Hint>
        </div>
      )}

      {chat && (
        <>
          <Header className='absolute top-4 left-0 right-0 z-10 shadow-[0_1px_8px_1px_rgba(0,0,0,0.12)] max-w-[var(--chat-width)] mx-auto' />
          <div
            className={`flex flex-col h-full ${chat.messages.length > 0 ? 'justify-end' : 'justify-center'}`}
          >
            <div
              ref={messagesContainerRef}
              onScroll={handleMessagesScroll}
              className='custom-scrollbar min-h-0 flex overflow-y-auto chat-list'
            >
              <div className='flex flex-1 flex-col gap-1 pt-24 max-w-[var(--chat-list-width)] mx-auto'>
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

                <div
                  ref={spacerRef}
                  aria-hidden
                  className='shrink-0'
                />
              </div>
            </div>
          </div>

          <div
            ref={newMessageBlockRef}
            className='absolute bottom-4 left-0 right-0 z-10 max-w-[var(--chat-width)] mx-auto'
          >
            <NewMessage
              key={chat.chatId}
              className='shadow-[0_1px_8px_1px_rgba(0,0,0,0.12)]'
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
