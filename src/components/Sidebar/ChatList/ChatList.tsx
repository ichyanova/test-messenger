import type { ChatInfo } from '@/components/Main/Main.types';
import UserAvatar from '@/components/UI/UserAvatar/UserAvatar';

interface ChatListProps {
  className?: string;
  chats: ChatInfo[];
  activeChatId: number | null;
  onSelectChat: (chatId: number) => void;
}

/**
 * Список чатов в сайдбаре
 * @param className
 * @param chats - список чатов
 * @param activeChatId - id активного чата
 * @param onSelectChat - функция выбора чата
 * @returns
 */
const ChatList = ({
  className = '',
  chats,
  activeChatId,
  onSelectChat,
}: ChatListProps) => {
  if (chats.length === 0) {
    return (
      <p className={`${className} px-4 py-6 text-center text-sm text-gray-400`}>
        Чатов пока нет
      </p>
    );
  }

  const isActiveChat = (chatId: number) => chatId === activeChatId;

  return (
    <ul className={`${className} overflow-y-auto pb-20`}>
      {chats.map((chat) => (
        <li
          key={chat.id}
          className='px-2'
        >
          <button
            type='button'
            onClick={() => onSelectChat(chat.id)}
            aria-current={isActiveChat(chat.id) ? 'true' : undefined}
            className={`flex w-full items-center gap-3 p-2 text-left rounded-2xl transition-colors cursor-pointer ${
              isActiveChat(chat.id)
                ? 'bg-[var(--blue)] text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            <UserAvatar className='w-13.5 h-13.5' />
            <span className='min-w-0 flex-1'>
              <span className='flex w-full gap-2 justify-between pb-1 items-center'>
                <span
                  className={`min-w-0 flex-1 truncate text-base font-medium ${isActiveChat(chat.id) ? 'text-white' : 'text-gray-900'}`}
                >
                  {chat.phone}
                </span>
                {chat.lastMessageTime && (
                  <span
                    className={`shrink-0 text-xs ${isActiveChat(chat.id) ? 'text-white' : 'text-gray-400'}`}
                  >
                    {chat.lastMessageTime}
                  </span>
                )}
              </span>
              <span
                className={`block truncate text-sm ${isActiveChat(chat.id) ? 'text-white' : 'text-gray-500'}`}
              >
                {chat.lastMessage || 'Нет сообщений'}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ChatList;
