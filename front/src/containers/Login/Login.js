import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "antd";
import "antd/dist/antd.css";
import "./Login.css";

const queryString = require("query-string");

function Login(props) {
  const [selectedRepo, setSelectedRepo] = useState("");
  const [iconLoading, setIconLoading] = useState(false);

  const enterIconLoading = () => {
    setIconLoading(true);
  };

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    let token = "";

    if (parsed.code) {
      axios
        .get(`http://localhost:3000/auth/github/callback?code=${parsed.code}`)
        .then(res => {
          console.log(res.data.githubToken);
          token = res.data.githubToken;
          axios
            .get("https://api.github.com/user/installations", {
              headers: {
                Authorization: "token " + res.data.githubToken,
                Accept: "application/vnd.github.machine-man-preview+json"
              }
            })
            .then(res => {
              console.log(res.data.installations[0].id);
              axios
                .get(
                  `https://api.github.com/user/installations/${res.data.installations[0].id}/repositories`,
                  {
                    headers: {
                      Authorization: "token " + token,
                      Accept: "application/vnd.github.machine-man-preview+json"
                    }
                  }
                )
                .then(res => {
                  console.log(res.data.repositories);

                  setSelectedRepo(res.data.repositories[0].name);
                });
            });
        });
      props.setIsConnected(true);
    } else {
      props.setIsConnected(false);
    }
  });

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
          <Button
            type="primary"
            icon="github"
            loading={iconLoading}
            onClick={enterIconLoading}
          >
            Sign in with Github
          </Button>
        </a>

        {props.isConnected && (
          <a
            style={{ color: "white", marginTop: 30 }}
            href="https://github.com/apps/dev-reactivated-app/installations/new"
          >
            Add a repo
          </a>
        )}

        {props.isConnected && <p>{selectedRepo}</p>}
      </header>
    </div>
  );
}

export default Login;
