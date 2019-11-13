import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth-context";
import { Layout, Breadcrumb, Button, List } from "antd";
import { deleteFromStorage } from "@rehooks/local-storage";
import githubClient from "../../clients/github";
import { formatDistance, subDays } from "date-fns";
import axios from "axios";
import "./Home.scss";

const { Content } = Layout;

function Home() {
  const [repositories, setRepositories] = useState([]);
  const { token } = useAuth();
  const headers = {
    Authorization: "token " + token,
    Accept: "application/vnd.github.machine-man-preview+json"
  };

  const loadRepository = async () => {
    const response = await githubClient.get("/user/installations", {
      headers
    });
    const promises = response.data.installations.map(installation => {
      return githubClient.get(
        `/user/installations/${installation.id}/repositories`,
        {
          headers
        }
      );
    });

    const responses = await axios.all(promises);
    let data = [];

    responses.forEach(item => {
      data = [...data, ...item.data.repositories];
    });
    setRepositories(data);
    console.log(data);
  };

  useEffect(() => {
    loadRepository();
    // eslint-disable-next-line
  }, []);

  const logOut = () => {
    deleteFromStorage("token");
  };

  return (
    <Content style={{ padding: "0 50px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          background: "#fff",
          padding: 24,
          minHeight: "86vh",
          textAlign: "center"
        }}
      >
        <Button
          href="https://github.com/apps/dev-reactivated-app/installations/new"
          size="large"
          icon="github"
          type="primary"
        >
          Add a new repo
        </Button>{" "}
        <Button onClick={logOut} size="large" icon="logout" type="primary">
          Logout
        </Button>{" "}
        <List
          className="list-container"
          size="large"
          bordered
          dataSource={repositories}
          renderItem={repository => (
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <List.Item>
                <p className="repo-name">{repository.name}</p>
                <p className="repo-author">
                  create by {repository.owner.login}{" "}
                  {formatDistance(
                    subDays(new Date(repository.created_at), 3),
                    new Date()
                  )}{" "}
                  ago
                </p>
              </List.Item>
            </a>
          )}
        />
      </div>
    </Content>
  );
}

export default Home;
