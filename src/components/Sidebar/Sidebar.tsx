/**
 * Сайдбар:
 * - поле ввода номера телефона
 * - список чатов
 * - кнопка добавления нового чата
 */
import { useRef, useState } from 'react';

import { useChatContext } from '@/context/use-chat-context';
import { useAuthContext } from '@/context/use-auth-context';
import { checkAccount } from '@/services/chat';

import Input from '@/components/UI/Input/Input';
import ChatList from './ChatList/ChatList';
import NewChatButton from './NewChatButton/NewChatButton';

const MIN_PHONE_LENGTH = 11;

//TODO: переделать в маску, номер хранить без +
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
}

const Sidebar = ({ className = '' }: SidebarProps) => {
  const { userData } = useAuthContext();

  const { addChat } = useChatContext();
  const [error, setError] = useState<string | null>(null);
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
  const [isLoading, setIsLoading] = useState(false);
  // Очистка состояния поля ввода номера телефона
  const clearInputStates = () => {
    setPhone('');
    setIsPhoneValid(true);
    setIsPhoneEntered(false);
    setError(null);
  };

  // Ввод номера телефона
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const validatedPhone = formatPhone(e.target.value);
    setPhone(validatedPhone);

    if (isPhoneEntered) {
      setIsPhoneValid(isPhoneNumberValid(validatedPhone));
    }
  };

  const checkChatAccount = async (phone: number) => {
    setIsLoading(true);
    const result = await checkAccount(phone, userData);
    if (result.isSuccess && result.data) {
      addChat(result.data);
      setIsVisiblePhoneInput(false);
      clearInputStates();
    } else {
      setError(result.errorMessage);
    }
    setIsLoading(false);
  };

  // Нажатие Enter на поле ввода номера телефона
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || isLoading) {
      return;
    }

    e.preventDefault();

    setIsPhoneEntered(true);

    const currentPhone = formatPhone(e.currentTarget.value);
    const phoneIsValid = isPhoneNumberValid(currentPhone);
    setIsPhoneValid(phoneIsValid);

    if (phoneIsValid) {
      const phoneDigits = Number(currentPhone.replace(/\D/g, ''));
      checkChatAccount(phoneDigits);
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
      <div className='flex items-center shrink-0 px-2 min-h-[56px]'>
        {isVisiblePhoneInput ? (
          <div className='flex flex-col gap-1 w-full'>
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
            <span className='text-[var(--alert)] text-sm'>{error}</span>
          </div>
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
