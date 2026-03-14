<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { api } from '../../../../components/utils/helper';
    import { useRouter } from 'vue-router';
    import Bar from '../../../Bar/Bar.vue';
    import Nav from '../../../Bar/Nav.vue';
    import { motion } from 'motion-v';

    const API_URL = import.meta.env.VITE_API_URL
    const router = useRouter()
    const selectedItem = ref( "" || "lost")

    const items = ref([])

    const getItem = async () => {
        try{
            const res = await api.get('/item/user')
            items.value = res.data.data
        }
        catch(err){

        }
    }

    onMounted(() => {
        getItem()
    })

    const handleNavigate = (id) => {
        router.push({
            name: "Barang",
            state: {id}
        })
    }

    const filter = computed(() => {
        return items.value.filter(item => item.status == selectedItem.value)
    })

    const buttonColor = (active) => {
        return [
            "text-center py-2.5 rounded-xl font-bold transition-all", selectedItem.value == active ? "text-blue-950 bg-white" : "text-yellow-500" 
        ]
    }

</script>

<template>
    <div class="min-h-screen bg-gray-100">
        <Nav />
        <Bar />

        <div class="flex flex-col pt-24 pb-10 px-6 gap-8">
            <div class="space-y-6">
                <motion.h3 
                    :initial="{ opacity: 0, y: -20 }" 
                    :animate="{ opacity: 1, y: 0 }" 
                    class="text-center text-blue-950 text-3xl font-black tracking-tight" >
                    Barang Saya
                </motion.h3>

                <motion.div 
                    :initial="{ opacity: 0 }" 
                    :animate="{ opacity: 1 }" 
                    class="bg-gray-200/80 p-1.5 rounded-2xl grid grid-cols-2 gap-2 max-w-md mx-auto shadow-inner">
                    <button
                        @click="selectedItem = 'lost'"
                        :class="buttonColor('lost')">
                        Kehilangan
                    </button>
                    <button
                        @click="selectedItem = 'found'"
                        :class="buttonColor('found')">
                        Temuan
                    </button>
                </motion.div>
            </div>

            <div class="flex flex-col gap-4">
                <div v-if="items.length" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <motion.button 
                        v-for="(item, index) in filter" 
                        :key="item.id"
                        :initial="{ opacity: 0, x: -20 }"
                        :animate="{ opacity: 1, x: 0, transition: { delay: index * 0.1 } }"
                        @click="handleNavigate(item.id)"
                        class="group flex gap-4 bg-white p-4 rounded-3xl shadow-sm hover:shadow-md transition-all active:scale-95 border border-transparent hover:border-blue-100">
                        <div class="relative shrink-0">
                            <img 
                                class="w-20 h-20 object-cover rounded-2xl shadow-sm" 
                                :src="`${API_URL}${item.image}`"
                                onerror="this.src='https://placehold.co/200x200?text=No+Image'">
                        </div>

                        <div class="flex flex-col justify-between py-1 text-left w-full">
                            <div>
                                <h3 class="text-blue-950 font-bold text-lg leading-tight group-hover:text-blue-700 transition-colors">
                                    {{ item.title }}
                                </h3>
                                <div class="flex items-center gap-1 mt-1 text-gray-400">
                                    <Icon icon="solar:map-point-bold-duotone" class="text-yellow-500" width="18" />
                                    <span class="text-sm font-medium">{{ item.location }}</span>
                                </div>
                            </div>
                            
                            <div class="flex items-center gap-2 mt-2">
                                <span class="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold uppercase">
                                    Aktif
                                </span>
                            </div>
                        </div>

                        <div class="flex items-center pr-2 text-gray-300 group-hover:text-blue-500">
                            <Icon icon="solar:alt-arrow-right-linear" width="20" />
                        </div>
                    </motion.button>
                </div>

                <motion.div 
                    v-else 
                    :initial="{ scale: 0.9, opacity: 0 }" 
                    :animate="{ scale: 1, opacity: 1 }"
                    class="flex flex-col items-center justify-center pt-20 opacity-40">
                    <Icon icon="solar:box-minimalistic-bold-duotone" width="100" class="text-blue-950" />
                    <h3 class="text-blue-950 text-xl font-bold mt-4">Belum ada laporan</h3>
                    <p class="text-gray-500 text-sm">Laporan temuan Anda akan muncul di sini</p>
                </motion.div>
            </div>
        </div>
    </div>
</template>