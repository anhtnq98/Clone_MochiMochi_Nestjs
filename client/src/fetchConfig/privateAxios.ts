import axios from 'axios'

let getAccessToken=localStorage.getItem("accessToken")
let token = getAccessToken?JSON.parse(getAccessToken) : null
const baseURL = 'http://localhost:5500'

const privateAxios = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    "Authorization": token
  }
})

export default privateAxios