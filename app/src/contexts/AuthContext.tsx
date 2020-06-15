import jwt_decode from 'jwt-decode';
import React, { useContext, useMemo } from 'react';
import { getData, storeData } from '../utils/AsyncStorage';

interface AuthContextInterface {
  jwTokenData: JwTokenData | null;
  token: string | null;
  getCurrentToken: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextInterface>({
  jwTokenData: null,
  token: null,
  getCurrentToken: async () => {},
});

interface Props {
  children: React.ReactNode;
}

function AuthProvider(props: Props) {
  const [token, setToken] = React.useState('');
  const getCurrentToken = async () => {
    setToken((await getData('token')) || '');
  };
  const jwTokenData = useMemo<JwTokenData | null>(() => (token ? jwt_decode<JwTokenData>(token) : null), [token]);

  return <AuthContext.Provider value={{ jwTokenData, getCurrentToken, token }} {...props} />;
}

function useAuthContext() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuthContext };
