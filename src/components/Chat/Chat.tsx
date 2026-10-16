import ChatWindow from '@/components/ChatWindow/ChatWindow';
import Sidebar from '@/components/Sidebar/Sidebar';

interface ChatProps {
  className?: string;
}

/**
 * Главный компонент приложения
 * @param className
 * @returns
 */
const Chat = ({ className = '' }: ChatProps) => {
  return (
    <div className={`${className} flex h-full w-full min-h-0`}>
      <div className='flex h-full w-80 shrink-0 flex-col p-4 md:w-96'>
        <Sidebar />
      </div>
      <div className='flex h-full min-w-0 flex-1 flex-col p-4 pl-0'>
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chat;
