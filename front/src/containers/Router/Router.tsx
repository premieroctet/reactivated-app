import React, { lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from '@components/PrivateRoute'

const Home = lazy(() => import('../Home/Home'))
const RepoContent = lazy(() => import('../RepoContent/RepoContent'))
const AddRepository = lazy(() => import('../AddRepository/AddRepository'))

function Router() {
  return (
    <Suspense fallback={<p>Chargement de la page...</p>}>
      <Switch>
        <Route path="/" exact component={Home} />
        <PrivateRoute path="/repo/:id" exact component={RepoContent} />
        <PrivateRoute path="/add_repository" exact component={AddRepository} />
      </Switch>
    </Suspense>
  )
}

export default Router
