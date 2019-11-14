import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import RepoContent from "../RepoContent/RepoContent";
const Home = lazy(() => import("../Home/Home"));

function Router() {
  return (
    <Suspense fallback={<p>Chargement de la page...</p>}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/repo/:owner/:repo" exact component={RepoContent} />
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
}

export default Router;
