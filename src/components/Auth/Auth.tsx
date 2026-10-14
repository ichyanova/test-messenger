import React, { useState } from 'react';

import { API_CONFIG } from '../../config/api.config';

import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import {
  INSTANSE_STATE_TYPE,
  INSTANSE_STATE_MESSAGE,
  type InstanseStateType,
} from './Auth.const';

interface AuthProps {
  onLogin: (idInstance: string, apiTokenInstance: string) => void;
}

function isInstanseState(value: unknown): value is InstanseStateType {
  return (
    typeof value === 'string' &&
    Object.values(INSTANSE_STATE_TYPE).includes(value as InstanseStateType)
  );
}

/**
 * Авторизация через данные из личного кабинета Green API (idInstance и apiTokenInstance)
 * Проверка валидности ключей методом getStateInstance
 */
export default function Auth({ onLogin }: AuthProps) {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!idInstance || !apiTokenInstance) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Проверяем валидность ключей методом getStateInstance
      const url = `${API_CONFIG.BASE_URL}/waInstance${idInstance}/${API_CONFIG.METHODS.GET_STATE}/${apiTokenInstance}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Неверный ID инстанса или API токен');
      }

      const data: unknown = await response.json();
      const stateInstance =
        data && typeof data === 'object' && 'stateInstance' in data
          ? data.stateInstance
          : undefined;

      // Если инстанс авторизован
      if (stateInstance === INSTANSE_STATE_TYPE.AUTH) {
        // Вызываем onLogin для сохранения данных авторизации
        onLogin(idInstance, apiTokenInstance);
      } else if (isInstanseState(stateInstance)) {
        setError(
          `${INSTANSE_STATE_MESSAGE[stateInstance]}. Проверьте личный кабинет GREEN-API.`,
        );
      } else {
        setError(
          'Неизвестный статус инстанса. Проверьте личный кабинет GREEN-API.',
        );
      }
    } catch (err: any) {
      setError(
        err.message || 'Ошибка подключения. Проверьте введенные данные.',
      );
    } finally {
      setIsLoading(false);
    }
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
