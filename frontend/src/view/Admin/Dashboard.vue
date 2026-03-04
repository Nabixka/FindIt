<script setup>
    import Bar from '../Bar/Bar.vue';
    import { ref, onMounted, computed } from 'vue';

    const active = ref(false)

</script>

<template>
    <div class="bg-linear-to-r from-white to-gray-200 min-h-screen h-full">
        <Bar />
        <div v-if="active == false"  class="pt-10">
            <div class="flex pb-10 justify-center">
                <h3 class="font-extrabold text-center text-3xl text-gray-700/90">Laporan Pengguna Meresahkan</h3>
            </div>
            <div class="bg-blue-950 rounded-t-[3.5rem] min-h-screen pb-24 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 pl-10 pr-10 pt-10">
                    <div class="bg-gray-900/50 rounded-2xl pl-5 pt-5 pb-5 overflow-hidden flex items-center flex-col break-words text-center">
                        <img src="/F.png" class="w-30 bg-white rounded">
                        <h3 class="text-white font-semibold">Username: <strong>Joko</strong></h3>
                        <h3 class="text-white font-semibold">Email: <strong>joko@gmail.com</strong></h3>
                        <div class="flex flex-col pt-2 break-words">
                            <h3 class="text-yellow-500 font-bold text-lg">Alasan</h3>
                            <h3 class="text-white break-words break-all pr-5">
                                Alasanadskljjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj
                            </h3>
                        </div>
                        <button @click="active = true" class="mt-4 py-2 px-2 bg-red-500 rounded-lg text-white font-extrabold mr-5">Apakah Anda Ingin Menghapus User Tersebut?</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-else class="flex justify-center items-center h-screen">
            <div class="bg-linear-to-b rounded-2xl flex flex-col justify-between from-blue-950/80 to-blue-950 lg:w-1/3 ml-5 mr-5 h-100">
                <h3 class="font-bold text-white text-center pt-5 text-2xl">Hapus Pengguna?</h3>
                <div class="pl-5">
                    <h3 class="text-white font-semibold">Username: <strong>Joko</strong></h3>
                    <h3 class="text-white font-semibold">Email: <strong>joko@gmail.com</strong></h3>
                    <div class="flex flex-col pt-2 break-words">
                        <h3 class="text-white break-words break-all pr-5">Alasan : Alasanadskljjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj</h3>
                    </div>
                </div>
                <div class="font-bold flex gap-5 justify-end pr-5 pb-5">
                    <button class="bg-gray-300 w-1/4 py-1 rounded-lg" @click="active = false">Batal</button>
                    <button class="bg-red-700 w-1/4 py-1 text-white rounded-lg">Ya</button>
                </div>
            </div>
        </div>
    </div>
</template>