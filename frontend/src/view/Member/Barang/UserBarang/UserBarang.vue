<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { api } from '../../../../components/utils/helper';
    import { useRouter } from 'vue-router';
    import Bar from '../../../Bar/Bar.vue';
    import Nav from '../../../Bar/Nav.vue';
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
        finally{
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

    onMounted(() => {
        getItem()
        getMatchedItems()
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
            <div class="bg-linear-to-b from-gray-200 to-gray-500/50 dark:bg-linear-to-b dark:from-gray-950/20 dark:to-gray-950/40 w-full ml-5 mr-5 pb-5 rounded-lg">
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
            </div>
        </div>

        <div v-else class="flex flex-col pt-24 pb-10 px-6 gap-8">
            <div class="space-y-6">
                <h3
                    class="text-center text-blue-950 dark:text-white text-3xl font-black tracking-tight">
                    Barang Saya
                </h3>

                <div
                    class="bg-gray-200/80 p-1.5 rounded-2xl grid grid-cols-2 gap-2 max-w-md mx-auto shadow-inner">
                    <button @click="selectedItem = 'lost'" :class="buttonColor('lost')">
                        Kehilangan
                    </button>
                    <button @click="selectedItem = 'found'" :class="buttonColor('found')">
                        Temuan
                    </button>
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div v-for="n in 4" :key="n" class="flex rounded justify-between items-center p-2 dark:bg-white/10 w-full gap-2 h-30 bg-gray-200">
                            <div class="w-35 h-25 rounded bg-gray-400 animate-pulse"></div>
                            <div class="w-full flex flex-col gap-2">
                                <div class="w-full h-7 rounded bg-gray-400 animate-pulse"></div>
                                <div class="w-full h-5 rounded bg-gray-400 animate-pulse"></div>
                            </div>
                            <div class="w-10 h-7 bg-gray-400 animate-pulse rounded"></div>
                        </div>
                    </div>
                <div v-else-if="filter.length" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div v-for="item in filter" class="flex justify-between dark:bg-white/10 bg-gray-200 py-2 rounded-lg pl-2">
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
                    </div>
                </div>

                <div v-else
                    class="flex flex-col items-center justify-center pt-20 opacity-40">
                    <Icon icon="solar:box-minimalistic-bold-duotone" width="100" class="text-blue-950" />
                    <h3 class="text-blue-950 text-xl font-bold mt-4">Belum ada laporan</h3>
                    <p class="text-gray-500 text-sm">Laporan temuan Anda akan muncul di sini</p>
                </div>
            </div>

            <!-- Matched Items Section -->
            <div v-if="matchedItems.length" class="mt-12 pt-8 border-t-2 border-gray-300 dark:border-gray-700">
                <h3 class="text-center text-blue-950 dark:text-white text-2xl font-bold mb-6 flex items-center justify-center gap-2">
                    <Icon icon="solar:check-circle-bold" class="text-green-500" width="28" />
                    Barang yang Sesuai
                </h3>
                
                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div v-for="match in matchedItems" :key="match.id" 
                        class="dark:bg-white/5 bg-green-50 border border-green-200 dark:border-green-900/30 p-4 rounded-lg hover:shadow-md transition-all">
                        
                        <div class="flex items-center justify-between mb-3">
                            <p class="text-xs font-semibold text-green-600 dark:text-green-400">MATCH DITEMUKAN</p>
                            <span class="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-bold">
                                {{ (match.similarity_score * 100).toFixed(0) }}% Mirip
                            </span>
                        </div>

                        <!-- Check which item belongs to current user -->
                        <div v-if="match.item1.user.id !== $route.params.id" class="space-y-3">
                            <!-- Matched Item (other user's item) -->
                            <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Cocok dengan:</p>
                                <div class="flex gap-3">
                                    <img class="w-16 h-16 object-cover rounded-lg" 
                                        :src="`${match.item2.image}`"
                                        onerror="this.src='https://placehold.co/200x200?text=No+Image'">
                                    <div class="flex-1">
                                        <h4 class="text-blue-950 dark:text-white font-bold text-sm">{{ match.item2.title }}</h4>
                                        <div class="flex items-center gap-1 mt-1 text-gray-500 text-xs">
                                            <Icon icon="solar:map-point-bold-duotone" class="text-yellow-500" width="12" />
                                            <span>{{ match.item2.location }}</span>
                                        </div>
                                        <p class="text-xs text-gray-400 mt-1">Milik: <span class="font-semibold">{{ match.item2.user.username }}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-else class="space-y-3">
                            <!-- Matched Item (other user's item) -->
                            <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Cocok dengan:</p>
                                <div class="flex gap-3">
                                    <img class="w-16 h-16 object-cover rounded-lg" 
                                        :src="`${match.item1.image}`"
                                        onerror="this.src='https://placehold.co/200x200?text=No+Image'">
                                    <div class="flex-1">
                                        <h4 class="text-blue-950 dark:text-white font-bold text-sm">{{ match.item1.title }}</h4>
                                        <div class="flex items-center gap-1 mt-1 text-gray-500 text-xs">
                                            <Icon icon="solar:map-point-bold-duotone" class="text-yellow-500" width="12" />
                                            <span>{{ match.item1.location }}</span>
                                        </div>
                                        <p class="text-xs text-gray-400 mt-1">Milik: <span class="font-semibold">{{ match.item1.user.username }}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Match Details -->
                        <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p class="text-xs text-gray-600 dark:text-gray-400">
                                <span class="font-semibold">Tipe Kecocokan:</span> 
                                <span class="capitalize">{{ match.match_type === 'both' ? 'Nama & Lokasi' : match.match_type === 'title' ? 'Nama Barang' : 'Lokasi' }}</span>
                            </p>
                            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                <span class="font-semibold">Dikirim:</span> 
                                {{ new Date(match.sent_at).toLocaleDateString('id-ID') }}
                            </p>
                        </div>

                        <!-- Contact Button -->
                        <button @click="$router.push({ name: 'Profil', params: { username: match.item1.user.id === $route.params.id ? match.item2.user.username : match.item1.user.username } })"
                            class="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold">
                            <Icon icon="solar:chat-round-linear" width="16" />
                            Hubungi Pemilik
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>