import React from "react";
import axios from "axios";
import "./App.css";

const queryString = require("query-string");

export default class App extends React.Component {
  state = {
    isConnected: false
  };
  componentDidMount() {
    const parsed = queryString.parse(window.location.search);
    if (parsed.code) {
      axios
        .get(`http://localhost:3000/auth/github/callback?code=${parsed.code}`)
        .then(res => {
          console.log(res.data.githubToken);
          axios
            .get("https://api.github.com/user/installations", {
              headers: {
                Authorization: "token " + res.data.githubToken,
                Accept:
                  "application / vnd.github.machine - man - preview + json"
              }
            })
            .then(res => {
              console.log(res.data);
            });
        });
      this.setState({ isConnected: true });
    } else {
      this.setState({ isConnected: false });
    }
  }

  render() {
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
            style={{ color: "white", marginTop: 30 }}
            href="http://localhost:3000/auth/github"
          >
            Sign in with Github
          </a>

          {this.state.isConnected && (
            <a
              style={{ color: "white", marginTop: 30 }}
              href="https://github.com/apps/dev-reactivated-app/installations/new"
            >
              Add a repo
            </a>
          )}
        </header>
      </div>
    );
  }
}
