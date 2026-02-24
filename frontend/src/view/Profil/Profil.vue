<script setup>
    import { ref, onMounted } from 'vue';
    import Bar from '../Bar/Bar.vue';
    import { getToken, removeToken } from '../../components/utils/helper';
    import { useRouter } from 'vue-router';
    import { Icon } from '@iconify/vue';
    import { motion } from 'motion-v';

    const API_URL = import.meta.env.VITE_API_URL
    const message = ref("")
    const profil = ref({})
    const token = getToken()
    const router = useRouter()
    const lost = ref([])
    const found = ref([])

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

    const getLost = async () => {
        try{
            if(!token){
                router.push("/")
            }

            const res = await fetch(`${API_URL}/item/user/lost`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const json = await res.json()
            lost.value = json.data
        }
        catch(err){
            console.log(err)
        }
    }

    const getFound = async () => {
        try{
            if(!token){
                router.push("/")
            }

            const res = await fetch(`${API_URL}/item/user/found`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const json = await res.json()
            found.value = json.data
        }
        catch(err){
            console.log(err)
        }
    }

    const LogOut = async () => {
        removeToken()
        router.push("/")
    }

    onMounted(() => {
        getProfil(), getLost(), getFound()
    })

</script>

<template>
    <div class="bg-linear-to-b from-blue-900/80 to-blue-950 min-h-screen h-full">
        <Bar />
        <div class="flex flex-col justify-around h-screen">

            <!-- Data -->
            <div class="flex justify-center">
                <div class="flex flex-col items-center gap-3">
                    <motion.div :initial="{scale: 0}" :animate="{scale: [0, 1.3, 1], transition: {duration: 1}}" class="w-30 bg-white overflow-hidden border-5 rounded-full border-yellow-400 ">
                        <img src="/F.png">
                    </motion.div>
                    <motion.div :initial="{scale: 0}" :animate="{scale: [0, 1.3, 1], transition: {duration: 1}}" class="flex flex-col">
                        <h3 class="font-extrabold text-white text-center text-3xl">{{ profil.username }}</h3>
                        <h3 class="font-semibold text-gray-200/60 text-center text-sm">{{ profil.email }}</h3>
                    </motion.div>
                </div>
            </div>

            <!-- Total Item -->
            <div>
                <div class="grid grid-cols-2 gap-10 pl-5 pr-5">
                    <motion.div :initial="{scale: 0}" :animate="{scale: [0, 1.2, 1], transition: {duration: 0.8}}" class="py-2 bg-gray-100/50 rounded-lg flex flex-col items-center">
                        <h3 class="font-bold text-yellow-400 text-4xl">{{ lost.length === 0 ? 0 : lost.length }}</h3>
                        <h3 class="text-white font-semibold">KEHILANGAN</h3>
                    </motion.div>
                    <motion.div :initial="{scale: 0}" :animate="{scale: [0, 1.2, 1], transition: {duration: 0.8}}" class="py-2 bg-gray-100/50 rounded-lg flex flex-col items-center">
                        <h3 class="font-bold text-yellow-400 text-4xl">{{ found.length === 0 ? 0 : found.length }}</h3>
                        <h3 class="text-white font-semibold">MENEMUKAN</h3>
                    </motion.div>
                </div>
            </div>

            <!-- Pengaturan -->
            <motion.div :initial="{y: 300}" :animate="{y: 0, transition: {duration: 0.8}}" class="bg-linear-to-r from-white to-gray-200 rounded-t-4xl ">
                <div class="pl-6 pt-8 pr-6 flex flex-col gap-5 pb-10">
                    <h3 class="text-shadow-md text-xl text-blue-950/90 font-bold">Pengaturan Akun</h3>
                    <router-link to="/user/found" class="shadow-lg bg-white p-4 rounded-lg flex gap-6 items-center">
                        <div class="bg-sky-300 p-2 rounded-full">
                            <Icon icon="iconoir:page" width="24" height="24" />
                        </div>
                        <div class="font-bold text-blue-950/90 text-lg">Laporan Penemuan</div>
                    </router-link>
                    <router-link to="/user/lost" class="shadow-lg bg-white p-4 rounded-lg flex gap-6 items-center">
                        <div class="bg-sky-300 p-2 rounded-full">
                            <Icon icon="mdi:bell" width="24" height="24" />
                        </div>
                        <div class="font-bold text-blue-950/90 text-lg">Laporan Kehilangan</div>
                    </router-link>
                    <button @click="LogOut" class="shadow-lg bg-white p-4 mb-10 rounded-lg flex gap-6 items-center">
                        <div class="bg-red-300 p-2 rounded-full">
                            <Icon icon="material-symbols:logout" width="24" height="24" />
                        </div>
                        <div class="font-bold text-blue-950/90 text-lg">Keluar</div>
                    </button>
                </div>
            </motion.div>

        </div>
    </div>
</template>