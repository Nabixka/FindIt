<script setup>
    import { ref, onMounted, computed } from 'vue';
    import Nav from '../Bar/Nav.vue';
    import Bar from '../Bar/Bar.vue';
    import { api, getToken, removeToken } from '../../components/utils/helper';
    import { useRouter } from 'vue-router';
    import { Icon } from '@iconify/vue';

    const router = useRouter()

    const message = ref("")
    const reports = ref([])
    const loading = ref(true)
    const search = ref("")

    const view = ref(false)
    const image = ref(null)
    const title = ref("")
    const text = ref("")
    const userId = ref("")
    const token = getToken()

    const filteredReports = computed(() => {
        const term = search.value.toLowerCase().trim()
        return reports.value.filter(report => {
            if (!term) return true
            return report.user_report.username.toLowerCase().includes(term)
                || report.user.username.toLowerCase().includes(term)
                || report.item.title.toLowerCase().includes(term)
        })
    })

    const totalReports = computed(() => reports.value.length)

    const reportImageCount = computed(() => reports.value.filter(report => report.proof).length)

    const getReport = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 2000))
            const res = await api.get('/user/report')
            reports.value = res.data.data
        }
        catch (err) {
            const status = err.response?.status
            if (status === 500) {
                message.value = "Tidak Dapat Terhubung Ke Server"
            }

            if (status === 403 || status === 401) {
                message.value = "Anda Tidak Berhak Mengakses Page Ini"
                removeToken()
                router.push("/")
            }
        }
        finally {
            loading.value = false
        }
    }

    const handleButton = async (event, id) => {
        try{
            if(event == "ban"){
                const res = await api.put(`user/status/${id}`, {status: "banned"})
            }
            if(event == "delete"){
                const res = await api.delete(`user/${id}`)
            }
            view.value = false
            getReport()
        }
        catch(err){

            const status = err.response?.status
            if (status === 500) {
                message.value = "Tidak Dapat Terhubung Ke Server"
            }

            if (status === 403 || status === 401) {
                message.value = "Anda Tidak Berhak Mengakses Page Ini"
                removeToken()
                router.push("/")
            }
        }
    }

    const handleView = async (event, data, user_id) => {
        image.value = ""
        text.value = ""

        if (event === "image") {
            title.value = "Detail Gambar"
            image.value = data
        }

        if (event === "text") {
            title.value = "Detail Alasan"
            text.value = data
            userId.value = user_id
        }

        view.value = true
    }

    onMounted(() => {
        getReport()
    })

    const handleNavigate = (id) => {
        router.push({
            name: 'Barang',
            state: { id }
        })
    }
</script>

<template>
    <div>
        <Nav />
        <Bar />

        <div v-if="view" class="flex fixed inset-0 z-50 items-center justify-center p-4 sm:p-6">

            <div
                class="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
                @click="view = false">
            </div>

            <div
                class="z-50 bg-gradient-to-br from-slate-900 to-blue-950 w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform transition-all">

                <div class="flex justify-between items-center px-6 py-4 border-b border-white/5">
                    <h3 class="text-white font-semibold text-lg tracking-wide">
                        {{ title }}
                    </h3>

                    <button
                        @click="view = false"
                        class="text-slate-400 hover:text-white transition-colors p-1">

                        <Icon
                            icon="meteor-icons:xmark"
                            width="24"
                            height="24" />
                    </button>
                </div>

                <div class="p-6 space-y-6">

                    <div
                        v-if="image"
                        class="rounded-xl overflow-hidden border border-white/10 shadow-inner bg-black/20">

                        <img
                            :src="`${image}`"
                            class="w-full h-auto object-cover max-h-72">
                    </div>

                    <div v-if="text" class="space-y-4">

                        <div class="bg-blue-900/30 p-4 rounded-xl border border-blue-500/20">
                            <p class="text-slate-400 text-sm uppercase tracking-wider font-medium mb-1">
                                Alasan Peninjauan:
                            </p>

                            <h3 class="text-yellow-400 text-lg leading-relaxed font-semibold">
                                "{{ text }}"
                            </h3>
                        </div>

                        <div class="grid grid-cols-2 gap-4 pt-2">

                            <button @click="handleButton('ban', userId)"
                                class="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-500/20">
                                <span>Ban User</span>
                            </button>

                            <button @click="handleButton('delete', userId)"
                                class="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-red-500/20">

                                <span>Delete Post</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-10 pt-24 pb-20 bg-linear-to-b from-white to-gray-200 dark:bg-linear-to-b dark:from-gray-950/90 dark:to-blue-950 min-h-screen">

            <div class="flex flex-col gap-4 items-center">
                <div class="text-center">
                    <h3 class="text-blue-950 dark:text-white text-4xl font-bold">
                        Laporan Pengguna
                    </h3>
                    <p class="text-gray-600 dark:text-slate-300 mt-2 max-w-2xl pl-5 pr-5">
                        Pantau semua laporan pengguna dan kelola bukti dengan cepat dari dashboard admin.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl px-4">
                    <div class="rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                        <p class="text-sm uppercase tracking-[0.2em] text-slate-400">Total Laporan</p>
                        <p class="text-xl font-bold text-slate-900 dark:text-white">{{ totalReports }}</p>
                    </div>
                    <div class="rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                        <p class="text-sm uppercase tracking-[0.2em] text-slate-400">Laporan Tampil</p>
                        <p class="text-xl font-bold text-blue-600 dark:text-sky-300">{{ filteredReports.length }}</p>
                    </div>
                    <div class="rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                        <p class="text-sm uppercase tracking-[0.2em] text-slate-400">Bukti Gambar</p>
                        <p class="text-xl font-bold text-emerald-600 dark:text-emerald-300">{{ reportImageCount }}</p>
                    </div>
                </div>

                <div class="w-full max-w-6xl px-4">
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Cari reporter, target, atau judul item..."
                        class="w-full rounded-3xl dark:text-white/80 border border-slate-300 dark:border-slate-700 bg-white/95 dark:bg-slate-950/90 px-4 py-3 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    />
                </div>
            </div>

            <div class="flex lg:justify-center px-4 mb-10">
                <div class="w-full max-w-6xl">
                    <!-- Loading State -->
                    <template v-if="loading">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div
                                v-for="n in 6"
                                :key="n"
                                class="animate-pulse bg-white dark:bg-slate-800 rounded-xl shadow-md p-4">
                                <div class="h-40 bg-gray-300 rounded-lg mb-4"></div>
                                <div class="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                                <div class="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                                <div class="space-y-2">
                                    <div class="h-8 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- Data Cards -->
                    <template v-else-if="filteredReports.length">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div
                                v-for="report in filteredReports"
                                :key="report.id"
                                class="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-slate-200 dark:border-slate-700">

                                <!-- Item Image -->
                                <button
                                    @click="handleNavigate(report.item.id)"
                                    class="w-full h-40 overflow-hidden hover:opacity-90 transition-opacity">
                                    <img
                                        class="w-full h-full object-cover"
                                        :src="`${report.item.image}`"
                                        alt="Item">
                                </button>

                                <!-- Card Content -->
                                <div class="p-4 space-y-3">
                                    <!-- Item Title -->
                                    <button
                                        @click="handleNavigate(report.item.id)"
                                        class="text-left">
                                        <h3 class="font-semibold text-blue-600 dark:text-sky-300 text-sm hover:underline line-clamp-2">
                                            {{ report.item.title }}
                                        </h3>
                                    </button>

                                    <!-- Reporter Info -->
                                    <div class="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 space-y-1">
                                        <div class="flex justify-between items-start gap-2">
                                            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Reporter</p>
                                            <p class="text-sm font-bold text-slate-900 dark:text-white text-right">
                                                {{ report.user_report.username }}
                                            </p>
                                        </div>
                                        <div class="flex justify-between items-start gap-2">
                                            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Reported</p>
                                            <p class="text-sm font-bold text-red-600 dark:text-red-400 text-right">
                                                {{ report.user.username }}
                                            </p>
                                        </div>
                                    </div>

                                    <!-- Proof Image -->
                                    <button
                                        @click="handleView('image', report.proof)"
                                        class="w-full h-24 rounded-lg overflow-hidden hover:scale-105 transition-transform bg-slate-100 dark:bg-slate-900">
                                        <img
                                            class="w-full h-full object-cover"
                                            :src="`${report.proof}`"
                                            alt="Proof">
                                    </button>

                                    <!-- Reason Button -->
                                    <button
                                        @click="handleView('text', report.reason, report.user.id)"
                                        class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors text-sm">
                                        Lihat Alasan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- Empty State -->
                    <div v-else class="flex items-center justify-center py-12">
                        <p class="text-center font-bold text-gray-500 dark:text-gray-400 text-lg">
                            Tidak ada laporan
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>