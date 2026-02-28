import { createWebHashHistory, createRouter} from 'vue-router'

// Auth
import Login from '../../view/Auth/Login.vue'
import Register from '../../view/Auth/Register.vue'
import ForgetPassword from '../../view/Auth/ForgetPassword.vue'
import Otp from '../../view/Auth/Otp.vue'

// Member
import Profil from '../../view/Member/Profil/Profil.vue'
import LostItem from '../../view/Member/Home/LostItem.vue'
import BarangDetail from '../../view/Member/Barang/BarangDetail.vue'
import FoundItem from '../../view/Member/Home/FoundItem.vue'
import FoundBarang from '../../view/Member/Barang/Create/FoundBarang.vue'
import LostBarang from '../../view/Member/Barang/Create/LostBarang.vue'
import UserFound from '../../view/Member/Barang/UserBarang/UserFound.vue'
import UserLost from '../../view/Member/Barang/UserBarang/UserLost.vue'

// Admin
import Dashboard from '../../view/Admin/Dashboard.vue'
import AdminProfil from '../../view/Admin/Profil.vue'

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
        path: "/member/lost",
        name: "Lost",
        component: LostItem
    },
    {
        path: "/forget",
        name: "Forget",
        component: ForgetPassword
    },
    {
        path: "/member/profil",
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
    },
    {
        path: "/user/found",
        name: "UserFound",
        component: UserFound
    },
    {
        path: "/user/lost",
        name: "UserLost",
        component: UserLost
    },
    {
        path: "/admin/lost",
        name: "AdminDashboard",
        component: Dashboard
    },
    {
        path: "/admin/profil",
        name: "AdminProfil",
        component: AdminProfil
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router