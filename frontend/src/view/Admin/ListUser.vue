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

    const totalAdmins = computed(() => listUser.value.filter(user => user.role === 'admin').length)
    const totalMembers = computed(() => listUser.value.filter(user => user.role === 'member').length)
    
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

        <div class="pt-24 pb-24 bg-linear-to-b from-white to-gray-200 dark:bg-linear-to-b dark:from-gray-950/90 dark:to-blue-950 min-h-screen">
            <div class="max-w-7xl mx-auto px-4">
                <div class="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                    <aside class="space-y-6">
                        <div class="rounded-3xl bg-white/95 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                            <div class="text-center">
                                <h2 class="text-2xl font-bold text-slate-950 dark:text-white">List User</h2>
                                <p class="mt-2 text-sm text-slate-500 dark:text-slate-300">Kelola akun dengan filter role dan pencarian cepat.</p>
                            </div>
                            <div class="mt-6 space-y-4">
                                <div class="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-4">
                                    <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Total Users</p>
                                    <p class="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{{ listUser.length }}</p>
                                </div>
                                <div class="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-4">
                                    <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Admins</p>
                                    <p class="mt-2 text-3xl font-bold text-amber-500">{{ totalAdmins }}</p>
                                </div>
                                <div class="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-4">
                                    <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Members</p>
                                    <p class="mt-2 text-3xl font-bold text-sky-600">{{ totalMembers }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="rounded-3xl bg-white/95 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                            <p class="text-sm font-semibold text-slate-600 dark:text-slate-300">Filter Peran</p>
                            <div class="mt-4 grid gap-3">
                                <button @click="filterRole = 'member'" :class="buttonColor('member')" class="w-full px-4 py-3 rounded-2xl shadow-sm border border-slate-200 transition">Member</button>
                                <button @click="filterRole = 'admin'" :class="buttonColor('admin')" class="w-full px-4 py-3 rounded-2xl shadow-sm border border-slate-200 transition">Admin</button>
                            </div>
                            <div class="mt-6 bg-slate-50 dark:bg-slate-950/70 rounded-3xl p-4">
                                <input v-model="search" type="text" placeholder="Cari username atau email..."
                                    class="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
                            </div>
                        </div>
                    </aside>

                    <main class="space-y-6">
                        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <div v-for="n in 4" :key="n" class="rounded-3xl bg-white/95 dark:bg-slate-900/85 p-6 shadow-sm animate-pulse">
                                <div class="h-32 w-full rounded-3xl bg-gray-300"></div>
                                <div class="mt-6 h-5 w-3/4 rounded bg-gray-300"></div>
                                <div class="mt-3 h-4 w-1/2 rounded bg-gray-300"></div>
                            </div>
                        </div>

                        <div v-else-if="filteredUsers.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <div v-for="user in filteredUsers" :key="user.id"
                                class="rounded-3xl bg-white/95 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col items-center gap-4 text-center">
                                <img src="/F.png" class="w-28 h-28 rounded-full bg-white object-cover" />
                                <div>
                                    <h3 class="text-xl font-bold text-slate-950 dark:text-white">{{ user.username }}</h3>
                                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-300 truncate">{{ user.email }}</p>
                                </div>
                                <span class="text-xs uppercase tracking-[0.2em] bg-slate-100 dark:bg-slate-950/70 text-slate-800 dark:text-white px-3 py-1 rounded-full">{{ user.role }}</span>
                            </div>
                        </div>

                        <div v-else class="flex flex-col items-center justify-center gap-3 p-10 text-center text-slate-500 dark:text-slate-300 rounded-3xl bg-white/90 dark:bg-slate-900/80 shadow-sm">
                            <Icon icon="nonicons:not-found-16" width="50" height="50" />
                            <h3 class="text-lg font-semibold">Tidak ada user yang sesuai</h3>
                            <p class="max-w-md text-sm">Coba ubah kata kunci pencarian atau pilih filter role lain untuk menemukan pengguna.</p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    </div>
</template>