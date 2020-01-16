import React, { useEffect } from 'react'
import { useLocation, Redirect } from 'react-router'
import { useAuth } from '@contexts/AuthContext'
import AuthAPI from '@api/auth'
import qs from 'query-string'
import Login from '@components/Login'

const GithubRedirect = () => {
  const { token, setToken } = useAuth()
  const { search } = useLocation()

  console.log('token', token)

  const authUser = async (code: string) => {
    const { data } = await AuthAPI.getGithubCallback(code)
    setToken(data.token)
  }

  useEffect(() => {
    if (!token) {
      const parsed = qs.parse(search)
      authUser(parsed.code as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!token) {
    return <Login loading />
  }

  return <Redirect to="/" />
}

export default GithubRedirect
