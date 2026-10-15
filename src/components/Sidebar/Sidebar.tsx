import { useRef, useState } from 'react';
import Input from '@/components/UI/Input/Input';
import type { ChatInfo } from '@/components/Main/Main.types';
import ChatList from './ChatList/ChatList';
import NewChatButton from './NewChatButton/NewChatButton';

const MIN_PHONE_LENGTH = 11;

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return !digits && !value.includes('+') ? '' : digits ? `+${digits}` : '+';
};

const isPhoneNumberValid = (value: string): boolean => {
  const digits = value.replace(/\D/g, '');
  return digits.length >= MIN_PHONE_LENGTH;
};

interface SidebarProps {
  className?: string;
  chats: ChatInfo[];
  activeChatId: number | null;
  onCreateChat: (phone: string) => void;
  onSelectChat: (chatId: number) => void;
}

/**
 * Сайдбар с полем ввода номера телефона
 * @param className
 * @returns
 */
const Sidebar = ({
  className = '',
  chats,
  activeChatId,
  onCreateChat,
  onSelectChat,
}: SidebarProps) => {
  // Флаг показа/скрытия поля ввода номера телефона
  const [isVisiblePhoneInput, setIsVisiblePhoneInput] = useState(false);
  // Значение номера телефона
  const [phone, setPhone] = useState('');
  // Флаг валидности номера телефона
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  // Ссылка на поле ввода номера телефона
  const phoneInputRef = useRef<HTMLInputElement>(null);
  // Флаг нажатия Enter на поле ввода номера телефона
  const [isPhoneEntered, setIsPhoneEntered] = useState(false);
  // Функция очистки состояния поля ввода номера телефона
  const clearInputStates = () => {
    setPhone('');
    setIsPhoneValid(true);
    setIsPhoneEntered(false);
  };

  // Ввод номера телефона
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedPhone = formatPhone(e.target.value);
    setPhone(validatedPhone);

    if (isPhoneEntered) {
      setIsPhoneValid(isPhoneNumberValid(validatedPhone));
    }
  };

  // Нажатие Enter на поле ввода номера телефона
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }

    e.preventDefault();
    const currentPhone = formatPhone(e.currentTarget.value);
    setIsPhoneEntered(true);
    const phoneIsValid = isPhoneNumberValid(currentPhone);
    setIsPhoneValid(phoneIsValid);
    if (phoneIsValid) {
      onCreateChat(currentPhone);
      setIsVisiblePhoneInput(false);
      clearInputStates();
    }
  };

  // Показываем/скрываем поле ввода номера телефона
  const handlePhoneInputVisibility = () => {
    setIsVisiblePhoneInput(!isVisiblePhoneInput);
    if (!isVisiblePhoneInput) {
      clearInputStates();
    }
    setTimeout(() => {
      phoneInputRef?.current?.focus();
    }, 100);
  };

  return (
    <div
      className={`${className} relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white`}
    >
      <div className='flex items-center shrink-0 px-2 h-[56px]'>
        {isVisiblePhoneInput ? (
          <Input
            className='w-full'
            ref={phoneInputRef}
            id='phone'
            placeholder='Введите номер телефона'
            type='tel'
            value={phone}
            invalid={!isPhoneValid}
            onChange={handlePhoneChange}
            onKeyDown={handlePhoneKeyDown}
          />
        ) : (
          <h2 className='text-lg font-medium text-gray-900 px-2'>Чаты</h2>
        )}
      </div>

      <ChatList
        className='min-h-0 flex-1 pt-4'
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={onSelectChat}
      />

      <NewChatButton
        className='absolute bottom-4 right-4'
        onClick={handlePhoneInputVisibility}
        isPencilIconVisibility={!isVisiblePhoneInput}
      />
    </div>
  );
};

export default Sidebar;
