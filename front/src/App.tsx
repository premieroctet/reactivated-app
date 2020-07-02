import AuthApp from '@containers/Layout/AuthApp'
import { useAuth } from '@contexts/AuthContext'
import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

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
                return <AuthApp />
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
