<script setup>
import { ref, onMounted } from 'vue';
import Bar from '../Bar/Bar.vue';
import { api, getToken, removeToken } from '../../components/utils/helper';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

const router = useRouter()
const message = ref("")
const reports = ref([])
const view = ref(false)
const API_URL = import.meta.env.VITE_API_URL
const image = ref(null)
const title = ref("")
const text = ref("")
const userId = ref("")

const getReport = async () => {
    try {
        const res = await api.get('/user/report')
        reports.value = res.data.data
    }
    catch (err) {
        if (err.status == 500) {
            message.value = "TIdak Dapat Terhubung Ke Server"
        }
        if (err.status == 403 || err.status == 401) {
            message.value = "Anda Tidak Berhak Mengakses Page Ini"
            removeToken()
            router.push("/")
        }
    }
}

const 

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
    if (!getToken()) {
        router.push("/")
    }
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
        <Bar />

        <div v-if="view" class="flex fixed inset-0 z-50 items-center justify-center p-4 sm:p-6">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" @click="view = false">
            </div>

            <div
                class="z-50 bg-gradient-to-br from-slate-900 to-blue-950 w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform transition-all">

                <div class="flex justify-between items-center px-6 py-4 border-b border-white/5">
                    <h3 class="text-white font-semibold text-lg tracking-wide">{{ title }}</h3>
                    <button @click="view = false" class="text-slate-400 hover:text-white transition-colors p-1">
                        <Icon icon="meteor-icons:xmark" width="24" height="24" />
                    </button>
                </div>

                <div class="p-6 space-y-6">
                    <div v-if="image"
                        class="rounded-xl overflow-hidden border border-white/10 shadow-inner bg-black/20">
                        <img :src="`${API_URL}${image}`" class="w-full h-auto object-cover max-h-72">
                    </div>

                    <div v-if="text" class="space-y-4">
                        <div class="bg-blue-900/30 p-4 rounded-xl border border-blue-500/20">
                            <p class="text-slate-400 text-sm uppercase tracking-wider font-medium mb-1">Alasan
                                Peninjauan:</p>
                            <h3 class="text-yellow-400 text-lg leading-relaxed font-semibold">"{{ text }}"</h3>
                        </div>
                        <div class="grid grid-cols-2 gap-4 pt-2">
                            <button
                                class="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-500/20">
                                <span>Ban User</span>
                            </button>
                            <button
                                class="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-red-500/20">
                                <span>Delete Post</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="flex flex-col gap-10 pt-5 pb-20 bg-linear-to-b from-white to-gray-200 dark:bg-linear-to-b dark:from-gray-950/90 dark:to-blue-950 min-h-screen">
            <div class="flex justify-center">
                <h3 class="text-blue-950 dark:text-white text-4xl font-bold">Laporan Pengguna</h3>
            </div>

            <div class="overflow-x-auto lg:flex lg:justify-center px-4">
                <table class="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
                    <thead class="bg-blue-900 text-white">
                        <tr>
                            <th class="px-6 py-4 text-left text-sm font-semibold border-r border-blue-500/30">Reporter
                            </th>
                            <th class="px-6 py-4 text-left text-sm font-semibold border-r border-blue-500/30">Reported
                                User</th>
                            <th class="px-6 py-4 text-left text-sm font-semibold border-r border-blue-500/30">Item</th>
                            <th class="px-6 py-4 text-left text-sm font-semibold border-r border-blue-500/30">Bukti</th>
                            <th class="px-6 py-4 text-left text-sm font-semibold">Alasan</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-if="reports.length" v-for="report in reports" class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 text-center font-bold text-gray-900 border-r border-gray-200">
                                {{ report.user_report.username }}
                            </td>
                            <td class="px-6 py-4 text-center font-bold text-red-600 border-r border-gray-200">
                                {{ report.user.username }}
                            </td>
                            <td class="px-6 py-4 border-r border-gray-200">
                                <button @click="handleNavigate(report.item.id)"
                                    class="flex flex-col items-center gap-3 p-2 w-full hover:bg-gray-100 rounded-lg transition-colors">
                                    <img class="w-16 h-16 rounded-lg object-cover"
                                        :src="`${API_URL}${report.item.image}`" alt="Item">
                                    <h3 class="font-semibold text-blue-600">{{ report.item.title }}</h3>
                                </button>
                            </td>
                            <td class="px-6 py-4 border-r border-gray-200">
                                <div class="flex justify-center">
                                    <button @click="handleView('image', report.proof)"
                                        class="hover:scale-105 transition-transform">
                                        <img class="w-16 h-16 rounded-lg object-cover shadow-md"
                                            :src="`${API_URL}${report.proof}`" alt="Proof">
                                    </button>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex justify-center">
                                    <button @click="handleView('text', report.reason, report.user.id)"
                                        class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors">
                                        Lihat Alasan
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-else>
                            <td class="px-6 py-4 text-center font-bold text-gray-500 text-lg" colspan="5">
                                Tidak ada laporan
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>