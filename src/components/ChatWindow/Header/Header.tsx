/**
 * Заголовок окна чата
 */
import { ArrowLeftIcon } from 'lucide-react';

import type { ChatInfo } from '@/types/chat.types';
import { useChatContext } from '@/context/use-chat-context';

import UserAvatar from '@/components/UI/UserAvatar/UserAvatar';

interface HeaderProps {
  className?: string;
}

const Header = ({ className = '' }: HeaderProps) => {
  const { chatList, currentChatId, setCurrentChatId } = useChatContext();

  const chat =
    chatList.find((chat: ChatInfo) => chat.chatId === currentChatId) ?? null;

  if (!chat) {
    return null;
  }

  return (
    <header
      className={`flex items-center gap-3 p-1 rounded-4xl bg-white ${className}`}
    >
      <button
        type='button'
        className='p-1 sm:hidden'
        onClick={() => {
          setCurrentChatId(null);
        }}
      >
        <ArrowLeftIcon className='w-6 h-6' />
      </button>
      <UserAvatar className='w-10 h-10' />
      <h2 className='truncate text-base font-medium text-gray-900'>
        {chat.username}
        {chat.phoneNumber ? (
          <span className='text-sm text-gray-400'> (+{chat.phoneNumber})</span>
        ) : (
          ''
        )}
      </h2>
    </header>
  );
};

export default Header;
