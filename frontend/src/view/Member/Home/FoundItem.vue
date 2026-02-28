<script setup>
    import { getToken, removeToken } from '../../../components/utils/helper';
    import { useRouter} from 'vue-router'
    import Bar from '../../Bar/Bar.vue';
    import { ref, onMounted, computed } from 'vue';
    import { motion } from 'motion-v'
    import { Icon } from '@iconify/vue';

    const router = useRouter()
    const token = getToken()
    const API_URL = import.meta.env.VITE_API_URL
    const category = ref("")
    const search = ref("")

    const items = ref([])
    
    const getItems = async () => {
        try{
            if(!token){
                router.push("/")
            }

            const res = await fetch(`${API_URL}/item/found`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const json = await res.json()
            items.value = json.data

            if(res.status == 401){
                removeToken()
                router.push("/")
            }
        }
        catch(err){
            console.log(err)
        }
    }

    const navigate = (id) => {
        router.push({
            name: "Barang",
            state: {id}
        })
    }

    onMounted(() => {
        getItems()
    })

    const filterItem = computed(() => {
         return items.value.filter(item => {

        // Filter kategori
        const matchCategory = !category.value || 
            item.category?.toLowerCase() === category.value.toLowerCase()

        // Filter search (judul & lokasi)
        const matchSearch =
            !search.value.trim() ||
            item.title?.toLowerCase().includes(search.value.trim().toLowerCase()) ||
            item.location?.toLowerCase().includes(search.value.trim().toLowerCase())


        return matchCategory && matchSearch
    })
    })

</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <Bar />

    <div class="flex flex-col gap-8 pt-10">
      <div class="px-6 text-center">
        <motion.h3 
          :initial="{ opacity: 0, y: -20 }" 
          :animate="{ opacity: 1, y: 0 }" 
          class="text-yellow-600 text-4xl font-extrabold tracking-tight"
        >
          Selamat Datang
        </motion.h3>
        
        <motion.div 
          :initial="{ scale: 0.8, opacity: 0 }" 
          :animate="{ scale: 1, opacity: 1 }" 
          class="mt-6 flex flex-col items-center gap-6"
        >
          <img class="w-28 drop-shadow-xl" src="/Findit.png" alt="Logo">
          
          <div class="grid grid-cols-2 gap-3 w-full max-w-md p-1.5 bg-gray-200/50 rounded-2xl">
            <router-link to="/member/lost" class="text-center py-2.5 rounded-xl font-bold text-gray-500 transition-all hover:text-yellow-600">
              Lost Item
            </router-link>
            <router-link to="/found" active-class="bg-white shadow-md text-yellow-600" class="text-center py-2.5 rounded-xl font-bold text-gray-500 transition-all">
              Found Item
            </router-link>
          </div>
        </motion.div>
      </div>

      <motion.div 
        :initial="{ y: 100, opacity: 0 }" 
        :animate="{ y: 0, opacity: 1 }" 
        class="bg-blue-950 rounded-t-[3.5rem] min-h-screen pb-24 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
      >
        <div class="px-6 pt-12 flex flex-col gap-6">
          
          <div class="space-y-4">
            <div class="relative group">
              <Icon icon="mdi:magnify" class="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-yellow-500" width="24" />
              <input 
                v-model="search" 
                type="text" 
                class="w-full py-3.5 pl-12 pr-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-4 focus:ring-yellow-500/30 transition-all shadow-inner" 
                placeholder="Cari nama barang atau lokasi..."
              >
            </div>

            <div class="flex items-center justify-between gap-3">
              <div class="relative flex-1">
                <select 
                  v-model="category" 
                  class="w-full appearance-none bg-white/10 border border-white/10 text-white py-3 px-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option class="text-black" value="">Semua Kategori</option>
                  <option class="text-black" value="Elektronik">Elektronik</option>
                  <option class="text-black" value="Aksesoris">Aksesoris</option>
                  <option class="text-black" value="Pribadi">Pribadi</option>
                  <option class="text-black" value="Berharga">Berharga</option>
                  <option class="text-black" value="Lainnya">Lainnya</option>
                </select>
                <Icon icon="mdi:chevron-down" class="absolute right-3 top-3.5 text-white pointer-events-none" width="20" />
              </div>

              <router-link 
                to="/createFound" 
                class="bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-bold py-3 px-5 rounded-xl shadow-lg shadow-yellow-500/20 transition-transform active:scale-95 flex items-center gap-2"
              >
                <Icon icon="mdi:plus" width="15" />
                Lapor
              </router-link>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 mt-2">
            <template v-if="filterItem.length">
              <button 
                v-for="item in filterItem" 
                :key="item.id" 
                @click="navigate(item.id)"
                class="group flex gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                <div class="relative shrink-0">
                  <img 
                    class="w-24 h-24 object-cover rounded-2xl shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-500" 
                    :src="`${API_URL}${item.image}`"
                    onerror="this.src='https://placehold.co/200x200?text=No+Image'"
                  >
                </div>

                <div class="flex flex-col justify-between py-1 text-left w-full">
                  <div>
                    <span class="text-[10px] font-black uppercase tracking-widest text-yellow-500 mb-1 block">
                      {{ item.category || 'Lainnya' }}
                    </span>
                    <h3 class="text-white font-bold text-lg leading-tight group-hover:text-yellow-400 transition-colors">
                      {{ item.title }}
                    </h3>
                    <div class="flex items-center gap-1 mt-1 text-gray-400">
                      <Icon icon="mdi:map-marker-outline" class="text-yellow-500/70" width="16" />
                      <span class="text-xs italic">{{ item.location }}</span>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-2 mt-3 border-t border-white/5 pt-2">
                    <div class="w-5 h-5 rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-400 flex items-center justify-center text-[10px] text-blue-950 font-bold">
                      {{ item.user.username.charAt(0).toUpperCase() }}
                    </div>
                    <span class="text-[11px] text-gray-500 font-medium tracking-wide">
                      Penemu: <span class="text-gray-300">{{ item.user.username }}</span>
                    </span>
                  </div>
                </div>
              </button>
            </template>

            <div v-else class="flex flex-col items-center justify-center py-32 opacity-20">
              <Icon icon="mdi:magnify-close" width="100" class="text-white" />
              <p class="text-white font-medium text-xl mt-4">Belum ada barang ditemukan</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</template>