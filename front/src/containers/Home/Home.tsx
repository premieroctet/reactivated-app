import React, { useState, useEffect } from 'react'
import { Breadcrumb, Button, List, Layout } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import RepositoriesAPI from '@api/repositories'
import nextImg from '@assets/img/next.png'
import './Home.scss'

const { Content } = Layout

function Home() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const { jwTokenData } = useAuth()
  const { userId } = jwTokenData!

  const loadRepository = async () => {
    const responseApi = await RepositoriesAPI.getRepositories(userId)
    setRepositories(responseApi.data)
  }

  useEffect(() => {
    loadRepository()
    // eslint-disable-next-line
  }, [])

  return (
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          background: '#fff',
          padding: 24,
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <Button
          href={`https://github.com/apps/${process.env.REACT_APP_GITHUB_APP_NAME}/installations/new`}
          size="large"
          icon="github"
          type="primary"
        >
          Add repo
        </Button>{' '}
        <p className="title">Repositories Availables</p>
        <List
          className="list-container"
          size="large"
          bordered
          dataSource={repositories}
          renderItem={(repository) => (
            <Link to={`/repo/${repository.id}`}>
              <List.Item>
                <img
                  className="repo-icon"
                  src={repository.repoImg}
                  alt="repo-icon"
                />
                <p className="repo-name">{repository.name}</p>
                <img className="arrow-icon" src={nextImg} alt="repo-icon" />
                <p className="repo-author">
                  created by <b>{repository.author}</b>
                </p>
              </List.Item>
            </Link>
          )}
        />
      </div>
    </Content>
  )
}

export default Home
