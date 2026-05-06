<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { api } from '../../../../components/utils/helper';
    import { useRouter } from 'vue-router';
    import Bar from '../../../Bar/Bar.vue';
    import Nav from '../../../Bar/Nav.vue';
    import { motion } from 'motion-v';
    import { Icon } from '@iconify/vue';

    const router = useRouter()
    const isActive = ref(false)
    const selectedItem = ref("" || "lost")
    const itemId = ref(null)

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

    const handleOpenModal = (id) => {
        isActive.value = true
        itemId.value = id
    }

    const handleDelete = async () => {
        try{
            const id = itemId.value
            const res = await api.delete(`/item/${id}`)

            isActive.value = false
            itemId.value = null
            getItem()
        }
        catch(err){
            if (err.status == 500) {
                message.value = "Maaf, Terjadi Gangguan Untuk Terhubung Dengan Server"
            }
        }
    }

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
    <div class="min-h-screen dark:bg-linear-to-b dark:from-gray-950/90 dark:to-blue-950">
        <Nav />
        <Bar />

        <div v-if="isActive" class="flex justify-center items-center min-h-screen">
            <motion.div :initial="{ scale: 0}" :animate="{ scale: [0, 1.1, 1], duration: 1}" class="bg-linear-to-b from-gray-200 to-gray-500/50 dark:bg-linear-to-b dark:from-gray-950/20 dark:to-gray-950/40 w-full ml-5 mr-5 pb-5 rounded-lg">
                <button @click="isActive = false" class="w-full flex justify-end pr-2 pt-2">
                    <Icon icon="lets-icons:close-round" class="dark:text-white text-gray-700" width="24" height="24" />
                </button>
                <div class="flex-col flex items-center justify-center gap-5">
                    <Icon icon="carbon:close-outline" class="text-red-500" width="75" height="75" />
                    <h3 class="text-gray-800 text-lg pl-5 pr-5 font-bold text-center dark:text-white">Apakah Anda Yakin Ingin Menghapusnya?</h3>
                    <div class="grid grid-cols-2 gap-2">
                        <button @click="isActive = false" class="bg-white text-black dark:bg-white/0 dark:text-white dark:border dark:border-gray-400 font-bold rounded-md">Batal</button>
                        <button @click="handleDelete()" class="bg-red-500 text-white font-bold rounded-md px-5 border-gray-400 border py-2">Hapus</button>
                    </div>
                </div>
            </motion.div>
        </div>

        <div v-else class="flex flex-col pt-24 pb-10 px-6 gap-8">
            <div class="space-y-6">
                <motion.h3 :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }"
                    class="text-center text-blue-950 dark:text-white text-3xl font-black tracking-tight">
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
                    <motion.div :initial="{ x: -100}" :animate="{ x: 0}" v-for="item in filter" class="flex justify-between dark:bg-white/10 bg-gray-200 py-2 rounded-lg pl-2">
                        <button @click="handleNavigate(item.id)" class="flex gap-2 items-center">
                            <img class="shadow rounded-lg p-2 w-23 h-23 bg-white/20" :src="`${item.image}`">
                            <div class="text-start">
                                <h3 class="text-blue-950 dark:text-white font-bold text-lg leading-tight group-hover:text-blue-700 transition-colors">
                                    {{ item.title }}
                                </h3>
                                <div class="flex items-center gap-1 mt-1 text-gray-400">
                                    <Icon icon="solar:map-point-bold-duotone" class="dark:text-yellow-400 text-yellow-500" width="18" />
                                    <span class="text-sm font-medium">{{ item.location }}</span>
                                </div>
                            </div>
                        </button>

                        <button @click="handleOpenModal(item.id)" class="flex items-center pr-2 text-red-500 group-hover:text-blue-500">
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