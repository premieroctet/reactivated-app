import jwt_decode from 'jwt-decode';
import React, { useContext, useMemo } from 'react';
import { getData, storeData } from '../utils/AsyncStorage';

interface AuthContextInterface {
  jwTokenData: JwTokenData | null;
  token: string | null;
  getToken: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextInterface>({
  jwTokenData: null,
  token: null,
  getToken: async () => {},
});

interface Props {
  children: React.ReactNode;
}

function AuthProvider(props: Props) {
  const [token, setToken] = React.useState('');
  const getToken = async () => {
    setToken((await getData('token')) || '');
  };
  const jwTokenData = useMemo<JwTokenData | null>(() => (token ? jwt_decode<JwTokenData>(token) : null), [token]);

  return <AuthContext.Provider value={{ jwTokenData, getToken, token }} {...props} />;
}

function useAuthContext() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuthContext };
