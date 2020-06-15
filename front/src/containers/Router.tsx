import React from 'react'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from '@components/PrivateRoute'
import ViewPullRequest from './Repository/ViewPullRequest'
import RepositoryLayout from './Repository/RepositoryLayout'
import { RepositoryProvider } from '@contexts/RepositoryContext'
import ViewRepo from './Repository/ViewRepo'
import AddRepo from './Repository/AddRepo'
import Dashboard from './Dashboard'

function Router() {
  return (
    <Switch>
      <Route path="/" exact component={Dashboard} />
      <Route path="/repo/:id">
        <RepositoryProvider>
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
        </RepositoryProvider>
      </Route>
      <PrivateRoute path="/add-repository" exact component={AddRepo} />
    </Switch>
  )
}

export default Router
