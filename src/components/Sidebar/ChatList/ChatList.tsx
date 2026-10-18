/**
 * Список чатов
 */

import UserAvatar from '@/components/UI/UserAvatar/UserAvatar';
import { useChatContext } from '@/context/use-chat-context';

interface ChatListProps {
  className?: string;
}

const ChatList = ({ className = '' }: ChatListProps) => {
  const { chatList, currentChatId, setCurrentChatId } = useChatContext();

  if (chatList.length === 0) {
    return (
      <p className={`${className} px-4 py-6 text-center text-sm text-gray-400`}>
        Чатов пока нет
      </p>
    );
  }

  const isActiveChat = (chatId: string) => chatId === currentChatId;

  return (
    <ul className={`${className} custom-scrollbar overflow-y-auto pb-20`}>
      {chatList.map((chat) => {
        const isActive = isActiveChat(chat.chatId);
        return (
          <li
            key={chat.chatId}
            className='px-2'
          >
            <button
              type='button'
              onClick={() => setCurrentChatId(chat.chatId)}
              aria-current={isActive ? 'true' : undefined}
              className={`flex w-full items-center gap-3 p-2 text-left rounded-2xl transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[var(--blue)] text-white'
                  : 'hover:bg-gray-100 text-gray-900'
              }`}
            >
              <UserAvatar className='w-13.5 h-13.5' />
              <span className='min-w-0 flex-1'>
                <span className='flex w-full gap-2 justify-between pb-1 items-center'>
                  <span className='min-w-0 flex-1 truncate text-base font-medium'>
                    {chat.username}
                  </span>
                  {chat.lastMessageTime && (
                    <span
                      className={`shrink-0 text-xs ${isActive ? '' : 'text-gray-400'}`}
                    >
                      {chat.lastMessageTime}
                    </span>
                  )}
                </span>
                <span
                  className={`block truncate text-sm ${isActive ? '' : 'text-gray-500'}`}
                >
                  {chat.lastMessage || 'Нет сообщений'}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default ChatList;
