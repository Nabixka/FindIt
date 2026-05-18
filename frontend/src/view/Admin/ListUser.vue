<script setup>
    import Bar from '../Bar/Bar.vue';
    import Nav from '../Bar/Nav.vue';
    import { ref, onMounted, computed } from 'vue';
    import { api } from '../../components/utils/helper';
    import { Icon } from '@iconify/vue';
    
    const listUser = ref([])
    const filterRole = ref("member")
    const search = ref("")
    const isLoading = ref(true)

    const getListUser = async () => {
        try{
            await new Promise(resolve => setTimeout(resolve, 2000))
            const res = await api.get("/user")
            listUser.value = res.data.data
        }
        catch(err){
            console.log(err)
        }
        finally{
            isLoading.value = false
        }
    }

    const filteredUsers = computed(() => {
        const term = search.value.toLowerCase().trim()
        return listUser.value.filter(user => user.role === filterRole.value)
            .filter(user => {
                if (!term) return true
                return user.username.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
            })
    })
    
    const buttonColor = (active) => {
        return [
            "py-2 rounded-xl font-bold m-1 text-md w-full", filterRole.value === active ? 'text-yellow-500 bg-white rounded-xl m-1' : 'text-blue-950'
        ]
    }
    
    onMounted(() => {
        getListUser()
    })
    
    const filter = computed(() => {
        return listUser.value.filter(user => user.role === filterRole.value)
    })

</script>

<template>
    <div
        class="dark:bg-linear-to-b dark:from-gray-950/90 dark:to-blue-950 bg-linear-to-r from-white to-gray-200 min-h-screen h-full">
        <Bar />
        <Nav />

        <div class="pt-24 flex flex-col gap-5 pb-24">
            <div class="max-w-6xl mx-auto px-4 text-center">
                <h3 class="dark:text-white font-extrabold text-3xl text-gray-700/90">List User</h3>
                <p class="text-sm text-gray-500 dark:text-slate-300 mt-2">Kelola akun user dan admin, gunakan filter
                    peran dan pencarian untuk menemukan data dengan cepat.</p>
            </div>

            <div class="max-w-6xl mx-auto px-4 grid gap-4 lg:grid-cols-[1fr_auto] items-center">
                <div class="flex gap-2 justify-center">
                    <button @click="filterRole = 'member'" :class="buttonColor('member')" class="px-2">Member</button>
                    <button @click="filterRole = 'admin'" :class="buttonColor('admin')" class="px-2">Admin</button>
                </div>
                <div
                    class="bg-white/95 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-3 shadow-sm">
                    <input v-model="search" type="text" placeholder="Cari username atau email..."
                        class="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
                </div>
            </div>

            <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                    class="rounded-3xl bg-white/95 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 p-4 shadow-sm text-center">
                    <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Total Users</p>
                    <p class="text-3xl font-bold text-slate-900 dark:text-white">{{ listUser.length }}</p>
                </div>
                <div
                    class="rounded-3xl bg-white/95 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 p-4 shadow-sm text-center">
                    <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Tampil</p>
                    <p class="text-3xl font-bold text-sky-600 dark:text-sky-300">{{ filteredUsers.length }}</p>
                </div>
                <div
                    class="rounded-3xl bg-white/95 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 p-4 shadow-sm text-center">
                    <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Filter</p>
                    <p class="text-3xl font-bold text-amber-500">{{ filterRole }}</p>
                </div>
            </div>

            <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-4 gap-10 pl-5 pr-5">
                <div v-for="n in 4" :key="n"
                    class="bg-gray-200 rounded-2xl to-blue-950 flex flex-col gap-2 items-center p-5 shadow-xl">
                    <div class="w-30 h-30 rounded-full bg-gray-400 animate-pulse"></div>
                    <div class="flex flex-col w-full gap-2 items-center">
                        <div class="h-5 w-1/3 rounded bg-gray-400"></div>
                        <div class="h-5 w-1/2 rounded bg-gray-400"></div>
                        <div class="h-5 w-1/3 rounded bg-gray-400"></div>
                    </div>
                </div>
            </div>

            <div v-else-if="filteredUsers.length" class="grid grid-cols-1 lg:grid-cols-4 gap-10 pl-5 pr-5">
                <div v-for="user in filteredUsers"
                    class="dark:bg-white/50 bg-linear-to-b from-blue-950/80 rounded-2xl to-blue-950 flex flex-col gap-2 items-center p-5 shadow-xl">
                    <img src="/F.png" class="w-30 h-30 bg-white rounded-full">
                    <div class="flex flex-col items-center gap-2 text-center">
                        <h3 class="text-yellow-500 font-extrabold">{{ user.username }}</h3>
                        <p class="text-gray-200 text-sm font-medium truncate">{{ user.email }}</p>
                        <span
                            class="text-xs uppercase tracking-[0.2em] bg-white/10 text-white px-3 py-1 rounded-full">{{
                            user.role }}</span>
                    </div>
                </div>
            </div>

            <div v-else
                class="flex flex-col items-center justify-center gap-3 p-10 text-center text-slate-500 dark:text-slate-300">
                <Icon icon="nonicons:not-found-16" width="50" height="50" />
                <h3 class="text-lg font-semibold">Tidak ada user yang sesuai</h3>
                <p class="max-w-md text-sm">Coba ubah kata kunci pencarian atau pilih filter role lain untuk menemukan
                    pengguna.</p>
            </div>
        </div>
    </div>
</template>