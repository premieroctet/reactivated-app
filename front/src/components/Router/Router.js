import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "../../containers/Home/Home";

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
