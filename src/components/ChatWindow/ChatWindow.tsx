import type { ChatInfo } from '@/components/Main/Main.types';
import UserAvatar from '@/components/UI/UserAvatar/UserAvatar';
import Hint from './Hint/Hint';

interface ChatWindowProps {
  className?: string;
  chat: ChatInfo | null;
}

/**
 * Правое окно открытого чата
 * @param className
 * @param chat - Данные чата
 * @returns
 */
const ChatWindow = ({ className = '', chat }: ChatWindowProps) => {
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
              {chat.phone}
            </h2>
          </header>

          <div className='flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 py-4'>
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
                    ? 'self-end bg-[var(--light-blue)] text-gray-900'
                    : 'self-start bg-gray-100 text-gray-900'
                }`}
              >
                <p>{message.message}</p>
                <p className='mt-1 text-right text-[10px] text-gray-500'>
                  {message.time}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
