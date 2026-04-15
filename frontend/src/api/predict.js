import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

// Auto-attach JWT token to every request
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('ks_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// Global error handler
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ks_token')
      localStorage.removeItem('ks_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const predictDisease = (formData, cropType, lang = 'en', threshold = 60) =>
  API.post(`/api/predict/?crop_type=${cropType}&lang=${lang}&threshold=${threshold}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const predictGuest = (formData, cropType, lang = 'en', threshold = 60) =>
  API.post(`/api/predict/guest?crop_type=${cropType}&lang=${lang}&threshold=${threshold}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const getReports = (params = {}) =>
  API.get('/api/reports/', { params })

export const deleteReport = (id) =>
  API.delete(`/api/reports/${id}`)

export const submitFeedback = (data) =>
  API.post('/api/reports/feedback', data)

export const getDiseaseInfo = (key, cropType, lang = 'en') =>
  API.get(`/api/disease-info/${encodeURIComponent(key)}`, { params: { crop_type: cropType, lang } })

export default API