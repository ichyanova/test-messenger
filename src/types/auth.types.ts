import { INSTANSE_STATE_TYPE } from '@/const/auth.const';

export type InstanseStateType =
  (typeof INSTANSE_STATE_TYPE)[keyof typeof INSTANSE_STATE_TYPE];