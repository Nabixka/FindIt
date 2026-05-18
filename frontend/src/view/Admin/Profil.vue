<script setup>
    import Bar from '../Bar/Bar.vue';
    import Nav from '../Bar/Nav.vue';
    import { api, getToken, removeToken } from '../../components/utils/helper';
    import { onMounted, ref } from 'vue';
    import { Icon } from '@iconify/vue';
    import { useRouter } from 'vue-router';
    import { motion } from 'motion-v';
    import { useDark, useToggle } from '@vueuse/core';

    const router = useRouter()
    const profil = ref({})
    const listItem = ref([])
    const listUser = ref([])
    const isDark = useDark()
    const darkToggle = useToggle(isDark)  
    const isShow = ref(false)
    const isLoading = ref(true)
    const token = getToken()
    const message = ref()

    const getProfil = async () => {
        try{
            const res = await api.get("/user/profil")
            profil.value = res.data.data
        }
        catch(err){
            if(err.status == 401){
                LogOut()
            }
            if(err.status == 500){
                message.value = "Gagal Terhubung Ke Server"
            }
        }
    }

    const getUser = async () => {
        try{
            const res = await api.get("/user")
            listUser.value = res.data.data
        }
        catch(err){
            if(err.status == 403){
                LogOut()
            }
            if(err.status == 500){
                message.value = "Gagal Terhubung Ke Server"
            }
        }
    }

    const getItem = async () => {
        try{
            const res = await api.get("/item")
            listItem.value = res.data.data
        }
        catch(err){
            if(err.status == 401){
                LogOut()
            }
            if(err.status == 500){
                message.value = "Gagal Terhubung Ke Server"
            }
        }
    }

    onMounted(async () => {
        try{    
            if(!token){
                LogOut()
            }
            await new Promise(resolve => setTimeout(resolve, 2000))

            await Promise.all([
                getProfil(),
                getItem(),
                getUser()
            ])
        }
        catch(err){
            console.log(err)
        }
        finally{
            isLoading.value = false
        }
    })

    const LogOut = () => {
        removeToken()
        router.push("/")
    }

</script>

<template>
    <div class="min-h-screen bg-linear-to-b from-white to-gray-200 dark:bg-linear-to-b dark:from-gray-950/90 dark:to-blue-950">
        <Nav />
        <Bar />

        <div v-if="isShow" class="fixed inset-0 z-50 flex h-screen items-center justify-center pl-5 pr-5">
            
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="isShow = false"></div>
    
            <div class="bg-linear-to-b bg-linear-to-b z-50 from-gray-800 to-gray-950 dark:from-white dark:to-gray-300 shadow p-3 pb-5 rounded-lg w-full flex flex-col gap-1">
                <button @click="isShow = false" class="flex justify-end dark:text-black text-white">
                    <Icon icon="meteor-icons:xmark" width="24" height="24" />
                </button>
                <div class="w-full flex gap-3 justify-center items-center">
                    <Icon :icon="isDark ? 'solar:moon-line-duotone' : 'tabler:sun'" class="dark:text-black text-white" width="24" height="24" />
                    <button @click="isDark = !isDark" :class="isDark ? 'justify-end' : 'justify-start'"  class="bg-gray-500 w-1/3 flex rounded-full h-8">
                        <div :class="isDark ? 'bg-gray-800' : 'bg-yellow-200' " class="rounded-full w-2/4 h-8"></div>
                    </button>
                </div>
            </div>
        </div>

        <div class="pt-24 pl-8 pr-8 lg:flex lg:justify-center lg:items-center h-full pb-10">
            <div class="lg:grid lg:grid-cols-3 pt-10 pb-10 lg:gap-10">
                <div class="lg:col-span-1 flex flex-col gap-10">

                    <div v-if="isLoading" class="bg-blue-950/80 dark:bg-white/10 backdrop-blur-lg rounded-3xl p-8 flex flex-col items-center gap-4 shadow-xl animate-pulse" > 
                        <div class="w-32 h-32 rounded-full bg-gray-400"></div> 
                        <div class="flex flex-col gap-3 items-center w-full"> 
                            <div class="h-6 w-40 bg-gray-400 rounded"></div> 
                            <div class="h-4 w-52 bg-gray-500 rounded"></div> 
                        </div> 
                    </div>

                    <div v-else class="bg-blue-950/80 dark:bg-white/10 backdrop-blur-lg rounded-3xl p-8 flex flex-col items-center gap-4 shadow-xl">
                        <div class="w-32 h-32 bg-white overflow-hidden rounded-full border-4 border-yellow-400">
                            <img src="/F.png" class="w-full h-full object-cover">
                        </div>

                        <div class="text-center">
                            <h3 class="font-extrabold text-white text-2xl">
                                {{ profil.username }}
                            </h3>
                            <p class="text-gray-300 text-sm">{{ profil.email }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-6 pb-5">

                        <div v-if="isLoading" class="bg-blue-950/80 dark:bg-white/10 rounded-3xl p-8 shadow-xl animate-pulse" > 
                            <div class="h-10 w-16 bg-gray-400 rounded mx-auto"></div> 
                            <div class="h-4 w-20 bg-gray-500 rounded mx-auto mt-4"></div> 
                        </div>

                        <div v-else class="bg-blue-950/80 dark:bg-white/10 backdrop-blur-lg rounded-3xl p-8 flex flex-col items-center gap-4 shadow-xl">
                            <h3 class="text-yellow-400 text-4xl font-bold">
                                {{ listUser.length }}
                            </h3>
                            <p class="text-white dark:text-white font-semibold mt-2">USER</p>
                        </div>

                        <div v-if="isLoading" class="bg-blue-950/80 dark:bg-white/10 rounded-3xl p-8 shadow-xl animate-pulse" > 
                            <div class="h-10 w-16 bg-gray-400 rounded mx-auto"></div> 
                            <div class="h-4 w-20 bg-gray-500 rounded mx-auto mt-4"></div> 
                        </div>

                        <div v-else class="bg-blue-950/80 dark:bg-white/10 backdrop-blur-lg rounded-3xl p-8 flex flex-col items-center gap-4 shadow-xl">
                            <h3 class="text-yellow-400 text-4xl font-bold">
                                {{ listItem.length }}
                            </h3>
                            <p class="text-white dark:text-white font-semibold mt-2">BARANG</p>
                        </div>
                    </div>

                </div>

                <div class="lg:col-span-2 mt-10 pb-10 lg:mt-0">
                    <div class="bg-blue-950/80 dark:bg-white/10 rounded-3xl p-10 shadow-2xl">

                        <div v-if="isLoading" class="flex flex-col gap-7">
                            <div class="w-1/2 bg-gray-400 h-8 rounded animate-pulse"></div>
                            <div class="flex flex-col gap-6">
                                <div v-for="n in 4" :key="n" class="rounded-lg w-full dark:bg-white/10 bg-white/90 h-20 flex items-center pl-5 gap-6">
                                    <div class="animate-pulse rounded-full w-10 h-10 bg-gray-400"></div>
                                    <div class="animate-pulse rounded w-1/2 h-10 bg-gray-400"></div>
                                </div>
                            </div>
                        </div>

                        <div v-else class="flex flex-col gap-6">
                            <h3 class="text-2xl font-bold text-white mb-8">Pengaturan</h3>

                            <router-link to="/admin/user"
                                class="flex items-center gap-6 bg-white/90 dark:bg-black/20 hover:bg-black/30 transition p-5 rounded-xl shadow-md">
                                <div class="bg-sky-300 p-3 rounded-full">
                                    <Icon icon="boxicons:user-filled" width="24" height="24" />
                                </div>
                                <h3 class="font-bold text-black dark:text-white text-lg">
                                    User
                                </h3>
                            </router-link>

                            <router-link to="/admin/barang"
                                class="flex items-center gap-6 bg-white/90 dark:bg-black/20 hover:bg-black/30 transition p-5 rounded-xl shadow-md">
                                <div class="bg-sky-300 p-3 rounded-full">
                                    <Icon icon="solar:box-bold" width="24" height="24" />
                                </div>
                                <h3 class="font-bold text-black dark:text-white text-lg">
                                    Barang
                                </h3>
                            </router-link>

                            <router-link to="/admin/matches" class="flex items-center gap-6 bg-white/90 dark:bg-black/20 hover:bg-black/30 transition p-5 rounded-xl shadow-md">
                                <div class="bg-sky-300 p-3 rounded-full">
                                    <Icon icon="material-symbols:all-match" width="24" height="24" />
                                </div>
                                <h3 class="text-left font-bold text-black dark:text-white text-lg">
                                    Match Barang    
                                </h3>
                            </router-link>

                            <button @click="isShow = true" class="flex items-center gap-6 bg-white/90 dark:bg-black/20 hover:bg-black/30 transition p-5 rounded-xl shadow-md">
                                <div class="bg-sky-300 p-3 rounded-full">
                                    <Icon icon="weui:setting-filled" width="24" height="24" />
                                </div>
                                <h3 class="text-left font-bold text-black dark:text-white text-lg">
                                    Pengaturan Layar
                                </h3>
                            </button>

                            <button @click="LogOut"
                                class="flex items-center gap-6 bg-white/90 dark:bg-black/20 dark:hover:bg-black/30 hover:bg-red-100 transition p-5 rounded-xl shadow-md">
                                <div class="bg-red-300 p-3 rounded-full">
                                    <Icon icon="material-symbols:logout" width="24" height="24" />
                                </div>
                                <div class="break-words font-bold text-black dark:text-white text-lg">
                                    Keluar
                                </div>
                            </button>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    </div>
</template>