<script setup>
    import Bar from '../../Bar/Bar.vue';

</script>

<template>
    <div class="bg-linear-to-r from-white to-gray-200 min-h-screen">
        <Bar />
        <div class="flex justify-center pt-20">
            <div class="bg-white flex lg:justify-center lg:items-center flex-col ml-5 mr-5 lg:w-1/2 gap-5 p-5">
                <h3 class="border-b pb-5 border-gray-300 w-full text-center text-blue-950/80 text-3xl font-extrabold">Laporkan Pengguna</h3>
                <h3 class="font-semibold text-center text-gray-600">Tuliskan Masalah Apa Yang Di Sebabkan Pengguna</h3>
                <textarea class="shadow w-full pl-5 py-2 h-50 text-start" placeholder="Silahkan Tulis Laporan Anda Disini"></textarea>
                <div class="grid grid-cols-2 gap-5 w-full">
                    <button class="bg-green-800 py-2 rounded-lg font-extrabold text-white">Batal</button>
                    <button class="bg-sky-500 py-2 rounded-lg font-extrabold text-white">Kirim</button>
                </div>
            </div>
        </div>
    </div>
</template>