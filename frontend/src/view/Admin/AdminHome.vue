<script setup>
    import { ref, onMounted } from 'vue';
    import Bar from '../Bar/Bar.vue';
    import { api } from '../../components/utils/helper';
    import { useRouter } from 'vue-router';

    const router = useRouter()
    const message = ref("")
    const reports = ref([])
    const view = ref(false)
    const API_URL = import.meta.env.VITE_API_URL
    const image = ref(null)

    const getReport = async () => {
        try {
            const res = await api.get('/user/report')
            reports.value = res.data.data
        }
        catch (err) {
            if (err.status == 500) {
                message.value = "TIdak Dapat Terhubung Ke Server"
            }
        }
    }

    const viewImage = (url) => {
        view.value = true
        image.value = url
        console.log(url)
    }

    onMounted(() => {
        getReport()
    })

    const handleNavigate = (id) => {
        router.push({
            name: 'Barang',
            state: {id}
        })
    }

</script>

<template>
    <div>
        <Bar />

        <div v-if="view" class="min-h-screen bg-blue-950/60">
            <div class="flex justify-center items-center min-h-screen">
                <div class="bg-black w-75 lg:w-100 rounded-lg pl-5 pr-5 pb-5 pt-3">
                    <button @click="view = false" class="text-white font-bold text-end w-full text-2xl pb-3">X</button>
                    <img :src="`${API_URL}${image}`" class="rounded-lg w-full">
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col gap-10 pt-5 pb-20">
            <div class="flex justify-center">
                <h3 class="text-blue-950 text-4xl font-bold">Laporan Pengguna</h3>
            </div>

            <div class="overflow-auto lg:flex lg:justify-center">
                <table class="min-w-200 min-h-50">
                    <thead class="bg-blue-900 text-white">
                        <tr>
                            <th class="py-1 border-r border-blue-500/30">User</th>
                            <th class="py-1 border-r border-blue-500/30">Item</th>
                            <th class="py-1 border-r border-blue-500/30">Proof</th>
                            <th class="py-1 border-r border-blue-500/30">Alasan</th>
                        </tr>
                    </thead>
                    <tbody class="bg-sky-900/10">
                        <tr v-for="report in reports">
                            <td class="text-center font-bold border-r border-blue-500/30">{{ report.user.username }}
                            </td>
                            <td class="border-r border-blue-500/30">
                                <button @click="handleNavigate(report.item.id)" class="flex items-center justify-between p-2 w-full">
                                    <h3 class="font-semibold">{{ report.item.title }}</h3>
                                    <img class="w-20 h-20 rounded-lg" :src="`${API_URL}${report.item.image}`">
                                </button>
                            </td>
                            <td class="border-r border-blue-500/30">
                                <div class="flex flex-col justify-center items-center">
                                    <button @click="viewImage(report.proof)">
                                        <img class="w-20 h-20 rounded-lg" :src="`${API_URL}${report.proof}`">
                                    </button>
                                </div>
                            </td>
                            <td class="border-r border-blue-500/30">
                                <div class="flex flex-col justify-center items-center">
                                    <button class="font-bold bg-blue-950/80 text-white py-2 px-5 rounded-lg">View</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>