import React, { lazy, Suspense } from 'react'
import AuthApp from '@containers/Layout/AuthApp'
import { useAuth } from '@contexts/AuthContext'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { RepositoryProvider } from './contexts/RepositoryContext'

const GithubRedirect = lazy(() => import('./containers/GithubRedirect'))
const Home = lazy(() => import('./containers/Home'))

function App() {
  const { token } = useAuth()

  return (
    <Suspense fallback={<></>}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/redirect" component={GithubRedirect} />
          <Route
            path="/"
            render={() => {
              if (token) {
                return (
                  <RepositoryProvider>
                    <AuthApp />
                  </RepositoryProvider>
                )
              }

              return <Home />
            }}
          />
        </Switch>
      </BrowserRouter>
    </Suspense>
  )
}

export default App
