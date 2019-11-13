import React from "react";
import Login from "./containers/Login/Login";
import Template from "./containers/Template/Template";

import "./App.css";
import { useAuth } from "./contexts/auth-context";

function App() {
  const { token } = useAuth();
  return <div className="app">{token ? <Template /> : <Login />}</div>;
}

export default App;
