import React, { useState, useEffect } from "react";
import { Breadcrumb, Button, List, Layout } from "antd";
import apiClient from "../../clients/api";
import { Link } from "react-router-dom";
import "./Home.scss";

const { Content } = Layout;

function Home() {
  const [repositories, setRepositories] = useState([]);
  const loadRepository = async () => {
    const responseApi = await apiClient.get(`/users/:userId/repositories`);
    const repoList = responseApi.data.repoList;
    setRepositories(repoList);
  };

  useEffect(() => {
    loadRepository();
    // eslint-disable-next-line
  }, []);

  return (
    <Content style={{ padding: "0 50px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          background: "#fff",
          padding: 24,
          minHeight: "100vh",
          textAlign: "center"
        }}
      >
        <Button
          href={`https://github.com/apps/${process.env.REACT_APP_GITHUB_APP_NAME}/installations/new`}
          size="large"
          icon="github"
          type="primary"
        >
          Add repo
        </Button>{" "}
        <p className="title">Repositories Availables</p>
        <List
          className="list-container"
          size="large"
          bordered
          dataSource={repositories}
          renderItem={repository => (
            <Link to={`/repo/${repository.author}/${repository.name}`}>
              <List.Item>
                <img
                  className="repo-icon"
                  src={repository.repo_img}
                  alt="repo-icon"
                />
                <p className="repo-name">{repository.name}</p>
                <img
                  className="arrow-icon"
                  src={require(`../../assets/img/next.png`)}
                  alt="repo-icon"
                />
                <p className="repo-author">
                  created by <b>{repository.author}</b>
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
