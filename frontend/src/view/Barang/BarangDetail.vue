<script setup>
    import { ref, onMounted } from 'vue'
    import { getToken } from '../../components/utils/helper';
    import Bar from '../Bar/Bar.vue';
    import Nav from '../Bar/Nav.vue';
    import { Icon } from '@iconify/vue';
    import { useRouter } from 'vue-router';


    const router = useRouter()
    const API_URL = import.meta.env.VITE_API_URL
    const token = getToken()
    const detail = ref({})

    const getDetail = async () => {
        try {
            if(!token){
                router.push("/")
            }
            const id = history.state?.id
            const res = await fetch(`${API_URL}/item/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const json = await res.json()
            detail.value = json.data
        } catch(err) {
            console.log(err)
        }
    }

    onMounted(() => {
        getDetail()
    })
</script>

<template>
    <div class="bg-gray-50 min-h-screen pb-20">
        <Nav />
        
        <div class="max-w-md mx-auto pt-20 px-4">
            
            <div class="relative group mt-4">
                <div class="absolute top-4 right-4 z-10">
                    <span :class="detail.status === 'lost' ? 'bg-orange-500' : 'bg-blue-600'" 
                          class="px-4 py-1 rounded-full text-white font-bold text-sm shadow-lg uppercase tracking-wider">
                        {{ detail.status }}
                    </span>
                </div>
                <div class="overflow-hidden rounded-3xl shadow-xl border-4 border-white aspect-square bg-white">
                    <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                         :src="`${API_URL}${detail.image}`" 
                         alt="Item Image">
                </div>
            </div>

            <div class="mt-6 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h1 class="text-blue-950 font-extrabold text-3xl leading-tight">
                    {{ detail.title }}
                </h1>
                
                <div class="flex items-center gap-2 mt-3 text-gray-600">
                    <Icon class="text-yellow-500" icon="solar:map-point-bold-duotone" width="24" height="24" />
                    <span class="font-medium text-md">{{ detail.location }}</span>
                </div>

                <div class="mt-6">
                    <h4 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Deskripsi</h4>
                    <p class="text-blue-900/80 leading-relaxed text-lg">
                        {{ detail.description }}
                    </p>
                </div>
            </div>

            <div class="mt-4 bg-blue-50 rounded-2xl p-4 flex items-center justify-between border border-blue-100">
                <div class="flex items-center gap-3">
                    <h3 class="w-10 h-10 bg-blue-950 rounded-full flex items-center justify-center text-white font-bold">P</h3>
                    <div>
                        <p class="text-xs text-blue-900/50 font-bold uppercase">Pelapor</p>
                        <p class="text-blue-950 font-bold">User #{{ detail.user_found_id }}</p>
                    </div>
                </div>
            </div>

            <div class="flex pt-5">
                <button class="flex-1 bg-blue-950 hover:bg-blue-900 transition-colors py-4 font-bold text-white text-lg rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95">
                    <Icon icon="solar:phone-calling-bold" width="24" />
                    Hubungi Pelapor
                </button>
                <button class="bg-white border-2 border-gray-100 p-4 rounded-2xl shadow-sm text-blue-950 active:scale-95">
                    <Icon icon="solar:share-bold" width="24" />
                </button>
            </div>

        </div>

        <Bar />
    </div>
</template>