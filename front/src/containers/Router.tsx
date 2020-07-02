import PrivateRoute from '@components/PrivateRoute'
import { RepositoryProvider } from '@contexts/RepositoryContext'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Dashboard from './Dashboard'
import AddRepo from './Repository/AddRepo'
import RepositoryLayout from './Repository/RepositoryLayout'
import ViewPullRequest from './Repository/ViewPullRequest'
import ViewRepo from './Repository/ViewRepo'
import Settings from './Settings'

function Router() {
  return (
    <Switch>
      <Route path="/" exact component={Dashboard} />
      <Route path="/repo/:id">
        <RepositoryLayout>
          <Switch>
            <PrivateRoute path="/repo/:id" exact component={ViewRepo} />
            <PrivateRoute
              path="/repo/:id/pull-requests"
              exact
              component={ViewPullRequest}
            />
          </Switch>
        </RepositoryLayout>
      </Route>
      <PrivateRoute path="/add-repository" exact component={AddRepo} />
      <PrivateRoute path="/settings" exact component={Settings} />
    </Switch>
  )
}

export default Router
