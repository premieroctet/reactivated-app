import React from "react";
import { Layout, Menu } from "antd";
import Router from "../../components/Router/Router";
import "./Template.css";

const { Header, Footer } = Layout;

function Template() {
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

      <Router />

      <Footer style={{ textAlign: "center" }}>
        Reactivated App ©2019 Created by Premier Octet
      </Footer>
    </Layout>
  );
}

export default Template;
