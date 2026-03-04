<script setup>
    import Bar from '../../Bar/Bar.vue';
    import Nav from '../../Bar/Nav.vue';
    import { ref, onMounted, computed } from 'vue';
    import { api } from '../../../components/utils/helper';
    import { Icon } from '@iconify/vue';

    const listUser = ref([])
    const filterRole = ref("" || "member")

    const getListUser = async () => {
        try{
            const res = await api.get("/user")
            listUser.value = res.data.data
        }
        catch(err){
            console.log(err)
        }
    }

    onMounted(() => {
        getListUser()
    })

    const filter = computed(() => {
        return listUser.value.filter(user => user.role === filterRole.value)
    })

    const buttonColor = (active) => {
        return [
            "py-2 rounded-xl font-bold m-1 text-md w-full", filterRole.value === active ? 'text-yellow-500 bg-white rounded-xl m-1' : 'text-blue-950'
        ]
    }

</script>

<template>
    <div class="bg-linear-to-r from-white to-gray-200 min-h-screen h-full">
        <Bar />
        <Nav />
    
        <div class="pt-25 flex flex-col gap-5">
            <h3 class="font-extrabold text-center text-3xl text-gray-700/90">List User</h3>
            <div class="flex justify-center">
                <div class="lg:grid lg:grid-cols-2 flex w-full shadow-lg justify-around ml-4 mr-4 lg:w-1/3 bg-gray-300 rounded-2xl p-1">
                    <button @click="filterRole = 'member'" :class="buttonColor('member')">Member</button>
                    <button @click="filterRole = 'admin'" :class="buttonColor('admin')">Admin</button>
                </div>
            </div>

            <div v-if="listUser.length" class="grid grid-cols-1 lg:grid-cols-4 gap-10 pl-5 pr-5">
                <div v-for="user in filter" class="bg-linear-to-b from-blue-950/80 rounded-2xl to-blue-700 flex flex-col gap-2 items-center p-5 shadow-xl">
                    <img src="/F.png" class="w-30 h-30 bg-white rounded-full">
                    <div class="flex flex-col items-center">
                        <h3 class="text-yellow-500 font-extrabold">{{ user.username }}</h3>
                        <h3 class="text-gray-200 font-extrabold">{{ user.email }}</h3>
                        <h3 class="text-gray-900 font-extrabold">08xxxxx</h3>
                    </div>
                </div>
            </div>

            <div v-else class="flex text-gray-400 font-extrabold justify-center pt-15 items-center flex-col gap-3">
                <Icon icon="nonicons:not-found-16" width="50" height="50" />
                <h3 class="text-lg">Tidak Ada</h3>
            </div>
        </div>
    </div>
</template>