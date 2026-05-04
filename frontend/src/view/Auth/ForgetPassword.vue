<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { motion } from 'motion-v'


    const API_URL = import.meta.env.VITE_API_URL

    const clicked = ref(false)
    const email = ref("")
    const password = ref("")
    const message = ref("")
    const router = useRouter()

    const Login = async () => {
        try {
            clicked.value = true
            const res = await fetch(`${API_URL}/auth/forgot/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value
                })
            })

            if (res.ok === true) {
                router.push('/')
            }
            else{
                message.value = "User Tidak Ada"
            }

        }
        catch (err) {
            message.value = "Gagal Terhubung Ke Server"
        }
    }

</script>

<template>
    <div class="bg-linear-to-r from-white min-h-screen to-gray-200 lg:flex lg:justify-center lg:items-center">
        <motion.div :initial="{ scale: 0}" :animate="{ scale: [0, 1.1, 1], transition: { duration: 1 } }" class="flex flex-col h-screen lg:mt-5 lg:mb-5 lg:h-1/2 lg:bg-white lg:rounded-lg lg:w-1/3">
            <div class="flex flex-col gap-20 pt-10">
                <div>
                    <h3 class="text-yellow-600 text-center text-4xl font-bold z-2">Welcome To</h3>
                    <h3 class="text-yellow-600 text-center text-2xl font-bold z-2">Reset Password Page</h3>
                </div>
                <div class="flex justify-center">
                    <img src="/Findit.png" class="w-50">
                </div>
            </div>
            <div class="pl-10 pr-10 mt-10 flex flex-col gap-5 bg-linear-to-b from-blue-900/80 to-blue-950 h-full p-5 rounded-t-4xl rounded-b-lg">
                <form @submit.prevent="Login" class="flex flex-col gap-5 pt-10">
                    <h3 class="text-red-900 font-bold text-center" v-if="message">{{ message }}</h3>
                    <div class="shadow-xl">
                        <input v-model="email" required class="shadow text-white w-full pl-3 py-2 border-2 border-white rounded"
                            placeholder="Email">
                    </div>
                    <div class="shadow-xl">
                        <input v-model="password" type="password" required class="shadow text-white w-full pl-3 py-2 border-2 border-white rounded"
                            placeholder="Password">
                    </div>
                    <div class="flex justify-center">
                        <button :disabled="clicked" type="submit" class="hover:scale-115 bg-yellow-400/90 py-2 px-15 rounded-lg font-bold text-blue-800">Submit</button>
                    </div>
                </form>
                <div class="pt-10 flex flex-col gap-5">
                    <div class="flex justify-center">
                        <router-link to="/" class="text-white/80">Remember Your Account? <span class="underline text-yellow-500 font-semibold ">Login</span></router-link>
                    </div>
                    <div class="flex justify-center">
                        <router-link to="/register" class="text-center text-white/80">Don't Have A Acoount? <span class="underline text-blue-500 font-semibold ">Register</span></router-link>
                    </div>
                </div>
            </div>
        </motion.div>
    </div>
</template>

<style scoped></style>