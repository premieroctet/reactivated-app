import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth-context";
import jwt_decode from "jwt-decode";
import apiClient from "../../clients/api";
import { Button } from "antd";
import "antd/dist/antd.css";

const queryString = require("query-string");

function Login() {
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();

  const authUser = async code => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/auth/github/callback?code=${code}`
      );
      console.log(response.data);
      var tokenDecoded = jwt_decode(response.data);
      console.log(tokenDecoded);
      setToken(tokenDecoded.githubToken);
    } finally {
      setLoading(false);
      window.history.pushState(null, "/", "/");
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
    <div
      style={{
        textAlign: "center",
        paddingTop: "25%",
        backgroundColor: "#282c34",
        height: "100vh"
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 30, color: "white" }}>
        reactivated.app{" "}
        <span style={{ verticalAlign: "middle" }} role="img" aria-label="light">
          ⚡️
        </span>
      </div>

      <a href={`${process.env.REACT_APP_API_HOST}/auth/github`}>
        <Button type="primary" size="large" icon="github" loading={loading}>
          Sign in with Github
        </Button>
      </a>
    </div>
  );
}

export default Login;
