/**
 * Контейнер для отображения чата
 */

import ChatWindow from '@/components/ChatWindow/ChatWindow';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useChatContext } from '@/context/use-chat-context';

interface ChatProps {
  className?: string;
}

// TODO добавить анимацию скрытия/показа сайдбара на мобильных устройствах
const Chat = ({ className = '' }: ChatProps) => {
  const { currentChatId } = useChatContext();

  return (
    <div className={`${className} flex h-full w-full min-h-0`}>
      <div
        className={`h-full w-full shrink-0 flex-col sm:p-4 sm:pr-0 sm:w-96 ${currentChatId ? 'hidden sm:flex' : 'flex'}`}
      >
        <Sidebar />
      </div>
      <div
        className={`h-full min-w-0 flex-1 flex-col py-4 ${currentChatId ? 'flex' : 'hidden sm:flex'}`}
      >
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chat;
