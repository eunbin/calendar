import axios from 'axios'
const TIMEOUT_MILL = 5000

const httpClient = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URL,
  timeout: TIMEOUT_MILL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'x-access-token',
    'Content-Type': 'application/json'
  }
})

export default httpClient
