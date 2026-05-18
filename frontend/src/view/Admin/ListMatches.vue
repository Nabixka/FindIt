<script setup>
import { useRouter } from 'vue-router';
import Bar from '../Bar/Bar.vue';
import Nav from '../Bar/Nav.vue';
import { ref, onMounted, computed } from 'vue';
import { api } from '../../components/utils/helper';
import { Icon } from '@iconify/vue';

const matches = ref([])
const router = useRouter()
const isLoading = ref(true)
const isScanning = ref(false)
const filterStatus = ref('all')
const message = ref("")

const filteredMatches = computed(() => {
    const list = [...matches.value]
    return list.filter(match => {
        if (filterStatus.value === 'sent') return match.is_sent
        if (filterStatus.value === 'unsent') return !match.is_sent
        return true
    }).sort((a, b) => b.similarity_score - a.similarity_score)
})

const totalMatches = computed(() => matches.value.length)
const sentCount = computed(() => matches.value.filter(match => match.is_sent).length)
const unsentCount = computed(() => matches.value.filter(match => !match.is_sent).length)

const getMatches = async () => {
    try {
        isLoading.value = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        const res = await api.get("/match")
        matches.value = res.data.data
    }
    catch (err) {
        console.log(err)
        message.value = "Gagal memuat data matches"
    }
    finally {
        isLoading.value = false
    }
}

const scanMatches = async () => {
    try {
        isScanning.value = true
        const res = await api.post("/match/scan", { threshold: 0.7 })
        message.value = res.data.message
        setTimeout(() => {
            getMatches()
            message.value = ""
        }, 1000)
    }
    catch (err) {
        console.log(err)
        message.value = "Gagal melakukan scan matches"
    }
    finally {
        isScanning.value = false
    }
}

const sendMatchToUser = async (matchId, userId) => {
    try {
        const confirmed = confirm("Kirim match ini ke user?")
        if (!confirmed) return

        const res = await api.post("/match/send", {
            matchId: matchId,
            userId: userId
        })
        message.value = "Match berhasil dikirim!"
        setTimeout(() => {
            getMatches()
            message.value = ""
        }, 1500)
    }
    catch (err) {
        console.log(err)
        message.value = "Gagal mengirim match"
    }
}

const getSimilarityBadgeColor = (score) => {
    if (score >= 0.9) return "bg-green-100 text-green-700"
    if (score >= 0.8) return "bg-yellow-100 text-yellow-700"
    if (score >= 0.7) return "bg-orange-100 text-orange-700"
    return "bg-gray-100 text-gray-700"
}

onMounted(() => {
    getMatches()
})
</script>

<template>
    <div
        class="dark:bg-linear-to-b dark:from-gray-950/90 dark:to-blue-950 bg-linear-to-r from-white to-gray-200 min-h-screen">
        <Nav />
        <Bar />

        <div
            class="pt-24 pb-20 bg-linear-to-b from-white to-gray-200 dark:bg-linear-to-b dark:from-gray-950/90 dark:to-blue-950 min-h-screen">
            <div class="max-w-7xl mx-auto px-4">
                <div class="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                    <aside class="space-y-6">
                        <div
                            class="rounded-3xl bg-white/95 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                            <div class="text-center">
                                <h2 class="text-2xl font-bold text-slate-950 dark:text-white">Matching Items</h2>
                                <p class="mt-2 text-sm text-slate-500 dark:text-slate-300">Kelola hasil matching dengan
                                    cepat dari tampilan desktop.</p>
                            </div>
                            <div class="mt-6 grid gap-3">
                                <div class="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-4">
                                    <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Total Matches</p>
                                    <p class="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{{ totalMatches }}
                                    </p>
                                </div>
                                <div class="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-4">
                                    <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Sudah Terkirim</p>
                                    <p class="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-300">{{
                                        sentCount }}</p>
                                </div>
                                <div class="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-4">
                                    <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Belum Terkirim</p>
                                    <p class="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-300">{{ unsentCount
                                        }}</p>
                                </div>
                            </div>
                        </div>

                        <div
                            class="rounded-3xl bg-white/95 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                            <p class="text-sm font-semibold text-slate-600 dark:text-slate-300">Filter Status</p>
                            <div class="mt-4 grid gap-3">
                                <button @click="filterStatus = 'all'"
                                    :class="filterStatus === 'all' ? 'bg-sky-500 text-white' : 'bg-white/90 text-slate-700'"
                                    class="w-full px-4 py-3 rounded-2xl shadow-sm border border-slate-200 transition">Semua</button>
                                <button @click="filterStatus = 'unsent'"
                                    :class="filterStatus === 'unsent' ? 'bg-amber-500 text-white' : 'bg-white/90 text-slate-700'"
                                    class="w-full px-4 py-3 rounded-2xl shadow-sm border border-slate-200 transition">Belum
                                    Terkirim</button>
                                <button @click="filterStatus = 'sent'"
                                    :class="filterStatus === 'sent' ? 'bg-emerald-500 text-white' : 'bg-white/90 text-slate-700'"
                                    class="w-full px-4 py-3 rounded-2xl shadow-sm border border-slate-200 transition">Sudah
                                    Terkirim</button>
                            </div>
                            <button @click="scanMatches" :disabled="isScanning"
                                class="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 disabled:bg-gray-400 font-semibold transition-all">
                                <Icon icon="solar:reload-linear" width="20" />
                                {{ isScanning ? 'Scanning...' : 'Scan Matches' }}
                            </button>
                        </div>
                    </aside>

                    <div class="space-y-6">
                        <div
                            class="rounded-3xl bg-white/95 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 class="text-2xl font-bold text-slate-950 dark:text-white">Ringkasan Matches</h3>
                                    <p class="text-sm text-slate-500 dark:text-slate-300">Klik tombol untuk memindai
                                        match dan kirim hasil ke user.</p>
                                </div>
                                <div class="flex flex-wrap gap-3">
                                    <span
                                        class="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-950/70 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">Total
                                        {{ totalMatches }}</span>
                                    <span
                                        class="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-200">Sent
                                        {{ sentCount }}</span>
                                </div>
                            </div>
                        </div>

                        <div v-if="isLoading" class="space-y-4 p-5">
                            <div v-for="n in 3" :key="n"
                                class="dark:bg-white/10 bg-white p-4 rounded-2xl animate-pulse">
                                <div class="flex gap-4">
                                    <div class="w-20 h-20 rounded-xl bg-gray-400"></div>
                                    <div class="flex-1">
                                        <div class="h-4 bg-gray-400 rounded w-1/2 mb-2"></div>
                                        <div class="h-3 bg-gray-300 rounded w-full mb-2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-else-if="filteredMatches.length" class="grid gap-4 p-5 lg:grid-cols-2">
                            <div v-for="match in filteredMatches" :key="match.id"
                                class="dark:bg-white/10 bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-blue-100">

                                <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
                                    <!-- Item 1 (Kiri) -->
                                    <div class="flex-1 w-full">
                                        <div class="flex gap-3">
                                            <img class="w-16 h-16 object-cover rounded-xl shadow-sm"
                                                :src="match.item1_image"
                                                onerror="this.src='https://placehold.co/200x200?text=No+Image'">
                                            <div class="flex-1">
                                                <h4
                                                    class="dark:text-white text-blue-950 font-bold text-sm leading-tight">
                                                    {{ match.item1_title }}
                                                </h4>
                                                <div class="flex items-center gap-1 mt-1 text-gray-500 text-xs">
                                                    <Icon icon="solar:map-point-bold-duotone" class="text-yellow-500"
                                                        width="14" />
                                                    <span>{{ match.item1_location }}</span>
                                                </div>
                                                <p class="text-[10px] text-gray-400 mt-1">Oleh: {{ match.user1_name }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Match Type & Score (Tengah) -->
                                    <div
                                        class="flex flex-row md:flex-col w-full md:w-50 items-center justify-center bg-gray-50 dark:bg-white/5 rounded-xl px-4 py-2 min-w-[100px]">
                                        <div
                                            :class="`px-2 py-1 rounded-full text-xs font-bold ${getSimilarityBadgeColor(match.similarity_score)}`">
                                            {{ (match.similarity_score * 100).toFixed(0) }}%
                                        </div>
                                    </div>

                                    <!-- Item 2 (Kanan) -->
                                    <div class="flex-1 w-full">
                                        <div class="flex gap-3 md:flex-row-reverse">
                                            <img class="w-16 h-16 object-cover rounded-xl shadow-sm"
                                                :src="match.item2_image"
                                                onerror="this.src='https://placehold.co/200x200?text=No+Image'">
                                            <div class="flex-1 md:text-right">
                                                <h4
                                                    class="dark:text-white text-blue-950 font-bold text-sm leading-tight">
                                                    {{ match.item2_title }}
                                                </h4>
                                                <div
                                                    class="flex items-center gap-1 mt-1 text-gray-500 text-xs md:justify-end">
                                                    <Icon icon="solar:map-point-bold-duotone" class="text-yellow-500"
                                                        width="14" />
                                                    <span>{{ match.item2_location }}</span>
                                                </div>
                                                <p class="text-[10px] text-gray-400 mt-1">Oleh: {{ match.user2_name }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
                                    <template v-if="!match.is_sent">
                                        <button @click="sendMatchToUser(match.id, match.item_id_1)"
                                            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all text-xs font-semibold">
                                            <Icon icon="solar:send-linear" width="14" />
                                            Kirim ke {{ match.user1_name }}
                                        </button>
                                        <button @click="sendMatchToUser(match.id, match.item_id_2)"
                                            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all text-xs font-semibold">
                                            <Icon icon="solar:send-linear" width="14" />
                                            Kirim ke {{ match.user2_name }}
                                        </button>
                                    </template>
                                    <span v-else
                                        class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-white/5 text-gray-500 rounded-lg text-xs font-semibold">
                                        <Icon icon="solar:check-circle-bold" class="text-green-500" width="16" />
                                        Notifikasi Sudah Terkirim
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div v-else class="flex flex-col items-center justify-center py-20 px-4">
                            <Icon icon="solar:magnifer-linear" class="text-gray-400" width="64" />
                            <p class="text-gray-500 text-center mt-4">Tidak ada matches ditemukan</p>
                            <p class="text-gray-400 text-sm text-center mt-2">Klik tombol "Scan Matches" untuk mencari
                                items yang mirip</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>