import React, { useContext, useMemo } from 'react'
import { useLocalStorage, writeStorage } from '@rehooks/local-storage'
import jwt_decode from 'jwt-decode'

interface AuthContextInterface {
  jwTokenData: JwTokenData | null
  setToken: (value: string | null) => void
  token: string | null
}

const AuthContext = React.createContext<AuthContextInterface>({
  setToken: () => null,
  jwTokenData: null,
  token: null,
})

interface Props {
  children: React.ReactNode
}

function AuthProvider(props: Props) {
  const [token] = useLocalStorage<string | null>('token', null)
  const jwTokenData = useMemo<JwTokenData | null>(
    () => (token ? jwt_decode<JwTokenData>(token) : null),
    [token],
  )
  const setToken = (value: string | null) => {
    writeStorage('token', value)
  }
  return (
    <AuthContext.Provider value={{ jwTokenData, setToken, token }} {...props} />
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  return context
}

export { AuthProvider, useAuth }
