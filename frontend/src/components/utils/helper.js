import axios from "axios"

const URL = import.meta.env.VITE_API_URL

export const getToken = () => {
    return localStorage.getItem('token')
}

export const removeToken = () => {
    localStorage.removeItem('token')
}

export const api = axios.create({
    baseURL: `${URL}`
})

api.interceptors.request.use(
    (config) => {
        const token = getToken()
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
    }
)