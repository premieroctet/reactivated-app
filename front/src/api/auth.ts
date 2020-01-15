import API from './api'

const getGithubCallback = (code: string) => {
  return API.get<{ token: string }>(`/auth/github/callback?code=${code}`)
}

export default {
  getGithubCallback,
}
