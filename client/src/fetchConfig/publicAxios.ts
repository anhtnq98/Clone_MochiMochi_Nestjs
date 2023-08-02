import axios from 'axios'

const baseURL = 'http://localhost:5500'

const publicAxios = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  }
})

export default publicAxios