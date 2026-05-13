import { createWebHashHistory, createRouter} from 'vue-router'

// Auth
import Login from '../../view/Auth/Login.vue'
import Register from '../../view/Auth/Register.vue'
import ForgetPassword from '../../view/Auth/ForgetPassword.vue'
import Otp from '../../view/Auth/Otp.vue'

// Member
import Profil from '../../view/Member/Profil.vue'
import BarangDetail from '../../view/Member/BarangDetail.vue'
import MemberCreate from '../../view/Member/createBarang.vue'
import MemberReport from '../../view/Member/Report.vue'
import MemberItem from '../../view/Member/UserBarang.vue'
import CreateReport from '../../view/Member/CreateReport.vue'
import Home from '../../view/Member/Home.vue'

// Admin
import AdminHome from '../../view/Admin/AdminHome.vue'
import AdminProfil from '../../view/Admin/Profil.vue'
import ListBarang from '../../view/Admin/ListBarang.vue'
import ListUser from '../../view/Admin/ListUser.vue'
import ListMatches from '../../view/Admin/ListMatches.vue'

const routes = [

    // Auth
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
        path: "/otp",
        name: "Otp",
        component: Otp
    },
    {
        path: "/forget",
        name: "Forget",
        component: ForgetPassword
    },


    // Member
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
        path: "/member/home",
        name: "MemberHome",
        component: Home
    },
    {
        path: "/member/create/item",
        name: "MemberCreate",
        component: MemberCreate
    },
    {
        path: "/member/report",
        name: "MemberReport",
        component: MemberReport
    },
    {
        path: "/member/item",
        name: "MemberItem",
        component: MemberItem
    },
    {
        path: "/member/create/report",
        name: "MemberCreateReport",
        component: CreateReport
    },

    // Admin
    {
        path: "/admin/barang",
        name: "ListBarang",
        component: ListBarang
    },
    {
        path: "/admin/user",
        name: "ListUser",
        component: ListUser
    },
    {
        path: "/admin/matches",
        name: "ListMatches",
        component: ListMatches
    },
    {
        path: "/admin/home",
        name: "AdminHome",
        component: AdminHome
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