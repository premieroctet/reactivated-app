import React from 'react'
import Button from 'antd/lib/button'

interface Props {
  loading?: boolean
}

const Login = ({ loading = false }: Props) => {
  return (
    <div
      style={{
        textAlign: 'center',
        paddingTop: '25%',
        backgroundColor: '#282c34',
        height: '100vh',
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 30, color: 'white' }}>
        reactivated.app{' '}
        <span style={{ verticalAlign: 'middle' }} role="img" aria-label="light">
          ⚡️
        </span>
      </div>

      <a href={`${process.env.REACT_APP_API_HOST}/auth/github`}>
        <Button type="primary" size="large" icon="github" loading={loading}>
          Sign in with Github
        </Button>
      </a>
    </div>
  )
}

export default Login
