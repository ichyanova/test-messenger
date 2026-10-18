/**
 * Удалить уведомление из очереди
  */

import type { UserData } from "@/types/auth.types";
import { API_CONFIG } from "@/config/api.config";

export const deleteNotification = async (receiptId: number, userData: UserData): Promise<void> => {
  const { idInstance, apiTokenInstance } = userData;

  try {
    const resp = await fetch(
      `${API_CONFIG.BASE_URL}/waInstance${idInstance}/${API_CONFIG.METHODS.DELETE_NOTIFICATION}/${apiTokenInstance}/${receiptId}`,
      {
        method: 'DELETE',
      },
    );

    if (!resp.ok) {
      console.error('Не удалось удалить уведомление');
    }
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : 'Неизвестная ошибка');
  }
};