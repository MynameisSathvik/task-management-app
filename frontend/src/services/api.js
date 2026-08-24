import axios from 'axios'

// Production backend (Render) per deployment requirements
const PROD_API = 'https://task-management-app-8fkd.onrender.com/api'
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || PROD_API })

export const setAuthToken = (token) => {
  if (token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete API.defaults.headers.common['Authorization']
}

export default API
