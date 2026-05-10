<script setup>

    import { Icon } from '@iconify/vue';
    import Bar from '../../Bar/Bar.vue';
    import { api } from '../../../components/utils/helper';
    import { ref, onMounted} from 'vue';
    import { useRouter } from 'vue-router';

    const { state } = history
    const id = state?.id
    const userId = state?.userId
    const message = ref(null)
    const router = useRouter()
    const fileName = ref(null)
    const profil = ref({})

    const form = ref({
        user_id: userId,
        item_id: id,
        proof: null,
        reason: ''
    })


    const getProfil = async () => {
        try {
            
            const res = await api.get('/user/profil')
            profil.value = res.data.data   
        }
        catch (err) {
            if ( err.status == 500){
                message.value = "Maaf, Terjadi Gangguan Untuk Terhubung Dengan Server"
            }
            if ( err.status == 403 || 401){
                message.value = "Anda Tidak Berhak Mengakses Page Ini"
            }
        }
    }

    const createReport = async () => {
        try {

            const formData = new FormData()
            formData.append('report_user_id', profil.value.id)
            formData.append('user_id', form.value.user_id)
            formData.append('item_id', form.value.item_id)
            formData.append('proof', form.value.proof)
            formData.append('reason', form.value.reason)

            const res = await api.post('/user/report', formData)

            handleNavigate(id)
        }
        catch (err) {
            if (err.status == 500) {
                message.value = "Maaf, Terjadi Gangguan Untuk Terhubung Dengan Server"
            }
            if (err.status == 401) {
                message.value = "Mohon Isi Dengan Benar"
            }
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        form.value.proof = file
        fileName.value = file.name
    }

    const handleNavigate = (id) => {
        router.push({
            name: "Barang",
            state: { id }
        })
    }

    onMounted(() => {
        getProfil()
    })

</script>

<template>
    <div class="dark:bg-linear-to-b dark:from-gray-950/90 dark:to-blue-950 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <Bar />
        <div class="flex justify-center pt-20 px-4 lg:pb-30">
            <div class="dark:bg-white/10 bg-white rounded-xl shadow-2xl flex flex-col w-full max-w-lg gap-6 p-8">
                <h3 class="dark:text-white border-b pb-4 border-gray-300 w-full text-center text-blue-950 text-3xl font-extrabold">
                    Laporkan Pengguna
                </h3>
                <h3 class="dark:text-white font-semibold text-center text-gray-600 text-lg">Tuliskan masalah yang disebabkan pengguna ini</h3>
                
                <div v-if="message" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {{ message }}
                </div>
                
                <form @submit.prevent="createReport" class="w-full flex flex-col gap-6">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2 dark:text-white">Alasan Laporan</label>
                        <textarea v-model="form.reason" 
                                  class="dark:text-white shadow-md w-full pl-4 py-3 h-32 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                                  placeholder="Silahkan tulis laporan Anda di sini..."></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2 dark:text-white">Bukti</label>
                        <div class="w-full border-2 border-dashed border-gray-300 rounded-lg pl-4 pr-4 py-4 hover:border-blue-400 transition-colors">
                            <input @change="handleFileChange" id="img" type="file" accept="image/*" class="hidden">
                            <label for="img" class="block flex justify-between items-center w-full cursor-pointer">
                                <div class="flex flex-col">
                                    <template v-if="fileName">
                                        <h3 class="font-semibold text-blue-600">{{ fileName }}</h3>
                                        <p class="text-sm text-gray-500 dark:text-white">Klik untuk mengganti file</p>
                                    </template>
                                    <template v-else>
                                        <h3 class="font-semibold text-gray-700 dark:text-white/50">Pilih file bukti</h3>
                                        <p class="text-sm text-gray-500">Format: JPG, PNG, GIF (Max 5MB)</p>
                                    </template>
                                </div>
                                <Icon icon="lucide:upload" width="28" height="28" class="text-gray-400" />
                            </label>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 w-full">
                        <button @click="handleNavigate(id)" 
                                type="button"
                                class="bg-gray-500 hover:bg-gray-600 py-3 rounded-lg font-bold text-white transition-colors">
                            Batal
                        </button>
                        <button type="submit" 
                                class="bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                :disabled="!form.reason.trim()">
                            Kirim Laporan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>