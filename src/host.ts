import axios from 'axios'

// export const HOST = 'http://localhost:4004'
export const HOST = '/api'
axios.defaults.baseURL = HOST
axios.interceptors.request.use(
  (config) => {
    const value = window.localStorage.getItem('user')
    const token = value && JSON.parse(value)?.token
    if (token) {
      //@ts-ignore
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
