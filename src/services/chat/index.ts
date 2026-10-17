/**
 * Сервисы для взаимодействия с API Green API
 */
export {
  sendMessage,
  type SendMessageResult
} from './sendMessage';
export {
  receiveNotification,
  type ReceivedMessage,
} from './receiveNotification';
export { deleteNotification } from './deleteNotification';
export {
  checkAccount,
  type CheckAccountResult
} from './checkAccount';
