import React, { lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from '@components/PrivateRoute'

const Home = lazy(() => import('../Home/Home'))
const RepoContent = lazy(() => import('../RepoContent/RepoContent'))

function Router() {
  return (
    <Suspense fallback={<p>Chargement de la page...</p>}>
      <Switch>
        <Route path="/" exact component={Home} />
        <PrivateRoute path="/repo/:id" exact component={RepoContent} />
      </Switch>
    </Suspense>
  )
}

export default Router
