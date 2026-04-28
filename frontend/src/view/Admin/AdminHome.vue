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

        <div v-if="view" class="min-h-screen bg-blue-950/60">
            <div class="flex justify-center items-center min-h-screen">
                <div class="bg-white w-75 lg:w-100 rounded-lg pl-5 pr-5 pb-5 pt-3">
                    <div class="flex justify-between items-center border-b-2 border-gray-200 pb-2">
                        <h3 class="font-semibold text-lg">{{ title }}</h3>
                        <button @click="view = false" class="font-bold text-2xl">X</button>
                    </div>
                    <img v-if="image" :src="`${API_URL}${image}`" class="pt-2 rounded-lg w-full">
                    <div v-else class="pt-2">
                        <h3 class="break-all break-words">{{ text }}</h3>
                        <div class="grid grid-cols-2 pt-2 gap-3">
                            <button @click="handleButton('ban', userId)" class="rounded-lg bg-yellow-500 py-2 border-2 border-red-500 font-bold text-lg text-white">Ban</button>
                            <button @click="handleButton('delete', userId)" class="rounded-lg bg-red-500 py-2 border-2 border-yellow-500 font-bold text-lg text-white">Delete</button>
                        </div>
                    </div>
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
                            <th class="border-r border-blue-500/30">User</th>
                            <th class="border-r border-blue-500/30">Item</th>
                            <th class="border-r border-blue-500/30">Proof</th>
                            <th class="border-r border-blue-500/30">Alasan</th>
                        </tr>
                    </thead>
                    <tbody class="bg-sky-900/10">
                        <tr v-if="reports.length" v-for="report in reports">
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
                                    <button @click="viewDetail('image', report.proof)">
                                        <img class="w-20 h-20 rounded-lg" :src="`${API_URL}${report.proof}`">
                                    </button>
                                </div>
                            </td>
                            <td class="border-r border-blue-500/30">
                                <div class="flex flex-col justify-center items-center">
                                    <button @click="viewDetail('text', report.reason, report.user.id)" class="font-bold bg-blue-950/80 text-white py-2 px-5 rounded-lg">View</button>
                                </div>
                            </td>
                        </tr>
                        <tr v-else>
                            <td class="text-center font-bold text-gray-700 text-lg" colspan=4>Tidak Ada</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>