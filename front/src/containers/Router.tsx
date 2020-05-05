import React, { lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from '@components/PrivateRoute'

const Dashboard = lazy(() => import('./Dashboard'))
const ViewRepo = lazy(() => import('./Repository/ViewRepo'))
const AddRepo = lazy(() => import('./Repository/AddRepo'))

function Router() {
  return (
    <Suspense fallback={<></>}>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <PrivateRoute path="/repo/:id" exact component={ViewRepo} />
        <PrivateRoute path="/add-repository" exact component={AddRepo} />
      </Switch>
    </Suspense>
  )
}

export default Router
