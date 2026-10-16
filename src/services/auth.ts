/**
 * Сетевой слой для работы с авторизацией
 */
import { API_CONFIG } from '@/config/api.config';
import { type InstanseStateType } from '@/types/auth.types';
import { INSTANSE_STATE_TYPE, INSTANSE_STATE_MESSAGE } from '@/const/auth.const';

export interface AuthResult {
  isSuccess: boolean;
  errorMessage: string | null;
}

function isInstanseState(value: unknown): value is InstanseStateType {
  return (
    typeof value === 'string' &&
    Object.values(INSTANSE_STATE_TYPE).includes(value as InstanseStateType)
  );
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
      const stateInstance =
        data && typeof data === 'object' && 'stateInstance' in data
          ? data.stateInstance
          : undefined;

      if (stateInstance === INSTANSE_STATE_TYPE.AUTH) {
        return { isSuccess: true, errorMessage: null };
      }

      if (isInstanseState(stateInstance)) {
        return {
          isSuccess: false,
          errorMessage: `${INSTANSE_STATE_MESSAGE[stateInstance]}. Проверьте личный кабинет GREEN-API.`,
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
