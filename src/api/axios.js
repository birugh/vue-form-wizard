import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 10000,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  res => res,
  error => {
    // centralized error handling (optional)
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
    }
    return Promise.reject(error)
  }
)

export default api
