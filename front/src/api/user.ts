import API from './api'

export const deleteAccount = (userId: number) => {
  return API.post(`/users/${userId}/delete-account`)
}
