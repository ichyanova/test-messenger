/**
 * Сетевой слой для работы с авторизацией
 */
import { API_CONFIG } from '@/config/api.config';
import { type InstanceStateType } from '@/types/auth.types';
import { INSTANCE_STATE_TYPE, INSTANCE_STATE_MESSAGE } from '@/const/auth.const';

export interface AuthResult {
  isSuccess: boolean;
  errorMessage: string | null;
}

/**
 * Проверка типа состояния инстанса
 */
function isInstanceState(value: unknown): value is InstanceStateType {
  return (
    typeof value === 'string' &&
    Object.values(INSTANCE_STATE_TYPE).includes(value as InstanceStateType)
  );
}

/**
 * Структура ответа сервера
 */
interface GetStateInstanceResponse {
  stateInstance?: string;
}

export const auth = async (
    idInstance: string,
    apiTokenInstance: string,
  ): Promise<AuthResult> => {
    if (!idInstance || !apiTokenInstance) {
      return { isSuccess: false, errorMessage: 'Пожалуйста, заполните все поля' };
    }

    try {
      const url = `${API_CONFIG.BASE_URL}/waInstance${idInstance}/${API_CONFIG.METHODS.GET_STATE}/${apiTokenInstance}`;
      const response = await fetch(url);

      if (!response.ok) {
        return {
          isSuccess: false,
          errorMessage: 'Неверный ID инстанса или API токен',
        };
      }

      const data: unknown = await response.json();

      let stateInstance: unknown = undefined;
      if (typeof data === 'object' && data !== null) {
        stateInstance = (data as GetStateInstanceResponse).stateInstance;
      }

      if (stateInstance === INSTANCE_STATE_TYPE.AUTH) {
        return { isSuccess: true, errorMessage: null };
      }

      if (isInstanceState(stateInstance)) {
        return {
          isSuccess: false,
          errorMessage: `${INSTANCE_STATE_MESSAGE[stateInstance]}. Проверьте личный кабинет GREEN-API.`,
        };
      }

      return {
        isSuccess: false,
        errorMessage:
          'Неизвестный статус инстанса. Проверьте личный кабинет GREEN-API.',
      };
    } catch (error: unknown) {
      if (error instanceof Error && error.message) {
        return { isSuccess: false, errorMessage: error.message };
      }

      return {
        isSuccess: false,
        errorMessage: 'Ошибка подключения. Проверьте введенные данные.',
      };
    }
  };
