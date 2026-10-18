import { INSTANCE_STATE_TYPE } from '@/const/auth.const';

export type InstanceStateType =
  (typeof INSTANCE_STATE_TYPE)[keyof typeof INSTANCE_STATE_TYPE];

export interface UserData {
  idInstance: string;
  apiTokenInstance: string;
}