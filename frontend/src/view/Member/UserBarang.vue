<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { api } from '../../components/utils/helper';
    import { useRouter } from 'vue-router';
    import Bar from '../Bar/Bar.vue'
    import Nav from '../Bar/Nav.vue'
    import { Icon } from '@iconify/vue';
    
    const router = useRouter()
    const isActive = ref(false)
    const selectedItem = ref("" || "lost")
    const itemId = ref(null)
    
    const items = ref([])
    const matchedItems = ref([])
    const isLoading = ref(true)
    
    const getItem = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 2000))
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
        finally {
            isLoading.value = false
        }
    }
    
    const getMatchedItems = async () => {
        try {
            const res = await api.get('/match/user/list')
            matchedItems.value = res.data.data
        }
        catch (err) {
            console.log(err)
        }
    }
    
    const totalLost = computed(() => items.value.filter(item => item.status == 'lost').length)
    const totalFound = computed(() => items.value.filter(item => item.status == 'found').length)

    onMounted(() => {
        getItem()
        getMatchedItems()
    })
    
    const handleOpenModal = (id) => {
        isActive.value = true
        itemId.value = id
    }
    
    const handleDelete = async () => {
        try {
            const id = itemId.value
            const res = await api.delete(`/item/${id}`)
        
            isActive.value = false
            itemId.value = null
            getItem()
        }
        catch (err) {
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

    const handleCreateBarang = () => {
        router.push({
            name: "MemberCreate",
            query: { status: selectedItem.value }
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
            <div
                class="bg-linear-to-b from-gray-200 to-gray-500/50 dark:bg-linear-to-b dark:from-gray-950/20 dark:to-gray-950/40 w-full ml-5 mr-5 pb-5 rounded-lg">
                <button @click="isActive = false" class="w-full flex justify-end pr-2 pt-2">
                    <Icon icon="lets-icons:close-round" class="dark:text-white text-gray-700" width="24" height="24" />
                </button>
                <div class="flex-col flex items-center justify-center gap-5">
                    <Icon icon="carbon:close-outline" class="text-red-500" width="75" height="75" />
                    <h3 class="text-gray-800 text-lg pl-5 pr-5 font-bold text-center dark:text-white">Apakah Anda Yakin
                        Ingin Menghapusnya?</h3>
                    <div class="grid grid-cols-2 gap-2">
                        <button @click="isActive = false"
                            class="bg-white text-black dark:bg-white/0 dark:text-white dark:border dark:border-gray-400 font-bold rounded-md">Batal</button>
                        <button @click="handleDelete()"
                            class="bg-red-500 text-white font-bold rounded-md px-5 border-gray-400 border py-2">Hapus</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col pt-24 pb-20 px-6 gap-8">
            <div class="space-y-6">
                <h3 class="text-center text-blue-950 dark:text-white text-3xl font-black tracking-tight">
                    Barang Saya
                </h3>

                <div class="bg-gray-200/80 p-1.5 rounded-2xl grid grid-cols-2 gap-2 max-w-md mx-auto shadow-inner">
                    <button @click="selectedItem = 'lost'" :class="buttonColor('lost')">
                        Kehilangan
                    </button>
                    <button @click="selectedItem = 'found'" :class="buttonColor('found')">
                        Temuan
                    </button>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    <div class="rounded-3xl bg-gray-100 dark:bg-white/10 p-2 text-center border border-gray-200 dark:border-white/10">
                        <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Total Item</p>
                        <p class="text-3xl font-bold text-blue-950 dark:text-white">{{ items.length }}</p>
                    </div>
                    <div class="rounded-3xl bg-gray-100 dark:bg-white/10 p-2 text-center border border-gray-200 dark:border-white/10">
                        <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Kehilangan</p>
                        <p class="text-3xl font-bold text-red-500">{{ totalLost }}</p>
                    </div>
                    <div class="col-span-2 sm:col-span-1 rounded-3xl bg-gray-100 dark:bg-white/10 p-2 text-center border border-gray-200 dark:border-white/10">
                        <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Temuan</p>
                        <p class="text-3xl font-bold text-emerald-500">{{ totalFound }}</p>
                    </div>
                </div>
            </div>

            <div class="flex justify-center lg:justify-end px-4">
                <button @click="handleCreateBarang" class="bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-bold py-3 px-6 rounded-2xl shadow-lg shadow-yellow-500/20 transition-all active:scale-95">
                    + Tambah Laporan Baru
                </button>
            </div>

            <div class="flex flex-col gap-4">
                <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div v-for="n in 4" :key="n"
                        class="flex rounded justify-between items-center p-2 dark:bg-white/10 w-full gap-2 bg-gray-200 min-h-[130px]">
                        <div class="w-24 h-24 rounded bg-gray-400 animate-pulse"></div>
                        <div class="w-full flex flex-col gap-2">
                            <div class="w-full h-7 rounded bg-gray-400 animate-pulse"></div>
                            <div class="w-full h-5 rounded bg-gray-400 animate-pulse"></div>
                        </div>
                        <div class="w-10 h-7 bg-gray-400 animate-pulse rounded"></div>
                    </div>
                </div>
                <div v-else-if="filter.length" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div v-for="item in filter" class="flex dark:bg-white/10 bg-gray-200 py-2 rounded-lg pl-2 sm:flex-row gap-4  sm:items-center">
                        <button @click="handleNavigate(item.id)" class="flex gap-2 items-center flex-1 min-w-0">
                            <img class="shadow rounded-lg p-2 w-24 h-24 bg-white/20 object-cover" :src="`${item.image}`">
                            <div class="text-start">
                                <h3
                                    class="text-blue-950 dark:text-white font-bold text-lg leading-tight group-hover:text-blue-700 transition-colors">
                                    {{ item.title }}
                                </h3>
                                <div class="flex items-center gap-1 mt-1 text-gray-400">
                                    <Icon icon="solar:map-point-bold-duotone"
                                        class="dark:text-yellow-400 text-yellow-500" width="18" />
                                    <span class="text-sm font-medium">{{ item.location }}</span>
                                </div>
                            </div>
                        </button>

                        <button @click="handleOpenModal(item.id)"
                            class="flex items-center pr-2 text-red-500 group-hover:text-blue-500">
                            <Icon icon="weui:delete-filled" width="24" height="24" />
                        </button>
                    </div>
                </div>

                <div v-else class="flex flex-col items-center justify-center pt-20 opacity-40">
                    <Icon icon="solar:box-minimalistic-bold-duotone" width="100" class="text-blue-950" />
                    <h3 class="text-blue-950 text-xl font-bold mt-4">Belum ada laporan</h3>
                    <p class="text-gray-500 text-sm">Laporan temuan Anda akan muncul di sini</p>
                </div>
            </div>

            <div v-if="matchedItems.length" class="mt-6 border-t border-white/10 pt-6">
                <h3 class="text-lg font-bold text-blue-950 dark:text-white text-center mb-4">Potensi Match</h3>
                <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <div v-for="match in matchedItems" :key="match.id || match.item_id_1 + '-' + match.item_id_2" class="bg-gray-200 dark:bg-white/5 rounded-2xl p-4">
                        <div class="flex gap-4 items-center">
                            <img :src="match.item1_image || ''" alt="item1" class="w-20 h-20 object-cover rounded-lg border border-white/10" />
                            <div class="flex-1 min-w-0">
                                <p class="text-xs text-slate-400">Item 1</p>
                                <h4 class="font-bold text-blue-950 dark:text-white truncate">{{ match.item1_title }}</h4>
                                <p class="text-xs text-gray-400 truncate">{{ match.item1_location || '' }}</p>
                            </div>
                            <div class="text-right">
                                <div class="text-xs text-gray-400">Kemiripan</div>
                                <div class="text-lg font-bold text-amber-500">{{ Math.round((match.score || match.similarity || 0) * 100) }}%</div>
                            </div>
                        </div>

                        <div class="flex gap-3 items-center mt-3">
                            <button @click="handleNavigate(match.item_id_1 || match.item_id1)" class="flex-1 bg-blue-600 text-white py-2 rounded-lg">Detail 1</button>
                            <button @click="handleNavigate(match.item_id_2 || match.item_id2)" class="flex-1 bg-sky-500 text-white py-2 rounded-lg">Detail 2</button>
                            <button @click.prevent class="px-3 py-2 rounded-lg border text-sm text-gray-700 hidden sm:inline-block">Tandai</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>