<script setup>
    import { ref, onMounted } from 'vue';
    import Bar from '../Bar/Bar.vue';
    import Nav from '../Bar/Nav.vue';
    import { api } from '../../components/utils/helper';
    import { useRouter } from 'vue-router';

    const reports = ref([]);
    const message = ref(null);
    const router = useRouter();
    const { state } = history;
    const id = state?.id;
    const isLoading = ref(true)

    const getReports = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 2000))
            const res = await api.get(`/user/report/user/${id}`);
            reports.value = res.data.data;
        } catch (err) {
            if (err.status == 500) {
                message.value = "Maaf, Terjadi Gangguan Untuk Terhubung Dengan Server";
            }
        }
        finally{
            isLoading.value = false
        }
    };

    onMounted(() => {
        getReports();
    });

    const handleNavigate = (id) => {
        router.push({
            name: 'Barang',
            state: { id }
        });
    };
</script>

<template>
    <div class="dark:bg-linear-to-b dark:from-gray-950/90 dark:to-blue-950 bg-gray-100 min-h-screen">
        <Bar />
        <Nav />
        
        <div class="flex justify-center pt-5">
            <h3 class="dark:text-white text-4xl font-extrabold text-blue-950">Laporan Anda</h3>
        </div>

        <div v-if="message" class="flex justify-center pt-5">
            <h3 class="text-red-500 font-semibold">{{ message }}</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-10 pl-10 pr-10 pb-20">
            <div v-if="isLoading" v-for="n in 4" :key="n" class="dark:bg-white/10 bg-white p-5 rounded-lg shadow-lg flex-col">
                <div class="flex items-center gap-5">
                    <div class="rounded-full w-17 h-17 animate-pulse bg-gray-400"></div>
                    <div class="w-2/3 flex flex-col gap-3">
                        <div class="w-1/2 bg-gray-400 animate-pulse h-5 rounded"></div>
                        <div class="w-full bg-gray-400 animate-pulse h-5 rounded"></div>
                    </div>
                </div>
                <div class="flex flex-col gap-2 w-full pt-5">
                    <div class="w-1/3 rounded animate-pulse h-4 bg-gray-400"></div>
                    <div class="w-2/3 rounded animate-pulse h-4 bg-gray-400"></div>
                </div>
                <div class="flex flex-col gap-2 w-full pt-5">
                    <div class="w-1/3 rounded h-4 animate-pulse bg-gray-400"></div>
                    <div class="w-full rounded h-30 animate-pulse bg-gray-400"></div>
                </div>
                <div class="w-full h-10 rounded mt-5 animate-pulse bg-gray-400"></div>
            </div>
            <div v-else-if="reports.length" v-for="report in reports" class="dark:bg-white/10 bg-white rounded-lg shadow-lg p-5 flex flex-col gap-4">
                <div class="flex items-center gap-4">
                    <img class="w-16 h-16 rounded-full object-cover" :src="`${report.item.image}`" alt="Item Image">
                    <div>
                        <h3 class="font-extrabold dark:text-white text-blue-950">{{ report.item.title }}</h3>
                        <h3 class="font-semibold dark:text-red-500 text-red-600 break-words">User yang dilaporkan: <strong>{{ report.user.username }}</strong></h3>
                    </div>
                </div>
                <div>
                    <h4 class="font-bold dark:text-white text-gray-700">Alasan:</h4>
                    <p class="text-sm dark:text-white/70 text-gray-600 break-words">{{ report.reason }}</p>
                </div>
                <div v-if="report.proof">
                    <h4 class="font-bold dark:text-white text-gray-700">Bukti:</h4>
                    <img class="w-full h-32 object-cover rounded-lg" :src="`${report.proof}`" alt="Proof Image">
                </div>
                <button @click="handleNavigate(report.item.id)" class="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition">
                    Lihat Barang
                </button>
            </div>
            <div v-else class="col-span-full flex justify-center items-center py-20">
                <h3 class="text-gray-500 text-lg font-semibold">Belum ada laporan yang Anda buat.</h3>
            </div>
        </div>
    </div>
</template>