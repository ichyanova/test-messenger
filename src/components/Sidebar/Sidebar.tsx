/**
 * Сайдбар:
 * - поле ввода номера телефона
 * - список чатов
 * - кнопка добавления нового чата
 */
import { useState } from 'react';

import ChatList from './ChatList/ChatList';
import NewChatButton from './NewChatButton/NewChatButton';
import AddChatForm from './AddChatForm/AddChatForm';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = '' }: SidebarProps) => {
  const [isVisiblePhoneInput, setIsVisiblePhoneInput] = useState(false);

  const handlePhoneInputVisibility = () => {
    setIsVisiblePhoneInput((prev) => !prev);
  };

  const handleAddChatSuccess = () => {
    setIsVisiblePhoneInput(false);
  };

  return (
    <div
      className={`${className} relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white`}
    >
      <div className='flex items-center shrink-0 px-2 min-h-[56px]'>
        {isVisiblePhoneInput ? (
          <AddChatForm onSuccess={handleAddChatSuccess} />
        ) : (
          <h2 className='text-lg font-medium text-gray-900 px-2'>Чаты</h2>
        )}
      </div>

      <ChatList className='min-h-0 flex-1 pt-4' />

      <NewChatButton
        className='absolute bottom-4 right-4'
        onClick={handlePhoneInputVisibility}
        isPencilIconVisibility={!isVisiblePhoneInput}
      />
    </div>
  );
};

export default Sidebar;
