<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const API_URL = import.meta.env.VITE_API_URL

const clicked = ref(false)
const username = ref("")
const email = ref("")
const password = ref("")
const message = ref("")
const nomor = ref("")
const country_number = ref("")
const router = useRouter()
const country = ref([
    {
        num: '62',
    },
    {
        num: '1'
    }
])

const onlyNumber = () => {
    nomor.value = nomor.value.replace(/[^0-9]/g, '')
} 



const Register = async () => {
    try {
        clicked.value = true
        const final_number = country_number.value + nomor.value
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username.value,
                email: email.value,
                password: password.value,
                role: "member",
                nomor: final_number
            })
        })

        if (res.status == 400) {
            message.value = "Isi Yang Benar"
        }
        if (res.status == 409) {
            message.value = "Email Sudah Terdaftar"
        }
        else {
            router.push('/')
        }
    }
    catch (err) {
        console.log(err)
        message.value = "Gagal Terhubung Ke Server"
    }
}

</script>

<template>
    <div class="bg-linear-to-r from-white min-h-screen to-gray-200 lg:flex lg:justify-center lg:items-center">
        <div class="flex flex-col h-screen lg:mt-5 lg:mb-5 lg:h-1/2 lg:bg-white lg:rounded-lg lg:w-1/3">
            <div class="flex flex-col gap-20 pt-10">
                <div>
                    <h3 class="text-yellow-600 text-center text-4xl font-bold z-2">Welcome To</h3>
                    <h3 class="text-yellow-600 text-center text-2xl font-bold z-2">Register Page</h3>
                </div>
                <div class="flex justify-center">
                    <img src="/Findit.png" class="w-50">
                </div>
            </div>
            <div
                class="pl-10 pr-10 mt-10 flex flex-col gap-5 bg-linear-to-b from-blue-900/80 to-blue-950 h-full p-5 rounded-t-4xl rounded-b-lg">
                <form @submit.prevent="Register" class="flex flex-col gap-5 pt-10">
                    <h3 class="text-red-900 font-bold text-center" v-if="message">{{ message }}</h3>
                    <div class="shadow-xl">
                        <input type="text" required v-model="username"
                            class="shadow text-white w-full pl-3 py-2 border-2 border-white rounded"
                            placeholder="Username">
                    </div>
                    <div class="shadow-xl">
                        <input type="email" required v-model="email"
                            class="shadow text-white w-full pl-3 py-2 border-2 border-white rounded"
                            placeholder="Email">
                    </div>
                    <div class="shadow-xl">
                        <input type="password" required v-model="password"
                            class="shadow text-white w-full pl-3 py-2 border-2 border-white rounded"
                            placeholder="Password">
                    </div>
                    <div class="flex gap-5">
                        <!-- Bendera -->
                        <div class="">
                            <select v-model="country_number" class="shadow text-black bg-white pr-3 pl-3 py-2 border-2 border-white rounded">
                                <option disabled value="">Country</option>
                                <option v-for="c in country" :value="c.num">+ {{ c.num }}</option>
                            </select>
                        </div>
                        <div class="w-full">
                            <input v-model="nomor" @input="onlyNumber" inputmode="numeric" class="shadow text-white w-full pl-3 py-2 border-2 border-white rounded" type="text"
                                placeholder="1234567" maxlength="11">
                        </div>
                    </div>
                    <div class="flex justify-center">
                        <button type="submit" :disabled="clicked"
                            class="hover:scale-115 bg-yellow-400/90 py-2 px-15 rounded-lg text-lg font-bold text-blue-800">Register</button>
                    </div>
                </form>
                <div class="pt-10 pb-5 flex flex-col gap-5">
                    <div class="flex justify-center">
                        <router-link to="/" class="text-white/80">Already have A Account?
                            <span class="text-yellow-500 font-semibold underline">Log In</span>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
