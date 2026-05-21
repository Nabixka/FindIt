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
    const startDate = ref("")
    const endDate = ref("")
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

        return listItem.value
            .filter(item => item.status === selectedFilter.value)
            .filter(item => {
                if (!term) return true
                return item.title.toLowerCase().includes(term)
                    || item.location.toLowerCase().includes(term)
            })
            .filter(item => {
                if (!startDate.value && !endDate.value) return true

                const itemDate = new Date(item.event_date)
                const start = startDate.value ? new Date(startDate.value) : null
                const end = endDate.value ? new Date(endDate.value) : null

                if (start && end) {
                    return itemDate >= start && itemDate <= end
                }

                if (start) {
                    return itemDate >= start
                }

                if (end) {
                    return itemDate <= end
                }

                return true
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

        <div class="pt-24 pb-20 bg-linear-to-b from-white to-gray-200 dark:bg-linear-to-b dark:from-gray-950/90 dark:to-blue-950 min-h-screen">
            <div class="max-w-7xl mx-auto px-4">
                <div class="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                    <aside class="space-y-6">
                        <div class="rounded-3xl bg-white/95 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                            <div class="text-center">
                                <h2 class="text-2xl font-bold text-slate-950 dark:text-white">Filter Item</h2>
                                <p class="mt-2 text-sm text-slate-500 dark:text-slate-300">Cari dengan cepat berdasarkan status dan lokasi.</p>
                            </div>
                            <div class="mt-6 space-y-4">
                                <div class="flex gap-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-700 rounded-3xl p-3">
                                    <Icon icon="solar:search-bold" width="20" class="text-sky-500" />
                                    <input v-model="search" type="text" placeholder="Cari judul atau lokasi item..."
                                        class="w-full bg-transparent outline-none text-slate-800 dark:text-white placeholder:text-slate-400" />
                                </div>
                                <div class="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950/70 rounded-3xl p-3 border border-slate-200 dark:border-slate-700">
                                    <button @click="selectedFilter = 'lost'" :class="buttonColor('lost')" class="py-3">Kehilangan</button>
                                    <button @click="selectedFilter = 'found'" :class="buttonColor('found')" class="py-3">Penemuan</button>
                                </div>
                                <div class="grid gap-3 bg-slate-50 dark:bg-slate-950/70 rounded-3xl p-4 border border-slate-200 dark:border-slate-700">
                                    <div class="space-y-2">
                                        <label class="text-xs uppercase tracking-[0.18em] text-slate-500">Tanggal Mulai</label>
                                        <input v-model="startDate" type="date"
                                            class="w-full rounded-3xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/80 text-slate-900 dark:text-white py-3 px-4 outline-none" />
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-xs uppercase tracking-[0.18em] text-slate-500">Tanggal Akhir</label>
                                        <input v-model="endDate" type="date"
                                            class="w-full rounded-3xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/80 text-slate-900 dark:text-white py-3 px-4 outline-none" />
                                    </div>
                                    <button @click="startDate = ''; endDate = ''"
                                        class="w-full text-sm font-semibold text-blue-950 bg-white rounded-3xl py-3 transition hover:bg-blue-50">
                                        Reset Tanggal
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="rounded-3xl bg-white/95 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                            <p class="text-sm font-semibold text-slate-600 dark:text-slate-300">Statistik</p>
                            <div class="mt-4 grid gap-4">
                                <div class="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-4">
                                    <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Total Item</p>
                                    <p class="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{{ listItem.length }}</p>
                                </div>
                                <div class="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-4">
                                    <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Ditampilkan</p>
                                    <p class="mt-2 text-3xl font-bold text-sky-600 dark:text-sky-300">{{ filteredList.length }}</p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main class="space-y-6">
                        <section class="rounded-3xl bg-white/95 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                            <div class="grid gap-4 md:grid-cols-3">
                                <div class="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-4">
                                    <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Filter Aktif</p>
                                    <p class="mt-2 text-xl font-bold text-amber-500">{{ statusLabel(selectedFilter) }}</p>
                                </div>
                                <div class="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-4">
                                    <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Total Item</p>
                                    <p class="mt-2 text-xl font-bold text-slate-900 dark:text-white">{{ listItem.length }}</p>
                                </div>
                                <div class="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-4">
                                    <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Tampil</p>
                                    <p class="mt-2 text-xl font-bold text-sky-600 dark:text-sky-300">{{ filteredList.length }}</p>
                                </div>
                            </div>
                        </section>

                        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            <div v-for="n in 4" :key="n" class="rounded-3xl bg-white/95 dark:bg-slate-900/85 p-5 shadow-sm animate-pulse">
                                <div class="h-48 w-full rounded-3xl bg-gray-300"></div>
                                <div class="mt-4 h-5 w-3/4 rounded bg-gray-300"></div>
                                <div class="mt-3 h-4 w-1/2 rounded bg-gray-300"></div>
                            </div>
                        </div>

                        <div v-else-if="filteredList.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            <button v-for="item in filteredList" :key="item.id" @click="handleNavigate(item.id)"
                                class="group flex flex-col bg-white dark:bg-slate-900/90 p-4 rounded-3xl shadow-sm hover:shadow-md transition-all active:scale-95 border border-transparent hover:border-blue-100">
                                <img class="w-full h-48 object-cover rounded-3xl shadow-sm" :src="`${item.image}`" onerror="this.src='https://placehold.co/200x200?text=No+Image'" />
                                <div class="mt-4 flex-1">
                                    <h3 class="text-lg font-bold text-slate-950 dark:text-white group-hover:text-blue-700 transition-colors">{{ item.title }}</h3>
                                    <div class="flex items-center gap-2 mt-3 text-slate-500 dark:text-slate-400 text-sm">
                                        <Icon icon="solar:map-point-bold-duotone" class="text-yellow-500" width="16" />
                                        <span>{{ item.location }}</span>
                                    </div>
                                </div>
                                <div class="mt-4 inline-flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                                    <span :class="`px-3 py-1 rounded-full ${statusClass(item.status)}`">{{ statusLabel(item.status) }}</span>
                                    <Icon icon="solar:alt-arrow-right-linear" width="20" class="text-slate-400 group-hover:text-blue-500" />
                                </div>
                            </button>
                        </div>

                        <div v-else class="flex flex-col items-center justify-center gap-3 p-10 text-center text-slate-500 dark:text-slate-300 rounded-3xl bg-white/90 dark:bg-slate-900/80 shadow-sm">
                            <Icon icon="nonicons:not-found-16" width="52" height="52" class="text-slate-400" />
                            <p class="text-lg font-semibold">Tidak ada barang yang cocok dengan filter Anda.</p>
                            <p class="max-w-lg text-sm">Ubah kata kunci pencarian atau pilih status lain untuk melihat lebih banyak barang.</p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    </div>
</template>