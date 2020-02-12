import axios from 'axios'

const httpClient = axios.create({
  baseURL: process.env.SERVER_URL || 'http://localhost:4000',
  timeout: 5000
})

export default httpClient
