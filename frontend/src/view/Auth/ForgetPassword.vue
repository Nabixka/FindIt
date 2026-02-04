<script setup>
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { motion } from 'motion-v'


    const API_URL = import.meta.env.VITE_API_URL

    const email = ref("")
    const password = ref("")
    const message = ref("")
    const router = useRouter()

    const Login = async () => {
        try {
            const res = await fetch(`${API_URL}/user`, {
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
    <div class="bg-white">
        <div class="flex flex-col h-screen">
            <motion.div :initial="{ y: -200 }" :animate="{ y: 0, transition: { duration: 1.5 } }" class="flex flex-col gap-20 pt-10">
                <div>
                    <h3 class="text-yellow-600 text-center text-4xl font-bold z-2">Welcome To</h3>
                    <h3 class="text-yellow-600 text-center text-2xl font-bold z-2">Reset Password Page</h3>
                </div>
                <div class="flex justify-center">
                    <img src="/Findit.png" class="w-50">
                </div>
            </motion.div>
            <motion.div :initial="{ y: 300 }" :animate="{ y: 0, transition: { duration: 1 } }" class="pl-10 pr-10 mt-10 flex flex-col gap-5 bg-blue-900/80 h-full p-5 rounded-t-4xl">
                <form @submit.prevent="Login" class="flex flex-col gap-5 pt-10">
                    <h3 class="text-red-900 font-bold text-center" v-if="message">{{ message }}</h3>
                    <div class="shadow-xl">
                        <input v-model="email" required class="shadow text-white w-full pl-3 py-2 border-2 border-white rounded"
                            placeholder="Email">
                    </div>
                    <div class="shadow-xl">
                        <input v-model="password" required class="shadow text-white w-full pl-3 py-2 border-2 border-white rounded"
                            placeholder="Password">
                    </div>
                    <div class="flex justify-center">
                        <button class="bg-yellow-400/90 py-2 px-15 rounded-lg font-semibold text-blue-800">Submit</button>
                    </div>
                </form>
                <div class="pt-10 flex flex-col gap-5">
                    <div class="flex justify-center">
                        <router-link to="/" class="text-white/80">Remember Your Account? Log In</router-link>
                    </div>
                    <div class="flex justify-center">
                        <router-link to="/register" class="text-center text-white/80 underline">Don't Have A Acoount? Register</router-link>
                    </div>
                </div>
            </motion.div>
        </div>
    </div>
</template>

<style scoped></style>
