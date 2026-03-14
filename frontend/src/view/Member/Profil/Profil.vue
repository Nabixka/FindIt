<script setup>
    import { ref, onMounted } from 'vue';
    import Bar from '../../Bar/Bar.vue';
    import { getToken, removeToken } from '../../../components/utils/helper';
    import { useRouter } from 'vue-router';
    import { Icon } from '@iconify/vue';
    import { motion } from 'motion-v';

    const API_URL = import.meta.env.VITE_API_URL
    const message = ref("")
    const profil = ref({})
    const token = getToken()
    const router = useRouter()

    const getProfil = async () => {
        try {
            if (!token) {
                router.push("/")
            }

            const res = await fetch(`${API_URL}/user/profil`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const json = await res.json()
            profil.value = json.data
        }
        catch (err) {
            console.log(err)
        }
    }

    const LogOut = async () => {
        removeToken()
        router.push("/")
    }

    onMounted(() => {
        getProfil()
    })

</script>

<template>
    <div class="min-h-screen bg-linear-to-b from-blue-900/80 to-blue-950">
        <Bar />

        <div class="flex justify-center items-center lg:h-screen h-full">
            <div class="lg:grid lg:grid-cols-3 pt-10 pb-10 lg:gap-10">
                <div class="lg:col-span-1 flex flex-col pl-10 pr-10 gap-10">

                    <motion.div :initial="{ scale: 0 }" :animate="{ scale: [0, 1.1, 1], transition: { duration: 0.8 } }" class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 flex flex-col items-center gap-4 shadow-xl">
                        <div class="w-32 h-32 bg-white overflow-hidden rounded-full border-4 border-yellow-400">
                            <img src="/F.png" class="w-full h-full object-cover">
                        </div>

                        <div class="text-center">
                            <h3 class="font-extrabold text-white text-2xl">
                                {{ profil.username }}
                            </h3>
                            <p class="text-gray-300 text-sm">
                                {{ profil.email }}
                            </p>
                        </div>
                    </motion.div>

                    <div class="grid grid-cols-2 gap-6">
                        <motion.div :initial="{ scale: 0 }" :animate="{ scale: [0, 1.1, 1], transition: { duration: 0.8 } }" class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center shadow-lg">
                            <h3 class="text-yellow-400 text-4xl font-bold">
                                {{ profil.lost_item }}
                            </h3>
                            <p class="text-white font-semibold mt-2">KEHILANGAN</p>
                        </motion.div>

                        <motion.div :initial="{ scale: 0 }" :animate="{ scale: [0, 1.1, 1], transition: { duration: 0.8 } }" class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center shadow-lg">
                            <h3 class="text-yellow-400 text-4xl font-bold">
                                {{  profil.found_item }}
                            </h3>
                            <p class="text-white font-semibold mt-2">MENEMUKAN</p>
                        </motion.div>
                    </div>

                </div>

                <motion.div :initial="{ scale: 0 }" :animate="{ scale: [0, 1.05, 1], transition: { duration: 0.8 } }" class="lg:col-span-2 mt-10 pb-10 lg:mt-0">
                    <div class="bg-white rounded-3xl ml-5 mr-5 p-10 shadow-2xl">

                        <h3 class="text-2xl font-bold text-blue-950 mb-8">
                            Pengaturan Akun
                        </h3>

                        <div class="flex flex-col gap-6">

                            <router-link to="/member/item"
                                class="flex items-center gap-6 bg-gray-50 hover:bg-gray-100 transition p-5 rounded-xl shadow-md">
                                <div class="bg-sky-300 p-3 rounded-full">
                                    <Icon icon="solar:box-bold" width="24" height="24" />
                                </div>
                                <div class="font-bold text-blue-950 text-lg">
                                    Laporan Penemuan
                                </div>
                            </router-link>

                            <router-link to="/member/report"
                                class="flex items-center gap-6 bg-gray-50 hover:bg-gray-100 transition p-5 rounded-xl shadow-md">
                                <div class="bg-sky-300 p-3 rounded-full">
                                    <Icon icon="boxicons:user-filled" width="24" height="24" />
                                </div>
                                <div class="font-bold text-blue-950 text-lg">
                                    Lapor User Usil
                                </div>
                            </router-link>

                            <button @click="LogOut"
                                class="flex items-center gap-6 bg-red-50 hover:bg-red-100 transition p-5 rounded-xl shadow-md">
                                <div class="bg-red-300 p-3 rounded-full">
                                    <Icon icon="material-symbols:logout" width="24" height="24" />
                                </div>
                                <div class="font-bold text-blue-950 text-lg">
                                    Keluar
                                </div>
                            </button>

                        </div>

                    </div>
                </motion.div>

            </div>
        </div>
    </div>
</template>