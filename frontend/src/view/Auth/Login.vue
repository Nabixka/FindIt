<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { motion } from 'motion-v'
    import { Icon } from '@iconify/vue'

    const API_URL = import.meta.env.VITE_API_URL

    const clicked = ref(false)
    const email = ref("")
    const password = ref("")
    const message = ref("")
    const router = useRouter()
    const modal = ref(false)

    const Login = async () => {
        try {
            clicked.value = true
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value
                })
            })

            if(res.status == 404 || 401){
                message.value = "Email Atau Password Salah"
                clicked.value = false
            }
            if(res.status == 403){
                modal.value = true
            }

            const json = await res.json()
            const data = json.data

            router.push({
                name: "Otp",
                state: {
                    email: data.email
                }
            })
        }
        catch (err) {
            console.log(err)
        }
    }

</script>

<template>
    <div class="bg-linear-to-r from-white min-h-screen to-gray-200 lg:flex lg:justify-center lg:items-center">
        <motion.div :initial="{ scale: 0}" :animate="{ scale: [0, 1.1, 1], transition: { duration: 1 } }" v-if="modal == false" class="flex flex-col lg:mt-5 lg:mb-5 h-screen lg:h-1/2 lg:bg-white lg:rounded-lg lg:w-1/3">
            <div class="flex flex-col gap-20 pt-10">
                <div>
                    <h3 class="text-yellow-600 text-center text-4xl font-bold">Welcome To</h3>
                    <h3 class="text-yellow-600 text-center text-2xl font-bold">Login Page</h3>
                </div>
                <div class="flex justify-center">
                    <img src="/Findit.png" class="w-50">
                </div>
            </div>
            <div class="pl-10 pr-10 mt-10 flex flex-col gap-5 bg-linear-to-b from-blue-900/80 to-blue-950 h-full p-5 rounded-t-4xl rounded-b-lg">
                <form @submit.prevent="Login" class="flex flex-col gap-5 pt-10">
                    <h3 class="text-red-900 font-bold text-center" v-if="message">{{ message }}</h3>
                    <div class="shadow-xl">
                        <input type="email" v-model="email" required class="shadow text-white w-full pl-3 py-2 border-2 border-white rounded"
                            placeholder="Email">
                    </div>
                    <div class="shadow-xl">
                        <input type="password" v-model="password" required class="shadow text-white w-full pl-3 py-2 border-2 border-white rounded"
                            placeholder="Password">
                    </div>
                    <div class="flex justify-center">
                        <button type="submit" :disabled="clicked" class="hover:scale-115 cursor-pointer bg-yellow-400/90 py-2 px-15 text-lg rounded-lg font-bold text-blue-800">{{ clicked ? 'Loading' : 'Log In' }}</button>
                    </div>
                </form>
                <div class="pt-10 flex flex-col gap-5">
                    <div class="flex justify-center">
                        <router-link to="/register" class="text-white/80">Don't have Account? <span class="underline text-yellow-500 font-semibold ">Register</span></router-link>
                    </div>
                    <div class="flex justify-center">
                        <router-link to="/forget" class="text-center text-white/80 underline">Forget Password</router-link>
                    </div>
                </div>
            </div>
        </motion.div>

        <div v-else class="bg-white w-1/3 h-50 p-5 shadow-lg rounded-xl">
            <div class="flex justify-end">
                <Icon @click="modal = false" icon="material-symbols:close" width="24" height="24" class="text-gray-500" />
            </div>
            <div class="flex flex-col h-full gap-2 justify-center items-center">
                <h3 class="text-red-600 font-extrabold text-2xl">Akun Telah Dibanned</h3>
                <Icon icon="lets-icons:sad" width="50" height="50" />
            </div>
        </div>
    </div>
</template>

<style scoped></style>
