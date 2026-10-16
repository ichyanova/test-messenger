/**
 * Сетевой слой для работы с чатами
 */
import { API_CONFIG } from '@/config/api.config';
import type { ShortChatInfo } from '@/types/chat.types';
import type { UserData } from '@/types/user.types';

export interface CheckAccountResult {
  isSuccess: boolean;
  data: ShortChatInfo | null;
  errorMessage: string | null;
}

/**
 * Проверить наличие аккаунта в Telegram
 * @param phone - номер телефона
 * @param userData - данные пользователя
 * @returns результат проверки аккаунта
 */
export const checkAccount = async (phone: number, userData: UserData): Promise<CheckAccountResult> => {
    const { idInstance, apiTokenInstance } = userData;
    const bodyData = {
      phoneNumber: phone,
    };
    try {
      const resp = await fetch(
        `${API_CONFIG.BASE_URL}/waInstance${idInstance}/${API_CONFIG.METHODS.CHECK_ACCOUNT}/${apiTokenInstance}`,
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
          data: null,
          errorMessage: 'Не удалось проверить аккаунт',
        };
      }

      const data: unknown = await resp.json();

      if (typeof data === 'object' && data !== null) {
        const recordData = data as Record<string, string | number>;
        if (recordData.exist && recordData.chatId) {
          return {
            isSuccess: true,
            data: {
              chatId: String(recordData.chatId),
              username: String(recordData.username || ''),
              phoneNumber: Number(recordData.phoneNumber || phone),
            },
            errorMessage: null,
          };
        }
      }

      return {
        isSuccess: false,
        data: null,
        errorMessage: 'Аккаунт не найден',
      };
    } catch (error: unknown) {
      return {
        isSuccess: false,
        data: null,
        errorMessage: error instanceof Error ? error.message : 'Неизвестная ошибка',
      };
    }
};

export interface SendMessageResult {
  isSuccess: boolean;
  idMessage: string | null;
  errorMessage: string | null;
}

/**
 * Отправить сообщение в Telegram
 * @param chatId - chatId чата
 * @param message - сообщение
 * @param userData - данные пользователя
 * @returns результат отправки сообщения
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
        const recordData = data as Record<string, string | number>;
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