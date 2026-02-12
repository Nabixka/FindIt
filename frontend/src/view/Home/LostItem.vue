<script setup>
    import { getToken } from '../../components/utils/helper';
    import { useRouter} from 'vue-router'
    import Bar from '../Bar/Bar.vue';
    import { ref, onMounted, computed } from 'vue';
    import { motion } from 'motion-v'
    import { Icon } from '@iconify/vue';

    const router = useRouter()
    const token = getToken()
    const API_URL = import.meta.env.VITE_API_URL
    const category = ref("")

    const items = ref([])
    
    const getItems = async () => {
        try{
            if(!token){
                router.push("/")
            }

            const res = await fetch(`${API_URL}/item/lost`, {
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

    const filterItem = computed(() => {
        if(!category.value) return items.value
        return items.value.filter( item => item.category === category.value)
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
                        <router-link to="/lost" active-class="!border-yellow-600/80 !bg-white text-yellow-600/80" class="border-3 border-white text-center bg-yellow-600/80 w-full py-2 rounded-xl text-white text-xl font-bold">Lost item</router-link>
                        <router-link to="/found" class="border-3 border-white text-center bg-yellow-600/80 w-full py-2 rounded-xl text-white text-xl font-bold">Found Item</router-link>
                    </motion.div>
                </div>
            </div>

            <!-- List Item -->
            <motion.div :initial="{ y: 300 }" :animate="{ y: 0, transition: {duration: 1} }" class="bg-blue-950/90 pb-27 min-h-screen h-full rounded-t-4xl">
                <div class="flex pt-5 items-center">

                    <!-- Filter -->
                    <div class="pl-5 w-50 text-white font-bold">
                        <select class="border-3 border-yellow-600/80 bg-white text-yellow-600/80 text-md px-4 py-2 rounded-lg" v-model="category">
                            <option class="text-black" value="" default>All</option>
                            <option class="text-black" value="Elektronik">Elektronik</option>
                            <option class="text-black" value="Aksesoris">Aksesoris</option>
                            <option class="text-black" value="Pribadi">Pribadi</option>
                            <option class="text-black" value="Berharga">Berharga</option>
                            <option class="text-black" value="Lainnya">Lainnya</option>
                        </select>
                    </div>

                    <!-- Create -->
                    <div class="flex w-full justify-end pr-5">
                        <router-link to="/createLost" class="py-2 bg-yellow-600/80 rounded-lg p-2 font-semibold text-white border-3">Laporan Kehilangan</router-link>
                    </div>

                </div>

                <!-- Item -->
                <div class="grid grid-cols-1 pt-5 pl-5 pr-5 gap-5">
                    <button v-if="filterItem.length" @click="navigate(item.id)" v-for="item in filterItem" class="flex gap-5 bg-gray-200 p-5 rounded-xl">
                        <img class="w-20 h-20" :src="`${API_URL}${item.image}`">
                        <div class="flex flex-col justify-start">
                            <h3 class="text-start text-blue-950/80 font-bold text-lg pl-1">{{ item.title }}</h3>
                            <div class="flex items-center gap-1">
                                <Icon icon="mdi:map-marker" width="24" height="24" />
                                <h3>{{ item.location }}</h3>
                            </div>
                            <h3 class="text-start pl-1 text-blue-950/40 font-semibold">{{ item.user.username }}</h3>
                        </div>
                    </button>
                    <h3 v-else class="text-white font-bold text-center text-4xl pt-35">Tidak Ada</h3>
                </div>
            </motion.div>
        </div>
    </div>
</template>
