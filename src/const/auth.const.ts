
export const INSTANCE_STATE_TYPE = {
  AUTH: 'authorized',
  NOT_AUTH: 'notAuthorized',
  BLOCKED: 'blocked',
  SUSPENDED: 'suspended',
  STARTING: 'starting',
  PENDING_PASSWORD: 'pendingPassword',
} as const;

  export const INSTANCE_STATE_MESSAGE = {
  [INSTANCE_STATE_TYPE.AUTH]: 'Инстанс авторизован',
  [INSTANCE_STATE_TYPE.NOT_AUTH]: 'Инстанс не авторизован',
  [INSTANCE_STATE_TYPE.BLOCKED]: 'Инстанс получил блокировку',
  [INSTANCE_STATE_TYPE.SUSPENDED]: 'На инстансе действуют временные ограничения',
  [INSTANCE_STATE_TYPE.STARTING]: 'Инстанс в процессе запуска (сервисный режим).',
  [INSTANCE_STATE_TYPE.PENDING_PASSWORD]: 'Для завершения авторизации необходимо отправить пароль двухфакторной аутентификации (2fa) методом SendAuthorizationPassword',
};