import React, { lazy, Suspense } from 'react'
import Template from '@containers/Template'
import { useAuth } from '@contexts/AuthContext'
import { BrowserRouter, Route } from 'react-router-dom'

const GithubRedirect = lazy(() =>
  import('./containers/GithubRedirect/GithubRedirect'),
)
const Login = lazy(() => import('./containers/Login/Login'))

function App() {
  const { token } = useAuth()
  return (
    <Suspense fallback={<p>Chargement de la page...</p>}>
      <BrowserRouter>
        <Route exact path="/redirect" component={GithubRedirect} />
        <Route
          path="/"
          render={() => {
            if (token) {
              return <Template />
            }

            return <Login />
          }}
        />
      </BrowserRouter>
    </Suspense>
  )
}

export default App
