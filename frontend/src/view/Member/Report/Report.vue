<script setup>
    import Bar from '../../Bar/Bar.vue';
</script>

<template>
    <div class="bg-gray-100 min-h-screen">
        <Bar />
        
        <div class="flex justify-center pt-5">
            <h3 class="text-4xl font-extrabold text-blue-950">Laporan Anda</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-15 pl-10 pr-10">
            <div class="flex p-5 rounded-lg bg-white gap-5">
                <div class="shadow rounded-md">
                    <img class="w-25 h-25" src="/dompet.jpg">
                </div>
                <div class="flex flex-col">
                    <h3 class="font-extrabold text-blue-950">User 1</h3>
                    <h3 class="font-bold text-yellow-700">Dompet</h3>
                    <h3 class="break-words">Blabladnljaslklasdaass;llkdlkajka daddlkajsdhasssssssssssssssssssdsaioh dasiupoooooooooooooooooooooo</h3>
                </div>
            </div>
        </div>
    </div>
</template>