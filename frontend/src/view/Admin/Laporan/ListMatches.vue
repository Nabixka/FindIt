<script setup>
    import { useRouter } from 'vue-router';
    import Bar from '../../Bar/Bar.vue';
    import Nav from '../../Bar/Nav.vue';
    import { ref, onMounted } from 'vue'
    import { api } from '../../../components/utils/helper';
    import { Icon } from '@iconify/vue';

    const matches = ref([])
    const router = useRouter()
    const isLoading = ref(true)
    const isScanning = ref(false)
    const message = ref("")

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
        finally{
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
        finally{
            isScanning.value = false
        }
    }

    const sendMatchToUser = async (matchId, userId) => {
        try {
            const confirmed = confirm("Kirim match ini ke user?")
            if (!confirmed) return

            const res = await api.post("/match/send", { 
                match_id: matchId, 
                user_id: userId 
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
    <div class="dark:bg-linear-to-b dark:from-gray-950/90 dark:to-blue-950 bg-linear-to-r from-white to-gray-200 min-h-screen">
        <Nav />
        <Bar />

        <div class="pt-25">
            <h3 class="font-extrabold dark:text-white text-center pb-3 text-3xl text-gray-700/90">Matching Items</h3>
            
            <div v-if="message" class="m-4 p-3 rounded-lg" :class="message.includes('Gagal') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">
                {{ message }}
            </div>

            <div class="flex justify-center gap-2 pb-5 px-4">
                <button 
                    @click="scanMatches"
                    :disabled="isScanning"
                    class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-semibold transition-all">
                    <Icon icon="solar:reload-linear" width="20" />
                    {{ isScanning ? 'Scanning...' : 'Scan Matches' }}
                </button>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="space-y-4 p-5">
                <div v-for="n in 3" :key="n" class="dark:bg-white/10 bg-white p-4 rounded-2xl animate-pulse">
                    <div class="flex gap-4">
                        <div class="w-20 h-20 rounded-xl bg-gray-400"></div>
                        <div class="flex-1">
                            <div class="h-4 bg-gray-400 rounded w-1/2 mb-2"></div>
                            <div class="h-3 bg-gray-300 rounded w-full mb-2"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Data List -->
            <div v-else-if="matches.length" class="space-y-4 p-5">
                <div v-for="match in matches" :key="match.id" 
                    class="dark:bg-white/10 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-blue-100">
                    
                    <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <!-- Item 1 (Kiri) -->
                        <div class="flex-1 w-full">
                            <div class="flex gap-3">
                                <img class="w-16 h-16 object-cover rounded-xl shadow-sm" 
                                    :src="match.item1_image"
                                    onerror="this.src='https://placehold.co/200x200?text=No+Image'">
                                <div class="flex-1">
                                    <h4 class="dark:text-white text-blue-950 font-bold text-sm leading-tight">
                                        {{ match.item1_title }}
                                    </h4>
                                    <div class="flex items-center gap-1 mt-1 text-gray-500 text-xs">
                                        <Icon icon="solar:map-point-bold-duotone" class="text-yellow-500" width="14" />
                                        <span>{{ match.item1_location }}</span>
                                    </div>
                                    <p class="text-[10px] text-gray-400 mt-1">Oleh: {{ match.user1_name }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Match Type & Score (Tengah) -->
                        <div class="flex flex-row md:flex-col items-center justify-center bg-gray-50 dark:bg-white/5 rounded-xl px-4 py-2 min-w-[100px]">
                            <div :class="`px-2 py-1 rounded-full text-xs font-bold ${getSimilarityBadgeColor(match.similarity_score)}`">
                                {{ (match.similarity_score * 100).toFixed(0) }}%
                            </div>
                            <p class="text-[10px] text-gray-500 mt-1 capitalize font-medium">{{ match.match_type }}</p>
                        </div>

                        <!-- Item 2 (Kanan) -->
                        <div class="flex-1 w-full">
                            <div class="flex gap-3 md:flex-row-reverse">
                                <img class="w-16 h-16 object-cover rounded-xl shadow-sm" 
                                    :src="match.item2_image"
                                    onerror="this.src='https://placehold.co/200x200?text=No+Image'">
                                <div class="flex-1 md:text-right">
                                    <h4 class="dark:text-white text-blue-950 font-bold text-sm leading-tight">
                                        {{ match.item2_title }}
                                    </h4>
                                    <div class="flex items-center gap-1 mt-1 text-gray-500 text-xs md:justify-end">
                                        <Icon icon="solar:map-point-bold-duotone" class="text-yellow-500" width="14" />
                                        <span>{{ match.item2_location }}</span>
                                    </div>
                                    <p class="text-[10px] text-gray-400 mt-1">Oleh: {{ match.user2_name }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
                        <template v-if="!match.is_sent">
                            <button 
                                @click="sendMatchToUser(match.id, match.item_id_1)"
                                class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all text-xs font-semibold">
                                <Icon icon="solar:send-linear" width="14" />
                                Kirim ke {{ match.user1_name }}
                            </button>
                            <button 
                                @click="sendMatchToUser(match.id, match.item_id_2)"
                                class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all text-xs font-semibold">
                                <Icon icon="solar:send-linear" width="14" />
                                Kirim ke {{ match.user2_name }}
                            </button>
                        </template>
                        <span v-else class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-white/5 text-gray-500 rounded-lg text-xs font-semibold">
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
                <p class="text-gray-400 text-sm text-center mt-2">Klik tombol "Scan Matches" untuk mencari items yang mirip</p>
            </div>
        </div>
    </div>
</template>