import React from 'react'
import { Layout, Menu, Button } from 'antd'
import Router from '../Router'
import { deleteFromStorage } from '@rehooks/local-storage'
import './Template.scss'

const { Header, Footer } = Layout

function Template() {
  const logOut = () => {
    deleteFromStorage('token')
  }

  return (
    <Layout className="layout">
      <Header className="header">
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">Home</Menu.Item>
          <Button
            onClick={logOut}
            size="large"
            icon="logout"
            type="primary"
            className="logout-button"
          >
            Logout
          </Button>
        </Menu>
      </Header>
      <div className="content">
        <Router />
      </div>
      <Footer style={{ textAlign: 'center' }}>
        <b>
          Reactivated App{' '}
          <span
            style={{ verticalAlign: 'middle' }}
            role="img"
            aria-label="light"
          >
            🚀
          </span>{' '}
          ©2019{' '}
        </b>{' '}
        by{' '}
        <a
          href="https://www.premieroctet.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Premier Octet
        </a>
      </Footer>
    </Layout>
  )
}

export default Template
