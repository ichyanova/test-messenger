
export const INSTANSE_STATE_TYPE = {
  AUTH: 'authorized',
  NOT_AUTH: 'notAuthorized',
  BLOCKED: 'blocked',
  SUSPENDED: 'suspended',
  STARTING: 'starting',
  PENDING_PASSWORD: 'pendingPassword',
} as const;

export type InstanseStateType =
  (typeof INSTANSE_STATE_TYPE)[keyof typeof INSTANSE_STATE_TYPE];

export const INSTANSE_STATE_MESSAGE: Record<InstanseStateType, string> = {
  authorized: 'Инстанс авторизован',
  notAuthorized: 'Инстанс не авторизован',
  blocked: 'Инстанс получил блокировку',
  suspended: 'На инстансе действуют временные ограничения',
  starting: 'Инстанс в процессе запуска (сервисный режим).',
  pendingPassword:
    'Для завершения авторизации необходимо отправить пароль двухфакторной аутентификации (2fa) методом SendAuthorizationPassword',
};