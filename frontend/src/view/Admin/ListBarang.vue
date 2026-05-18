<script setup>
    import { useRouter } from 'vue-router';
    import Bar from '../Bar/Bar.vue';
    import Nav from '../Bar/Nav.vue';
    import { ref, onMounted, computed } from 'vue'
    import { Icon } from '@iconify/vue';
    import { api } from '../../components/utils/helper';
    
    const listItem = ref([])
    const router = useRouter()
    const search = ref("")
    const selectedFilter = ref("lost")
    const isLoading = ref(true)

    const getListItem = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 2000))
            const res = await api.get("/item")
            listItem.value = res.data.data
        }
        catch (err) {
            console.log(err)
        }
        finally{
            isLoading.value = false
        }
    }
    
    const filteredList = computed(() => {
        const term = search.value.toLowerCase().trim()
        return listItem.value.filter(item => item.status === selectedFilter.value)
            .filter(item => {
                if (!term) return true
                return item.title.toLowerCase().includes(term)
                    || item.location.toLowerCase().includes(term)
            })
    })
    
    const statusLabel = (status) => status === 'lost' ? 'Kehilangan' : 'Penemuan'
    const statusClass = (status) => status === 'lost'
        ? 'bg-red-100 text-red-700'
        : 'bg-emerald-100 text-emerald-700'
    
    onMounted(() => {
        getListItem()
    })
    
    const handleNavigate = (id) => {
        router.push({
            name: "Barang",
            state: { id }
        })
    }
    
    const buttonColor = (active) => {
        return [
            "py-2 rounded-xl font-bold m-1 text-md w-full", selectedFilter.value === active ? "bg-white text-yellow-500" : "text-blue-950"
        ]
    }

</script>

<template>
    <div
        class="dark:bg-linear-to-b dark:from-gray-950/90 dark:to-blue-950 bg-linear-to-r from-white to-gray-200 min-h-screen">
        <Nav />
        <Bar />

        <div class="pt-24">
            <div class="max-w-6xl mx-auto px-4">
                <div class="flex flex-col gap-4 items-center text-center">
                    <h3 class="font-extrabold dark:text-white text-3xl text-gray-700/90">List Barang</h3>
                    <p class="text-sm text-gray-500 dark:text-slate-300 max-w-2xl">
                        Telusuri semua barang yang dilaporkan, gunakan filter status dan pencarian cepat untuk menemukan
                        item lebih mudah.
                    </p>
                </div>

                <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_2fr] items-center">
                    <div
                        class="flex gap-2 bg-white/95 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-3 shadow-sm">
                        <Icon icon="solar:search-bold" width="20" class="text-sky-500" />
                        <input v-model="search" type="text" placeholder="Cari judul atau lokasi item..."
                            class="w-full bg-transparent outline-none text-slate-800 dark:text-white placeholder:text-slate-400" />
                    </div>

                    <div class="grid grid-cols-2 gap-2 bg-gray-100/80 dark:bg-slate-900/80 rounded-3xl p-2 shadow-sm">
                        <button @click="selectedFilter = 'lost'" :class="buttonColor('lost')">Kehilangan</button>
                        <button @click="selectedFilter = 'found'" :class="buttonColor('found')">Penemuan</button>
                    </div>
                </div>
            </div>

            <div class="max-w-6xl mx-auto px-4 mt-5">
                <div
                    class="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white/95 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                    <div>
                        <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Total Item</p>
                        <p class="text-xl font-bold text-slate-900 dark:text-white">{{ listItem.length }}</p>
                    </div>
                    <div>
                        <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Item Ditampilkan</p>
                        <p class="text-xl font-bold text-sky-600 dark:text-sky-300">{{ filteredList.length }}</p>
                    </div>
                    <div>
                        <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Filter Aktif</p>
                        <p class="text-xl font-bold text-amber-600 dark:text-amber-300">{{ statusLabel(selectedFilter)
                            }}</p>
                    </div>
                </div>
            </div>

            <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-4 p-5">
                <div v-for="n in 4" :key="n" class="dark:bg-white/10 bg-white p-4 rounded-3xl flex group gap-4">
                    <div class="w-20 h-20 rounded-2xl bg-gray-400 animate-pulse"></div>
                    <div class="w-2/3 flex flex-col gap-2">
                        <div class="w-1/2 h-5 bg-gray-400 animate-pulse rounded"></div>
                        <div class="flex gap-1 w-full">
                            <div class="w-5 h-5 rounded-full bg-gray-400 animate-pulse"></div>
                            <div class="w-2/3 h-5 bg-gray-400 animate-pulse rounded"></div>
                        </div>
                        <div class="w-1/3 h-5 bg-gray-400 animate-pulse rounded"></div>
                    </div>
                </div>
            </div>

            <div v-else-if="filteredList.length" class="pb-25 grid grid-cols-1 lg:grid-cols-3 gap-4 p-5">
                <button v-for="item in filteredList" :key="item.id" @click="handleNavigate(item.id)"
                    class="group flex gap-4 dark:bg-white/10 bg-white p-4 rounded-3xl shadow-sm hover:shadow-md transition-all active:scale-95 border border-transparent hover:border-blue-100">
                    <div class="relative shrink-0">
                        <img class="w-20 h-20 object-cover rounded-2xl shadow-sm" :src="`${item.image}`"
                            onerror="this.src='https://placehold.co/200x200?text=No+Image'">
                    </div>

                    <div class="flex flex-col justify-between py-1 text-left w-full">
                        <div>
                            <h3
                                class="dark:text-white text-blue-950 font-bold text-lg leading-tight group-hover:text-blue-700 transition-colors">
                                {{ item.title }}
                            </h3>
                            <div class="flex items-center gap-1 mt-1 text-gray-400">
                                <Icon icon="solar:map-point-bold-duotone" class="text-yellow-500" width="18" />
                                <span class="text-sm font-medium">{{ item.location }}</span>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 mt-2">
                            <span
                                :class="`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusClass(item.status)}`">
                                {{ statusLabel(item.status) }}
                            </span>
                        </div>
                    </div>

                    <div class="flex items-center pr-2 text-gray-300 group-hover:text-blue-500">
                        <Icon icon="solar:alt-arrow-right-linear" width="20" />
                    </div>
                </button>
            </div>

            <div v-else
                class="flex flex-col items-center justify-center gap-3 p-10 text-center text-slate-500 dark:text-slate-300">
                <Icon icon="nonicons:not-found-16" width="52" height="52" class="text-slate-400" />
                <p class="text-lg font-semibold">Tidak ada barang yang cocok dengan filter Anda.</p>
                <p class="max-w-lg text-sm">Ubah kata kunci pencarian atau pilih status lain untuk melihat lebih banyak
                    barang.</p>
            </div>
        </div>
    </div>
</template>