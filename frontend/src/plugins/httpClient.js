import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const httpClient = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URL,
  timeout: 5000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'x-access-token',
    'Content-Type': 'application/json'
  }
})

export default httpClient
