<script setup>
    import { useRouter } from 'vue-router';
    import Bar from '../Bar/Bar.vue';
    import Nav from '../Bar/Nav.vue';
    import { ref, onMounted, computed } from 'vue'
    import { Icon } from '@iconify/vue';
    import { api } from '../../components/utils/helper';

    const listItem = ref([])
    const router = useRouter()
    const selectedFilter = ref("lost")
    const isLoading = ref(true)

    const getListItem = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 2000))
            const res = await api.get("/item")
            listItem.value = res.data.data
        }
        catch (err) {
            console.log(err)
        }
        finally{
            isLoading.value = false
        }
    }

    onMounted(() => {
        getListItem()
    })

    const handleNavigate = (id) => {
        router.push({
            name: "Barang",
            state: {id}
        })
    }

    const filterItem = computed(() => {
        return listItem.value.filter(item => item.status === selectedFilter.value)
    })

    const buttonColor = (active) => {
        return [
            "py-2 rounded-xl font-bold m-1 text-md w-full", selectedFilter.value === active ? "bg-white text-yellow-500" : "text-blue-950"
        ]
    }

</script>

<template>
    <div class="dark:bg-linear-to-b dark:from-gray-950/90 dark:to-blue-950 bg-linear-to-r from-white to-gray-200 min-h-screen">
        <Nav />
        <Bar />

        <div class="pt-25">
            <h3 class="font-extrabold dark:text-white text-center pb-5 text-3xl text-gray-700/90">List Barang</h3>
            <div class="flex justify-center">
                <div class="lg:grid lg:grid-cols-2 flex w-full justify-around ml-4 mr-4 lg:w-1/3 bg-gray-300 rounded-2xl p-1">
                    <button @click="selectedFilter = 'lost'" :class="buttonColor('lost')">Kehilangan</button>
                    <button @click="selectedFilter = 'found'" :class="buttonColor('found')">Penemuan</button>
                </div>
            </div>

            <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-4 p-5">
                <div v-for="n in 4" :key="n" class="dark:bg-white/10 bg-white p-4 rounded-3xl flex group gap-4">
                    <div class="w-20 h-20 rounded-2xl bg-gray-400 animate-pulse"></div>
                    <div class="w-2/3 flex flex-col gap-2">
                        <div class="w-1/2 h-5 bg-gray-400 animate-pulse rounded"></div>
                        <div class="flex gap-1 w-full">
                            <div class="w-5 h-5 rounded-full bg-gray-400 animate-pulse"></div>
                            <div class="w-2/3 h-5 bg-gray-400 animate-pulse rounded"></div>
                        </div>
                        <div class="w-1/3 h-5 bg-gray-400 animate-pulse rounded"></div>
                    </div>
                </div>
            </div>

            <div v-else-if="listItem.length" class="grid grid-cols-1 lg:grid-cols-3 gap-4 p-5">
                <button v-for="item in filterItem" :key="item.id" @click="handleNavigate(item.id)"
                    class="group flex gap-4 dark:bg-white/10 bg-white p-4 rounded-3xl shadow-sm hover:shadow-md transition-all active:scale-95 border border-transparent hover:border-blue-100">
                    <div class="relative shrink-0">
                        <img class="w-20 h-20 object-cover rounded-2xl shadow-sm" :src="`${item.image}`"
                            onerror="this.src='https://placehold.co/200x200?text=No+Image'">
                    </div>

                    <div class="flex flex-col justify-between py-1 text-left w-full">
                        <div>
                            <h3
                                class="dark:text-white text-blue-950 font-bold text-lg leading-tight group-hover:text-blue-700 transition-colors">
                                {{ item.title }}
                            </h3>
                            <div class="flex items-center gap-1 mt-1 text-gray-400">
                                <Icon icon="solar:map-point-bold-duotone" class="text-yellow-500" width="18" />
                                <span class="text-sm font-medium">{{ item.location }}</span>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 mt-2">
                            <span
                                class="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold uppercase">
                                Aktif
                            </span>
                        </div>
                    </div>

                    <div class="flex items-center pr-2 text-gray-300 group-hover:text-blue-500">
                        <Icon icon="solar:alt-arrow-right-linear" width="20" />
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>