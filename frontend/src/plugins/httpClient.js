import axios from 'axios'
const TIMEOUT_MILL = 5000

const httpClient = axios.create({
  // baseURL: process.env.VUE_APP_SERVER_URL,
  timeout: TIMEOUT_MILL
})

export default httpClient
