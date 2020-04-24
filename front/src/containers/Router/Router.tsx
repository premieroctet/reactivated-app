import React, { lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from '@components/PrivateRoute'

const Home = lazy(() => import('../Home/Home'))
const ViewRepo = lazy(() => import('../Repository/ViewRepo'))
const AddRepo = lazy(() => import('../Repository/AddRepo'))

function Router() {
  return (
    <Suspense fallback={<p>Chargement de la page...</p>}>
      <Switch>
        <Route path="/" exact component={Home} />
        <PrivateRoute path="/repo/:id" exact component={ViewRepo} />
        <PrivateRoute path="/add-repository" exact component={AddRepo} />
      </Switch>
    </Suspense>
  )
}

export default Router
