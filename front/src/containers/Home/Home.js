import React, { useState, useEffect } from "react";
import { Layout, Breadcrumb, Button, List } from "antd";
import { deleteFromStorage } from "@rehooks/local-storage";
import githubClient from "../../clients/github";
import { formatDistance, subDays } from "date-fns";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.scss";

const { Content } = Layout;

function Home() {
  const [repositories, setRepositories] = useState([]);

  const loadRepository = async () => {
    const response = await githubClient.get("/user/installations");
    const promises = response.data.installations.map(installation => {
      return githubClient.get(
        `/user/installations/${installation.id}/repositories`
      );
    });

    const responses = await axios.all(promises);
    let data = [];

    responses.forEach(item => {
      data = [...data, ...item.data.repositories];
    });
    setRepositories(data);
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
          href={`https://github.com/apps/${process.env.REACT_APP_GITHUB_APP_NAME}/installations/new`}
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
            <Link to={`/repo/${repository.owner.login}/${repository.name}`}>
              <List.Item>
                <img
                  className="repo-icon"
                  src={repository.owner.avatar_url}
                  alt="repo-icon"
                />
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
            </Link>
          )}
        />
      </div>
    </Content>
  );
}

export default Home;
