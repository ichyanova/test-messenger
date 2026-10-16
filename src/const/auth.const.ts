
export const INSTANSE_STATE_TYPE = {
  AUTH: 'authorized',
  NOT_AUTH: 'notAuthorized',
  BLOCKED: 'blocked',
  SUSPENDED: 'suspended',
  STARTING: 'starting',
  PENDING_PASSWORD: 'pendingPassword',
} as const;

  export const INSTANSE_STATE_MESSAGE = {
  [INSTANSE_STATE_TYPE.AUTH]: 'Инстанс авторизован',
  [INSTANSE_STATE_TYPE.NOT_AUTH]: 'Инстанс не авторизован',
  [INSTANSE_STATE_TYPE.BLOCKED]: 'Инстанс получил блокировку',
  [INSTANSE_STATE_TYPE.SUSPENDED]: 'На инстансе действуют временные ограничения',
  [INSTANSE_STATE_TYPE.STARTING]: 'Инстанс в процессе запуска (сервисный режим).',
  [INSTANSE_STATE_TYPE.PENDING_PASSWORD]: 'Для завершения авторизации необходимо отправить пароль двухфакторной аутентификации (2fa) методом SendAuthorizationPassword',
};