import { createWebHashHistory, createRouter} from 'vue-router'
import Login from '../Auth/Login.vue'
import Register from '../Auth/Register.vue'

const routes = [
    {
        path: "/",
        name: "Login",
        component: Login 
    },
    {
        path: "/register",
        name: "Register",
        component: Register
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router