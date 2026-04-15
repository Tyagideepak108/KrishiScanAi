import API from './predict'

export const register = (data) => API.post('/api/auth/register', data)
export const login    = (data) => API.post('/api/auth/login', data)
export const getMe    = ()     => API.get('/api/users/me')
export const updateMe = (data) => API.patch('/api/users/me', data)

export const saveUser = (user, token) => {
  localStorage.setItem('ks_token', token)
  localStorage.setItem('ks_user', JSON.stringify(user))
}

export const getUser = () => {
  try { return JSON.parse(localStorage.getItem('ks_user')) } catch { return null }
}

export const isLoggedIn = () => !!localStorage.getItem('ks_token')

export const logout = () => {
  localStorage.removeItem('ks_token')
  localStorage.removeItem('ks_user')
}