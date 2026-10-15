import { useRef, useState } from 'react';
import Input from '@/components/UI/Input/Input';
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
}

/**
 * Сайдбар с полем ввода номера телефона
 * @param className
 * @returns
 */
const Sidebar = ({ className = '' }: SidebarProps) => {
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

  // Ввод номера телефона
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedPhone = formatPhone(e.target.value);
    setPhone(validatedPhone);

    isPhoneEntered && setIsPhoneValid(isPhoneNumberValid(validatedPhone));
  };

  // Нажатие Enter на поле ввода номера телефона
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }

    e.preventDefault();
    setIsPhoneEntered(true);
    const phoneIsValid = isPhoneNumberValid(phone);
    setIsPhoneValid(phoneIsValid);
    if (phoneIsValid) {
      // Создать новый чат
      console.log('phone', phone);
    }
  };

  // Показываем/скрываем поле ввода номера телефона
  const handlePhoneInputVisibility = () => {
    setIsVisiblePhoneInput(!isVisiblePhoneInput);
    if (!isVisiblePhoneInput) {
      setPhone('');
      setIsPhoneValid(true);
      setIsPhoneEntered(false);
    }
    setTimeout(() => {
      phoneInputRef?.current?.focus();
    }, 100);
  };

  return (
    <div
      className={`${className} relative bg-white rounded-2xl p-4 h-full w-full`}
    >
      <NewChatButton
        className='absolute bottom-4 right-4'
        onClick={handlePhoneInputVisibility}
        isPencilIconVisibility={!isVisiblePhoneInput}
      />
      {isVisiblePhoneInput && (
        <Input
          ref={phoneInputRef}
          id='phone'
          placeholder='Введите номер телефона'
          label='Номер телефона'
          type='tel'
          value={phone}
          invalid={!isPhoneValid}
          onChange={handlePhoneChange}
          onKeyDown={handlePhoneKeyDown}
        />
      )}
    </div>
  );
};

export default Sidebar;
