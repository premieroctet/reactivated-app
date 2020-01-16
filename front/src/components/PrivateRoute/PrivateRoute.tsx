import React from 'react'
import { RouteProps, Route, Redirect } from 'react-router'
import { useAuth } from '@contexts/AuthContext'

interface Props extends RouteProps {}

const PrivateRoute = (props: Props) => {
  const { token } = useAuth()

  if (token) {
    return <Route {...props} />
  }

  return <Redirect to="/" />
}

export default PrivateRoute
