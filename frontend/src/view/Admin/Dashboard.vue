<script setup>
    import { api } from '../../components/utils/helper';
    import Bar from '../Bar/Bar.vue';
    import { ref, onMounted, computed } from 'vue';
    import { Icon } from '@iconify/vue';
    import { motion } from 'motion-v'

    const listReport = ref([])
    const report = ref({})
    const API_URL = import.meta.env.VITE_API_URL

    const active = ref(false)
    const reportId = ref(null)
    const userId = ref(null)

    const getListReport = async () => {
        try{
            const res = await api.get("/user/report")
            listReport.value = res.data.data
        }
        catch(err){
            console.log(err)
        }
    }

    const getReport = async () => {
        try{
            const res = await api.get(`/user/report/${reportId.value}`)
            report.value = res.data.data
        }
        catch(err){
            console.log(err.message)
        }
    }

    const openModal = async (id) => {
        reportId.value = id
        await getReport()
        active.value = true
    }

    const deleteUser = async (id) => {
        try{
            const res = await api.delete(`/user/${id}`)

            active.value = false
            getListReport()
        }
        catch(err){
            console.log(err)
        }
    }


    onMounted(() => {
        getListReport()
    })

</script>

<template>
    <div class="bg-linear-to-r from-white to-gray-200 min-h-screen h-full pt-5">
        <Bar />
        <div v-if="active == false"  class="pt-10">
            <div class="flex pb-10 justify-center">
                <h3 class="font-extrabold text-center text-3xl text-gray-700/90">Laporan Pengguna Meresahkan</h3>
            </div>
            <div class="bg-blue-950 rounded-t-[3.5rem] min-h-screen pb-24 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
                <div v-if="listReport.length" class="grid grid-cols-1 lg:grid-cols-3 gap-10 pl-10 pr-10 pt-10">
                    <div v-for="list in listReport" :key="list.id" class="flex flex-col bg-blue-800/30 p-3 pt-5 pb-5 gap-3 rounded-lg">
                        <div class="flex gap-5 h-25">
                            <img src="/F.png" class="bg-white rounded-lg w-30">
                            <div class="flex flex-col text-white">
                                <h3 class="break-all">Username: <strong>{{ list.user.username }}</strong></h3>
                                <h3 class="break-all">Email: <strong>{{ list.user.email }}</strong></h3>
                                <h3 class="break-all">Nomor: <strong>08xxxxxx</strong></h3>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-yellow-500 font-bold text-lg">Alasan</h3>
                            <h3 class="text-white break-words break-all">{{ list.reason }}</h3>
                        </div>
                        <button @click="openModal(list.id)" class="bg-linear-to-r from-blue-500 to-blue-400 py-2 rounded-lg">Detail</button>
                    </div>
                </div>
                <div v-else>
                    <div class="text-gray-500 font-extrabold gap-5 flex flex-col items-center justify-center h-screen">
                        <Icon icon="nonicons:not-found-16" width="50" height="50" />
                        <h3 class="text-lg">Tidak Ada Laporan Pengguna Usil</h3>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-else class="flex justify-center items-center h-full pb-20">
            <motion.div :initial="{scale: 0}" :animate="{scale: [0, 1.1, 1], transition: 0.5}" class="bg-linear-to-b rounded-2xl flex flex-col justify-between from-blue-950/80 to-blue-950 lg:w-1/3 ml-5 mr-5 h-full">
                <h3 class="font-bold text-white text-center pt-5 text-2xl">Hapus Pengguna?</h3>
                <div class="pl-5">
                    <h3 class="text-white font-semibold">Username: <strong>{{ report.user.username }}</strong></h3>
                    <h3 class="text-white font-semibold">Email: <strong>{{ report.user.email }}</strong></h3>
                    <div class="flex flex-col pt-2 break-words">
                        <h3 class="text-white break-words break-all pr-5">Alasan : {{ report.reason }}</h3>
                    </div>
                    <div class="flex justify-center">
                        <img class="mt-5 w-50 h-100 mb-5" :src="`${API_URL}${report.proof}`">
                    </div>
                </div>
                <div class="font-bold flex gap-5 justify-end pr-5 pb-5">
                    <button class="bg-gray-300 w-1/4 py-1 rounded-lg" @click="active = false">Batal</button>
                    <button @click="deleteUser(report.user.id)" class="bg-red-700 w-1/4 py-1 text-white rounded-lg">Ya</button>
                </div>
            </motion.div>
        </div>
    </div>
</template>