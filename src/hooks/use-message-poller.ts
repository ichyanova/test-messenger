/**
 * Хук для получения входящих сообщений
 */
import { useEffect } from 'react';

import type { UserData } from '@/types/auth.types';
import {
  receiveNotification as receiveNotificationService,
  deleteNotification as deleteNotificationService,
  type ReceivedMessage,
} from '@/services/chat';

interface UseMessagePollerProps {
  userData: UserData;
  onMessageReceived: (data: ReceivedMessage) => void;
}

export const useMessagePoller = ({ userData, onMessageReceived }: UseMessagePollerProps) => {
  useEffect(() => {
    if (!userData.idInstance || !userData.apiTokenInstance) return;

    let isStopped = false;

    const abortController = new AbortController();

    const poll = async () => {
      while (!isStopped) {
        try {
          const result = await receiveNotificationService(userData, abortController.signal);

          if (isStopped) {
            return;
          }

          if (!result.isSuccess) {
            console.error(result.errorMessage);
            await new Promise((resolve) => setTimeout(resolve, 5000));
            continue;
          }

          if (result.data) {
            onMessageReceived(result.data);
          }

          if (result.receiptId) {
            await deleteNotificationService(result.receiptId, userData);
          }
        } catch (error: any) {
          if (error instanceof Error && error.name === 'AbortError') {
            return;
          }
          console.error('Критическая ошибка в useMessagePoller:', error);
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
    };

    poll();

    return () => {
      isStopped = true;
      abortController.abort();
    };
  }, [userData, onMessageReceived]);
};
