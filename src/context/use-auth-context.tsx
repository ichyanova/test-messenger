/**
 * Контекст для работы с авторизацией
 */
import { createContext, useContext, useState } from 'react';

import { auth as authService, type AuthResult } from '@/services/auth';
import { type UserData } from '@/types/user.types';

export interface AuthContextProps {
  userData: UserData;
  isAuth: boolean;
  auth: (idInstance: string, apiTokenInstance: string) => Promise<AuthResult>;
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [userData, setUserData] = useState<UserData>({
    idInstance: '',
    apiTokenInstance: '',
  });
  const isAuth = Boolean(userData.idInstance && userData.apiTokenInstance);

  const auth = async (
    idInstance: string,
    apiTokenInstance: string,
  ): Promise<AuthResult> => {
    const result = await authService(idInstance, apiTokenInstance);

    if (result.isSuccess) {
      setUserData({ idInstance, apiTokenInstance });
    }

    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        isAuth,
        auth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAuthContext must be used within an AuthContextProvider',
    );
  }
  return context;
};
