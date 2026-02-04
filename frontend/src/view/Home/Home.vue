<script setup>
    import { getToken } from '../../components/utils/helper';
    import { useRouter} from 'vue-router'
    import Bar from '../Bar/Bar.vue';
    import { ref, onMounted } from 'vue';
    import { motion } from 'motion-v'

    const router = useRouter()
    const token = getToken()
    const API_URL = import.meta.env.VITE_API_URL

    const items = ref([])
    
    const getItems = async () => {
        try{
            if(!token){
                router.push("/")
            }

            const res = await fetch(`${API_URL}/item`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const json = await res.json()
            items.value = json.data
        }
        catch(err){
            console.log(err)
        }
    }

    const navigate = (id) => {
        router.push({
            name: "Barang",
            state: {id}
        })
    }

    onMounted(() => {
        getItems()
    })

</script>

<template>
    <div class="h-screen bg-gray-200">
        <Bar />
        <div class="flex flex-col gap-15 pt-15">
            <!-- Title -->
            <motion.h3 :initial="{ scale: 0 }" :animate="{ scale: [0, 1.2, 1], transition: { duration: 1, type: 'spring' } }" class="text-yellow-600 text-center text-4xl font-bold">Selamat Datang</motion.h3>

            <!-- Logo & Button -->
            <div class="flex flex-col items-center justify-center gap-6">
                <motion.div :initial="{ scale: 0 }" :animate="{ scale: [0, 1.2, 1], transition: { duration: 1.2 } }">
                    <img class="w-30" src="/Findit.png">
                </motion.div>
                <div class="w-full pl-5 pr-5">
                    <motion.div :initial="{ scale: 0 }" :animate="{ scale: [0, 1.1, 1], transition: { duration: 1 } }" class="grid grid-cols-2 gap-5 w-full">
                        <router-link to="/home" class="text-center bg-yellow-600/80 w-full py-2 rounded-xl text-blue-950 text-xl font-bold">Lost item</router-link>
                        <router-link to="/found" class="text-center bg-yellow-600/80 w-full py-2 rounded-xl text-blue-950 text-xl font-bold">Found Item</router-link>
                    </motion.div>
                </div>
            </div>

            <!-- List Item -->
            <motion.div :initial="{ y: 300 }" :animate="{ y: 0, transition: {duration: 1} }" class="bg-blue-900/90 min-h-screen h-full rounded-t-4xl">
                <div class="grid grid-cols-1 pt-10 pl-5 pr-5 gap-5">
                    <button @click="navigate(item.id)" v-for="item in items" class="flex gap-5 items-center bg-gray-200 p-5 rounded-xl">
                        <img class="w-30 h-25" :src="`${API_URL}${item.image}`">
                        <h3 class="font-bold text-2xl ">{{ item.title }}</h3>
                    </button>
                </div>
            </motion.div>
        </div>
    </div>
</template>
