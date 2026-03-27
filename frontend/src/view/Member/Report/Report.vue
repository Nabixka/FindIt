<script setup>

    import { Icon } from '@iconify/vue';
    import Bar from '../../Bar/Bar.vue';
    import { api } from '../../../components/utils/helper';
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';

    const { state } = history
    const id = state?.id
    const userId = state?.userId
    const message = ref(null)
    const router = useRouter()
    const fileName = ref(null)
    const form = ref({
        user_id: id,
        item_id: userId,
        proof: null,
        reason: ''
    })

    const createReport = async () => {
        try {

            const formData = new FormData()
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

</script>

<template>
    <div class="bg-linear-to-r from-white to-gray-200 min-h-screen">
        <Bar />
        <div class="flex justify-center pt-20">
            <div
                class="bg-white rounded-lg flex lg:justify-center lg:items-center flex-col ml-5 mr-5 lg:w-1/2 gap-5 p-5">
                <h3 class="border-b pb-5 border-gray-300 w-full text-center text-blue-950/80 text-3xl font-extrabold">
                    Laporkan Pengguna</h3>
                <h3 class="font-semibold text-center text-gray-600">Tuliskan Masalah Apa Yang Di Sebabkan Pengguna</h3>
                <form @submit.prevent="createReport" class="w-full flex flex-col gap-5">
                    <textarea v-model="form.reason"  class="shadow w-full pl-5 py-2 h-50 text-start"
                    placeholder="Silahkan Tulis Laporan Anda Disini"></textarea>
                    <div class="w-full outline-dashed outline-gray-300 pl-5 pr-5 py-2">
                        <input @change="handleFileChange" id="img" type="file" class="hidden">
                        <label for="img" class="block flex justify-between w-full">
                            <template v-if="fileName">
                                <h3>{{ fileName }}</h3>
                            </template>
                            <template v-else>
                                <h3>Masukkan Bukti File</h3>
                            </template>
                            <Icon icon="lucide:file-input" width="24" height="24" />
                        </label>
                    </div>
                    <div class="grid grid-cols-2 gap-5 w-full">
                        <button @click="handleNavigate(id)" class="bg-green-800 py-2 rounded-lg font-extrabold text-white">Batal</button>
                        <button class="bg-sky-500 py-2 rounded-lg font-extrabold text-white">Kirim</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>