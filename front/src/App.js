import React, { useState } from "react";
import Login from "./containers/Login/Login";
import Layout from "./containers/Layout/Layout";
import "./App.css";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  return (
    <div className="app">
      {isConnected ? (
        <Layout />
      ) : (
        <Login isConnected={isConnected} setIsConnected={setIsConnected} />
      )}
    </div>
  );
}

export default App;
