import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth-context";
import axios from "axios";
import { Button } from "antd";
import "antd/dist/antd.css";
import "./Login.css";

const queryString = require("query-string");

function Login() {
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();

  const authUser = async code => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/auth/github/callback?code=${code}`
      );
      console.log(response.data.githubToken);

      setToken(response.data.githubToken);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    if (parsed.code) {
      authUser(parsed.code);
    } else {
      setToken(null);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ fontSize: 40 }}>
          reactivated.app{" "}
          <span role="img" aria-label="light">
            ⚡️
          </span>
        </div>

        <a
          style={{ color: "white", marginTop: 20 }}
          href="http://localhost:3000/auth/github"
        >
          <Button type="primary" size="large" icon="github" loading={loading}>
            Sign in with Github
          </Button>
        </a>
      </header>
    </div>
  );
}

export default Login;
