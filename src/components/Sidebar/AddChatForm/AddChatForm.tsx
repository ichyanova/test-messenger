/**
 * Форма добавления нового чата
 *  – поле ввода номер телефона
 *  – валидация, проверка существования аккаунта
 *  – добавление нового чата в список
 */

import { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '@/context/use-auth-context';
import { useChatContext } from '@/context/use-chat-context';
import { checkAccount as checkAccountService } from '@/services/chat';
import Input from '@/components/UI/Input/Input';

const MIN_PHONE_LENGTH = 11;
const MAX_PHONE_LENGTH = 15;

const formatPhone = (value: string) => {
  let digits = value.replace(/\D/g, '');

  if (!digits && !value.includes('+')) {
    return '';
  }
  if (digits[0] === '8') {
    digits = `7${digits.slice(1)}`;
  }
  return `+${digits}`;
};

const isPhoneNumberValid = (value: string): boolean => {
  const digits = value.replace(/\D/g, '');
  return digits.length >= MIN_PHONE_LENGTH && digits.length <= MAX_PHONE_LENGTH;
};

interface AddChatFormProps {
  onSuccess: () => void;
}

const AddChatForm = ({ onSuccess }: AddChatFormProps) => {
  const { userData } = useAuthContext();
  const { addChat } = useChatContext();

  const [phone, setPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isPhoneEntered, setIsPhoneEntered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    phoneInputRef.current?.focus();
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const validatedPhone = formatPhone(e.target.value);
    setPhone(validatedPhone);

    if (isPhoneEntered) {
      setIsPhoneValid(isPhoneNumberValid(validatedPhone));
    }
  };

  const checkAccount = async (phone: number) => {
    setIsLoading(true);
    try {
      const result = await checkAccountService(phone, userData);
      if (result.isSuccess && result.data) {
        addChat(result.data);
        onSuccess();
      } else {
        setError(result.errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key !== 'Enter' || isLoading) {
      return;
    }

    e.preventDefault();
    setIsPhoneEntered(true);

    const currentPhone = formatPhone(e.currentTarget.value);
    const phoneIsValid = isPhoneNumberValid(currentPhone);
    setIsPhoneValid(phoneIsValid);

    if (phoneIsValid) {
      setError(null);
      const phoneDigits = Number(currentPhone.replace(/\D/g, ''));
      await checkAccount(phoneDigits);
    }
  };

  return (
    <div className='flex flex-col gap-1 w-full'>
      <Input
        className='w-full'
        ref={phoneInputRef}
        id='phone'
        placeholder='Введите номер телефона'
        type='tel'
        value={phone}
        invalid={!isPhoneValid || !!error}
        onChange={handlePhoneChange}
        onKeyDown={handlePhoneKeyDown}
        disabled={isLoading}
      />
      {error && <span className='text-[var(--alert)] text-xs'>{error}</span>}
    </div>
  );
};

export default AddChatForm;
