import React from "react";
import Login from "./containers/Login/Login";
import Template from "./containers/Template/Template";
import { useAuth } from "./contexts/auth-context";

import "./App.css";

function App() {
  const { token } = useAuth();
  return <div className="app">{token ? <Template /> : <Login />}</div>;
}

export default App;
