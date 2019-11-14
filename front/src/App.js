import React from "react";
import Login from "./containers/Login";
import Template from "./containers/Template";
import { useAuth } from "./contexts/auth-context";

function App() {
  const { token } = useAuth();
  return <div>{token ? <Template /> : <Login />}</div>;
}

export default App;
