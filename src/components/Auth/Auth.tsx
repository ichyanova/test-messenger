/**
 * Авторизация через данные из личного кабинета Green API (idInstance и apiTokenInstance)
 * Проверка валидности ключей методом getStateInstance
 */

import React, { useState } from 'react';

import { useAuthContext } from '@/context/use-auth-context';
import Input from '@/components/UI/Input/Input';
import Button from '@/components/UI/Button/Button';

export default function Auth() {
  const { auth } = useAuthContext();
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { isSuccess, errorMessage } = await auth(
      idInstance,
      apiTokenInstance,
    );
    if (!isSuccess) {
      setError(errorMessage);
    }
    setIsLoading(false);
  };

  return (
    <div className='flex basis-full items-center justify-center min-h-screen p-4'>
      <div className='w-full max-w-md bg-white rounded-3xl p-8 flex flex-col items-center'>
        <h2 className='text-lg text-center mb-6'>
          Введите ваши данные из&nbsp;системы{' '}
          <span className='text-nowrap'>GREEN-API</span>, чтобы начать
          тестирование чата
        </h2>

        <form
          noValidate
          onSubmit={handleSubmit}
          className='w-full space-y-4'
        >
          {/* Поле idInstance */}
          <Input
            id='idInstance'
            label='idInstance'
            placeholder='ID'
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value.trim())}
            disabled={isLoading}
            required
          />

          {/* Поле apiTokenInstance */}
          <Input
            id='apiTokenInstance'
            label='apiTokenInstance'
            placeholder='API токен'
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value.trim())}
            disabled={isLoading}
            required
          />

          {/* Сообщение об ошибке */}
          {error && (
            <div className='bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 text-center'>
              {error}
            </div>
          )}

          {/* Кнопка отправки */}
          <Button
            type='submit'
            disabled={isLoading}
            isLoading={isLoading}
          >
            Авторизоваться
          </Button>
        </form>
      </div>
    </div>
  );
}
