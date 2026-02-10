<script setup>
    import { useRouter } from 'vue-router';
    import { getToken } from '../../../components/utils/helper';
    import Bar from '../../Bar/Bar.vue';
    import Nav from '../../Bar/Nav.vue';
    import { ref, onMounted } from 'vue'
    import { Icon } from '@iconify/vue';
    import { motion } from 'motion-v';

    const router = useRouter()
    const API_URL = import.meta.env.VITE_API_URL
    const found = ref([])
    const token = getToken()

    const getFound = async () => {
        try{
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

    const handleNavigate = (id) => {
        router.push({
            name: "Barang",
            state: {id}
        })
    }

    onMounted(() => {
        getFound()
    })
</script>

<template>
    <div class="h-screen bg-gray-300">
        <Nav />
        <Bar />
        <div class="h-screen flex flex-col pt-20">
            <div class="flex flex-col gap-2">
                <motion.h3 :initial="{scale: 0}" :animate="{scale: 1, transition: {duration: 1}}" class="text-center text-blue-950/80 text-3xl font-extrabold">Your Item Found</motion.h3>
                <motion.div :initial="{scale: 0}" :animate="{scale: 1, transition: {duration: 1}}" class="grid grid-cols-2 gap-5 pl-5 pr-5">
                        <router-link to="/user/lost" class="border-3 border-white text-center bg-yellow-600/80 py-1 rounded-full text-white text-xl font-bold">Lost item</router-link>        
                        <router-link to="/user/found" class="border-3 border-yellow-600/80 bg-white text-center py-1 rounded-full text-yellow-600/80 text-xl font-bold">Found Item</router-link>
                </motion.div>
            </div>
            <div>
                <div class="grid grid-cols-1 pt-5 pl-5 pr-5 gap-5">
                    <div v-if="found.length">
                        <motion.button :initial="{scale: 0}" :animate="{scale: 1, transition: {duration: 1}}" @click="handleNavigate(item.id)" v-for="item in found" :value="item.id" :key="item.id" class="flex gap-5 bg-gray-200 w-full p-5 rounded-xl">
                            <img class="w-20 h-20" :src="`${API_URL}${item.image}`">
                            <div class="flex flex-col justify-start">
                                <h3 class="text-start text-blue-950/80 font-bold text-lg pl-1">{{ item.title }}</h3>
                                <div class="flex items-center gap-1">
                                    <Icon icon="mdi:map-marker" width="24" height="24" />
                                    <h3>{{ item.location }}</h3>
                                </div>
                                <h3 class="text-start pl-1 text-blue-950/40 font-semibold">{{ item.user.username }}</h3>
                            </div>
                        </motion.button>
                    </div>
                    <motion.div :initial="{scale: 0}" :animate="{scale: 1, transition: {duration: 1}}" v-else class="pt-50">
                        <h3 class="border-t border-b border-gray-400 w-full text-center p-2 text-blue-950/80 text-4xl font-semibold">Tidak Ada</h3>
                    </motion.div>
                </div>
            </div>
        </div>
    </div>
</template>