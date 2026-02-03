import { createWebHashHistory, createRouter} from 'vue-router'
import Login from '../Auth/Login.vue'
import Register from '../Auth/Register.vue'
import Home from '../Home/Home.vue'
import ForgetPassword from '../Auth/ForgetPassword.vue'
import Profil from '../Profil/Profil.vue'
import BarangDetail from '../Barang/BarangDetail.vue'

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
    },
    {
        path: "/home",
        name: "Home",
        component: Home
    },
    {
        path: "/forget",
        name: "Forget",
        component: ForgetPassword
    },
    {
        path: "/profil",
        name: "Profil",
        component: Profil
    },
    {
        path: "/barang",
        name: "Barang",
        component: BarangDetail
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router