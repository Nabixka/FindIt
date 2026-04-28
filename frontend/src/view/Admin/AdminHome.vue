<script setup>
    import { ref, onMounted } from 'vue';
    import Bar from '../Bar/Bar.vue';
    import { api, getToken, removeToken } from '../../components/utils/helper';
    import { useRouter } from 'vue-router';

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
            if(err.status == 403 || err.status == 401){
                message.value = "Anda Tidak Berhak Mengakses Page Ini"
                removeToken()
                router.push("/")
            }
        }
    }

    const handleButton = async (event, id) => {
        try{
            if(event == "delete"){
                const res = await api.delete(`/user/${id}`)
                
                view.value = false
                getReport()
            }
            if(event == "ban"){
                const res = await api.put(`/user/status/${id}`, { status: "banned"})
                
                view.value = false
                getReport()
            }
            else{
                message.value = "What"
            }
        }
        catch(err){
            if (err.status == 500) {
                message.value = "TIdak Dapat Terhubung Ke Server"
            }
            if(err.status == 403 || err.status == 401){
                message.value = "Anda Tidak Berhak Mengakses Page Ini"
                removeToken()
                router.push("/")
            }
            if(err.status == 404){
                message.value = "User Tidak Ada"
            }
        }
    }

    const viewDetail = (type, data, id) => {
        
        title.value = ""
        image.value = null

        if(type == 'image'){
            title.value = "Detail Bukti"
            image.value = data
        }
        if(type == 'text'){
            title.value = "Detail Alasan"
            text.value = data
            userId.value = id
        }

        view.value = true
    }

    onMounted(() => {
        getReport()
        if(!getToken()){
            router.push("/")
        }
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

        <div v-if="view" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div class="bg-white w-full max-w-md rounded-xl shadow-2xl pl-6 pr-6 pb-6 pt-4">
                <div class="flex justify-between items-center border-b-2 border-gray-200 pb-3 mb-4">
                    <h3 class="font-semibold text-xl text-gray-800">{{ title }}</h3>
                    <button @click="view = false" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
                </div>
                <img v-if="image" :src="`${API_URL}${image}`" class="w-full rounded-lg shadow-md mb-4">
                <div v-else>
                    <h3 class="text-gray-700 mb-4 break-words">{{ text }}</h3>
                    <div class="flex gap-3">
                        <button @click="handleButton('ban', userId)" 
                                class="flex-1 bg-yellow-500 hover:bg-yellow-600 py-3 rounded-lg border-2 border-red-500 font-bold text-lg text-white transition-colors">
                            Ban User
                        </button>
                        <button @click="handleButton('delete', userId)" 
                                class="flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-lg border-2 border-yellow-500 font-bold text-lg text-white transition-colors">
                            Delete User
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col gap-10 pt-5 pb-20 bg-gray-50 min-h-screen">
            <div class="flex justify-center">
                <h3 class="text-blue-950 text-4xl font-bold">Laporan Pengguna</h3>
            </div>

            <div class="overflow-x-auto lg:flex lg:justify-center px-4">
                <table class="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
                    <thead class="bg-blue-900 text-white">
                        <tr>
                            <th class="px-6 py-4 text-left text-sm font-semibold border-r border-blue-500/30">Reporter</th>
                            <th class="px-6 py-4 text-left text-sm font-semibold border-r border-blue-500/30">Reported User</th>
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
                                <button @click="handleNavigate(report.item.id)" class="flex flex-col items-center gap-3 p-2 w-full hover:bg-gray-100 rounded-lg transition-colors">
                                    <img class="w-16 h-16 rounded-lg object-cover" :src="`${API_URL}${report.item.image}`" alt="Item">
                                    <h3 class="font-semibold text-blue-600">{{ report.item.title }}</h3>
                                </button>
                            </td>
                            <td class="px-6 py-4 border-r border-gray-200">
                                <div class="flex justify-center">
                                    <button @click="viewDetail('image', report.proof)" class="hover:scale-105 transition-transform">
                                        <img class="w-16 h-16 rounded-lg object-cover shadow-md" :src="`${API_URL}${report.proof}`" alt="Proof">
                                    </button>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex justify-center">
                                    <button @click="viewDetail('text', report.reason, report.user.id)" 
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