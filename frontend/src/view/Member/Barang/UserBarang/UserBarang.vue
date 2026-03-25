<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { api } from '../../../../components/utils/helper';
    import { useRouter } from 'vue-router';
    import Bar from '../../../Bar/Bar.vue';
    import Nav from '../../../Bar/Nav.vue';
    import { motion } from 'motion-v';
    import { Icon } from '@iconify/vue';

    const API_URL = import.meta.env.VITE_API_URL
    const router = useRouter()
    const selectedItem = ref("" || "lost")

    const items = ref([])

    const getItem = async () => {
        try {
            const res = await api.get('/item/user')
            items.value = res.data.data
        }
        catch (err) {
            if (err.status == 500) {
                message.value = "Maaf, Terjadi Gangguan Untuk Terhubung Dengan Server"
            }
            if (err.status == 403 || 401) {
                message.value = "Anda Tidak Berhak Mengakses Page Ini"
                router.push("/")
            }
        }
    }

    onMounted(() => {
        getItem()
    })

    const handleNavigate = (id) => {
        router.push({
            name: "Barang",
            state: { id }
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
                <motion.h3 :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }"
                    class="text-center text-blue-950 text-3xl font-black tracking-tight">
                    Barang Saya
                </motion.h3>

                <motion.div :initial="{ opacity: 0 }" :animate="{ opacity: 1 }"
                    class="bg-gray-200/80 p-1.5 rounded-2xl grid grid-cols-2 gap-2 max-w-md mx-auto shadow-inner">
                    <button @click="selectedItem = 'lost'" :class="buttonColor('lost')">
                        Kehilangan
                    </button>
                    <button @click="selectedItem = 'found'" :class="buttonColor('found')">
                        Temuan
                    </button>
                </motion.div>
            </div>

            <div class="flex flex-col gap-4">
                <div v-if="items.length" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <motion.div :initial="{ x: -100}" :animate="{ x: 0}" v-for="item in filter" class="flex justify-between bg-white py-2 rounded-lg pl-2">
                        <button @click="handleNavigate(item.id)" class="flex gap-2 items-center">
                            <img class="shadow rounded-lg p-2 w-23 h-23" :src="`${API_URL}${item.image}`">
                            <div class="text-start">
                                <h3 class="text-blue-950 font-bold text-lg leading-tight group-hover:text-blue-700 transition-colors">
                                    {{ item.title }}
                                </h3>
                                <div class="flex items-center gap-1 mt-1 text-gray-400">
                                    <Icon icon="solar:map-point-bold-duotone" class="text-yellow-500" width="18" />
                                    <span class="text-sm font-medium">{{ item.location }}</span>
                                </div>
                            </div>
                        </button>

                        <button @click="console.log('Hai')" class="flex items-center pr-2 text-red-500 group-hover:text-blue-500">
                            <Icon icon="weui:delete-filled" width="24" height="24" />
                        </button>
                    </motion.div>
                </div>

                <motion.div v-else :initial="{ scale: 0.9, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
                    class="flex flex-col items-center justify-center pt-20 opacity-40">
                    <Icon icon="solar:box-minimalistic-bold-duotone" width="100" class="text-blue-950" />
                    <h3 class="text-blue-950 text-xl font-bold mt-4">Belum ada laporan</h3>
                    <p class="text-gray-500 text-sm">Laporan temuan Anda akan muncul di sini</p>
                </motion.div>
            </div>
        </div>
    </div>
</template>