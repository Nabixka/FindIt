<script setup>
    import { getToken, removeToken } from '../../utils/helper';
    import { useRouter} from 'vue-router'
    import Bar from '../Bar/Bar.vue';

    const router = useRouter()

    const token = getToken()

</script>

<template>
    <div class="h-screen bg-gray-200">
        <Bar />
        <div class="flex flex-col gap-15 pt-15">
            <!-- Title -->
            <h3 class="text-yellow-600 text-center text-4xl font-bold">Selamat Datang</h3>

            <!-- Logo & Button -->
            <div class="flex flex-col items-center justify-center gap-6">
                <div>
                    <img class="w-30" src="/Findit.png">
                </div>
                <div class="w-full pl-5 pr-5">
                    <div class="grid grid-cols-2 gap-5 w-full">
                        <button class="bg-yellow-600/80 w-full py-2 rounded-xl text-blue-950 text-xl font-bold">Lost item</button>
                        <button class="bg-yellow-600/80 w-full py-2 rounded-xl text-blue-950 text-xl font-bold">Found Item</button>
                    </div>
                </div>
            </div>

            <!-- List Item -->
            <div class="bg-blue-900/90 min-h-screen h-full rounded-t-4xl">
                <div class="grid grid-cols-1 pt-10 pl-5 pr-5">
                    <div class="flex gap-5 items-center bg-gray-200 p-5 rounded-xl">
                        <img class="w-20 h-20" src="/dompet.jpg">
                        <h3 class="text-xl">Dompet</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
