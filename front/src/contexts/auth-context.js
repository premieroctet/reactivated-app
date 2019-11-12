import React, { useContext } from "react";
import { writeStorage, useLocalStorage } from "@rehooks/local-storage";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [token] = useLocalStorage("token", null);
  const setToken = value => {
    writeStorage("token", value);
  };
  return <AuthContext.Provider value={{ token, setToken }} {...props} />;
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
