import React, { useEffect } from 'react'
import { useLocation, Redirect } from 'react-router'
import { useAuth } from '@contexts/AuthContext'
import AuthAPI from '@api/auth'
import qs from 'query-string'
import Home from '@containers/Home'

const GithubRedirect = () => {
  const { token, setToken } = useAuth()

  const { search } = useLocation()

  const authUser = async (code: string) => {
    const { data } = await AuthAPI.getGithubCallback(code)
    setToken(data.token)
  }

  useEffect(() => {
    if (!token) {
      const parsed = qs.parse(search)
      authUser(parsed.code as string)
    } else {
      if (window.opener) {
        window.opener.postMessage('installation-made')
        window.close()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!token) {
    return <Home loading />
  }

  if (window.opener) {
    return null
  }

  return <Redirect to="/" />
}

export default GithubRedirect
