/**
 * Сервис для получения входящих сообщений
 */

import { API_CONFIG } from '@/config/api.config';
import type { MessageInfo } from '@/types/chat.types';
import type { UserData } from '@/types/user.types';

/**
 * Таймаут ожидания уведомления
 */
const RECEIVE_TIMEOUT_SECONDS = 10;

/**
 * Информация о входящем сообщении
 */
export interface ReceivedMessage {
  chatId: string;
  username: string;
  phoneNumber: number;
  messageData: MessageInfo;
}

/**
 * Результат получения входящего сообщения
 */
export interface ReceiveNotificationResult {
  isSuccess: boolean;
  receiptId: number | null;
  data: ReceivedMessage | null;
  errorMessage: string | null;
}

/**
 * Структура ответа сервера на запрос
 */
interface ReceiveNotificationResponse {
  receiptId?: number;
  body?: {
    typeWebhook?: string;
    timestamp?: number;
    idMessage?: string;
    senderData?: {
      chatId?: string;
      senderName?: string;
      senderPhoneNumber?: number;
    };
    messageData?: {
      typeMessage?: string;
      textMessageData?: {
        textMessage?: string;
      };
    };
  };
}

/**
 * Получить входящее уведомление
 */
export const receiveNotification = async (userData: UserData): Promise<ReceiveNotificationResult> => {
  const { idInstance, apiTokenInstance } = userData;

  try {
    const resp = await fetch(
      `${API_CONFIG.BASE_URL}/waInstance${idInstance}/${API_CONFIG.METHODS.RECEIVE_NOTIFICATION}/${apiTokenInstance}?receiveTimeout=${RECEIVE_TIMEOUT_SECONDS}`,
      {
        method: 'GET',
      },
    );

    if (!resp.ok) {
      return {
        isSuccess: false,
        receiptId: null,
        data: null,
        errorMessage: 'Не удалось получить уведомление',
      };
    }

    const data: unknown = await resp.json();

    if (data === null) {
      return {
        isSuccess: true,
        receiptId: null,
        data: null,
        errorMessage: null,
      };
    }

    if (typeof data === 'object' && data !== null) {
      const receivedNotificationData = data as ReceiveNotificationResponse;
      const body = receivedNotificationData.body;
      const sender = body?.senderData;
      const text = body?.messageData?.textMessageData?.textMessage;

      // TODO: на данном этапе обрабатываются только текстовые сообщения
      // остальные типы сообщений просто удаляются из очереди
      if (
        body?.typeWebhook === 'incomingMessageReceived' &&
        body.messageData?.typeMessage === 'textMessage' &&
        sender?.chatId &&
        text &&
        body.idMessage &&
        body.timestamp
      ) {
        return {
          isSuccess: true,
          receiptId: receivedNotificationData.receiptId ?? null,
          data: {
            chatId: sender.chatId,
            username: sender.senderName || '',
            phoneNumber: Number(sender.senderPhoneNumber || 0),
            messageData: {
              id: body.idMessage,
              message: text,
              time: new Date(body.timestamp * 1000).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              isOutgoing: false,
            },
          },
          errorMessage: null,
        };
      }

      if (receivedNotificationData.receiptId) {
        return {
          isSuccess: true,
          receiptId: receivedNotificationData.receiptId,
          data: null,
          errorMessage: null,
        };
      }
    }

    return {
      isSuccess: false,
      receiptId: null,
      data: null,
      errorMessage: 'Не удалось получить уведомление',
    };
  } catch (error: unknown) {
    return {
      isSuccess: false,
      receiptId: null,
      data: null,
      errorMessage: error instanceof Error ? error.message : 'Неизвестная ошибка',
    };
  }
};