/**
 * Сервис для отправки сообщений
 */
import { API_CONFIG } from '@/config/api.config';
import type { UserData } from '@/types/auth.types';

/**
 * Результат отправки сообщения
 */
export interface SendMessageResult {
  isSuccess: boolean;
  idMessage: string | null;
  errorMessage: string | null;
}

/**
 * Структура ответа от сервера
 */
interface SendMessageResponse {
  idMessage: string | number;
}

/**
 * Отправка сообщения
 */
export const sendMessage = async (chatId: string, message: string, userData: UserData): Promise<SendMessageResult> => {
  const { idInstance, apiTokenInstance } = userData;
  const bodyData = {
    chatId,
    message,
  };
  try {
      const resp = await fetch(
        `${API_CONFIG.BASE_URL}/waInstance${idInstance}/${API_CONFIG.METHODS.SEND_MESSAGE}/${apiTokenInstance}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyData),
        },
      );

      if (!resp.ok) {
        return {
          isSuccess: false,
          idMessage: null,
          errorMessage: 'Не удалось отправить сообщение',
        };
      }

      const data: unknown = await resp.json();

      if (typeof data === 'object' && data !== null) {
        const recordData = data as SendMessageResponse;
        if (recordData.idMessage) {
          return {
            isSuccess: true,
            idMessage: String(recordData.idMessage),
            errorMessage: null,
          };
        }
      }

      return {
        isSuccess: false,
        idMessage: null,
        errorMessage: 'Не удалось отправить сообщение',
      };
    } catch (error: unknown) {
      return {
        isSuccess: false,
        idMessage: null,
        errorMessage: error instanceof Error ? error.message : 'Неизвестная ошибка',
      };
  }
};
