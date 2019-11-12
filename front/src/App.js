import React from "react";
import Login from "./containers/Login/Login";
import Layout from "./containers/Layout/Layout";

import "./App.css";
import { useAuth } from "./contexts/auth-context";

function App() {
  const { token } = useAuth();
  return <div className="app">{token ? <Layout /> : <Login />}</div>;
}

export default App;
