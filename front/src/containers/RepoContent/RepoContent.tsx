import React, { useEffect, useState } from 'react'
import apiClient from '../../api/api'
import { useAuth } from '../../contexts/AuthContext'
import { formatDistance } from 'date-fns'
import { Link, useRouteMatch } from 'react-router-dom'
import { Button, Switch } from 'antd'
import semver from 'semver'
import './RepoContent.scss'
import DependenciesList from '@components/DependenciesList'

function RepoContent() {
  const [data, setData] = useState<Repository | null>(null)
  const [loading, setLoading] = useState(true)
  const [typeList, setTypeList] = useState('dependencies')
  const {
    params: { id },
  } = useRouteMatch<{ id: string }>()
  const { jwTokenData } = useAuth()
  const { userId } = jwTokenData!

  const loadRepository = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get(
        `/users/${userId}/repositories/${id}`,
      )
      setData(response.data)
    } finally {
      setLoading(false)
    }
  }

  const updateList = () => {
    setTypeList(
      typeList === 'devDependencies' ? 'dependencies' : 'devDependencies',
    )
  }

  useEffect(() => {
    loadRepository()
    // eslint-disable-next-line
  }, [])

  return (
    <div className="repo-content">
      {loading ? (
        <p className="repo-title">Loading...</p>
      ) : (
        !!data && (
          <>
            <Link to="/">
              <Button size="large" icon="github" type="primary">
                Return to repo list
              </Button>
            </Link>

            <div>
              <a href={data.repoUrl}>
                <img className="repo-icon" src={data.repoImg} alt="repo-icon" />
              </a>
              <p className="repo-title">{data.name}</p>

              <p className="repo-author">
                by <b>{data.author}</b>
              </p>
              <p className="repo-updated">
                <span
                  style={{ verticalAlign: 'middle' }}
                  role="img"
                  aria-label="light"
                >
                  ⏱
                </span>{' '}
                {formatDistance(new Date(data.createdAt), new Date())} ago
              </p>
            </div>

            {data.dependencies && data.dependencies.deps && (
              <>
                <div className="list-header">
                  <p className="package-list-type">
                    {typeList === 'devDependencies'
                      ? 'Dependencies'
                      : 'Dev Dependencies'}
                  </p>
                  <Switch defaultChecked onChange={updateList} />
                </div>
                <DependenciesList dependencies={data.dependencies} />
              </>
            )}
          </>
        )
      )}
    </div>
  )
}

export default RepoContent
