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

export const formatDate = (dateString) => { 
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
        timeZone: 'Asia/Jakarta'
    }).format(date)
}


api.interceptors.request.use(
    (config) => {
        const token = getToken()
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
    }
)