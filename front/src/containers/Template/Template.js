import React from "react";
import { Layout, Menu, Row, Col, Breadcrumb } from "antd";
import { deleteFromStorage } from "@rehooks/local-storage";
import Router from "../Router";

const { Header, Footer } = Layout;

function Template() {
  const logOut = () => {
    deleteFromStorage("token");
  };
  return (
    <Layout>
      <Header>
        <Row type="flex" justify="center">
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            style={{ lineHeight: "64px" }}
          >
            <Menu.Item key="1">Home</Menu.Item>
            <Menu.Item onClick={logOut} key="2">
              Logout
            </Menu.Item>
          </Menu>
        </Row>
      </Header>

      <Row type="flex" justify="center">
        <Col xs={22} lg={18}>
          <Breadcrumb style={{ margin: "16px 0" }}></Breadcrumb>
          <div
            style={{
              background: "#fff",
              padding: 24,
              minHeight: "86vh",
              textAlign: "center"
            }}
          >
            <Router />
          </div>
        </Col>
      </Row>

      <Footer style={{ textAlign: "center" }}>
        <b>Reactivated App ©2019 </b> created by{" "}
        <a
          href="https://www.premieroctet.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Premier Octet
        </a>
      </Footer>
    </Layout>
  );
}

export default Template;
