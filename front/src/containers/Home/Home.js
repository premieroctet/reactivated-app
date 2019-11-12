import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth-context";
import { Layout, Menu, Breadcrumb, Button } from "antd";
import { deleteFromStorage } from "@rehooks/local-storage";
import axios from "axios";
import "./Home.scss";

const { Header, Content, Footer } = Layout;

function Home() {
  const [selectedRepo, setSelectedRepo] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    axios
      .get("https://api.github.com/user/installations", {
        headers: {
          Authorization: "token " + token,
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
          <a href="https://github.com/apps/dev-reactivated-app/installations/new">
            <Button size="large" icon="github" type="primary">
              Add a new repo
            </Button>{" "}
            <Button onClick={logOut} size="large" icon="logout" type="primary">
              Logout
            </Button>{" "}
          </a>
          <p className="repo-list">{selectedRepo}</p>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Reactivated App ©2019 Created by Premier Octet
      </Footer>
    </Layout>
  );
}

export default Home;
