import { createWebHashHistory, createRouter} from 'vue-router'
import Login from '../../view/Auth/Login.vue'
import Register from '../../view/Auth/Register.vue'
import LostItem from '../../view/Home/LostItem.vue'
import ForgetPassword from '../../view/Auth/ForgetPassword.vue'
import Profil from '../../view/Profil/Profil.vue'
import BarangDetail from '../../view/Barang/BarangDetail.vue'
import FoundBarang from '../../view/Barang/FoundBarang.vue'
import FoundItem from '../../view/Home/FoundItem.vue'
import LostBarang from '../../view/Barang/LostBarang.vue'
import Otp from '../../view/Auth/Otp.vue'

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
        path: "/lost",
        name: "Lost",
        component: LostItem
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
    },
    {
        path: "/found",
        name: "Found",
        component: FoundItem
    },
    {
        path: "/createFound",
        name: "CreateFound",
        component: FoundBarang
    },
    {
        path: "/createLost",
        name: "CreateLost",
        component: LostBarang
    },
    {
        path: "/otp",
        name: "Otp",
        component: Otp
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router