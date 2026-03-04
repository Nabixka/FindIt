import axios from "axios"

export const getToken = () => {
    return localStorage.getItem('token')
}

export const removeToken = () => {
    localStorage.removeItem('token')
}

export const api = axios.create({
    baseURL: "http://localhost:3000"
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