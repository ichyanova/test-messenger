
import { API_CONFIG } from '@/config/api.config';
import type { ShortChatInfo } from '@/types/chat.types';
import type { UserData } from '@/types/user.types';

/**
 * Результат запроса
 */
export interface CheckAccountResult {
  isSuccess: boolean;
  data: ShortChatInfo | null;
  errorMessage: string | null;
}

/**
 * Структура ответа от сервера
 */
interface CheckAccountResponse {
  exist: boolean;
  chatId?: string;
  username?: string;
  phoneNumber?: string | number;
}

/**
 * Проверить наличие аккаунта в Telegram
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
        const recordData = data as CheckAccountResponse;
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
