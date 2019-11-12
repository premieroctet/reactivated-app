import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth-context";
import { Layout, Menu, Breadcrumb, Button, List } from "antd";
import { deleteFromStorage } from "@rehooks/local-storage";
import githubClient from "../../clients/github";
import axios from "axios";
import "./Home.css";

const { Header, Content, Footer } = Layout;

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
  };

  useEffect(() => {
    loadRepository();
    // eslint-disable-next-line
  }, []);

  const logOut = () => {
    deleteFromStorage("token"); // Deletes the item
  };

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          style={{ lineHeight: "64px" }}
        >
          <Menu.Item key="1">Home</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            background: "#fff",
            padding: 24,
            minHeight: 280,
            textAlign: "center",
            height: "85vh"
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
            style={{ marginTop: "50px" }}
            size="large"
            bordered
            dataSource={repositories}
            renderItem={repository => <List.Item>{repository.name}</List.Item>}
          />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Reactivated App ©2019 Created by Premier Octet
      </Footer>
    </Layout>
  );
}

export default Home;
