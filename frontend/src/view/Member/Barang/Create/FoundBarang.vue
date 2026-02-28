<script setup>
    import { ref, onMounted } from 'vue';
    import Bar from '../../../Bar/Bar.vue';
    import Nav from '../../../Bar/Nav.vue';
    import { Icon } from '@iconify/vue';
    import { getToken } from '../../../../components/utils/helper';
    import { useRouter } from 'vue-router';
    import { motion } from 'motion-v';

    const router = useRouter()
    const API_URL = import.meta.env.VITE_API_URL
    const token = getToken()
    const previewImg = ref(null)
    const cat = ref([
        'Elektronik', 
        'Aksesoris', 
        'Pribadi', 
        'Berharga', 
        'Lainnya' 
    ])

    const form = ref({
        title: '',
        location: '',
        description: '',
        image: null,
        status: 'found',
        category: ''
    })

    const handleFile = (e) => {
        const file = e.target.files[0]
        if(!file) return

        form.value.image = file
        previewImg.value = URL.createObjectURL(file)
    }

    const uploadBarang = async () => {
        try{
            if(!token){
                router.push("/")
            }
            
            const formData = new FormData()
            formData.append('title', form.value.title)
            formData.append('location', form.value.location)
            formData.append('description', form.value.description)
            formData.append('image', form.value.image)
            formData.append('status', form.value.status)
            formData.append('category', form.value.category)

            const res = await fetch(`${API_URL}/item`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })

            if(res.ok){
                router.push("/found")
            }
        }
        catch(err){
            console.log(err)
        }
    }

</script>

<template>
    <div class="bg-slate-50 min-h-screen">
        <Nav />
        <Bar />

        <div class="max-w-md mx-auto px-6 pt-24 pb-12">
            <motion.div 
                :initial="{ opacity: 0, y: -20 }" 
                :animate="{ opacity: 1, y: 0 }"
                class="mb-8 text-center"
            >
                <h2 class="text-2xl font-black text-blue-950">Lapor Barang Temuan</h2>
                <p class="text-sm text-gray-500">Isi detail barang agar mudah diidentifikasi</p>
            </motion.div>

            <form @submit.prevent="uploadBarang" class="space-y-6">
                
                <motion.label 
                    :initial="{ scale: 0.9, opacity: 0 }" 
                    :animate="{ scale: 1, opacity: 1 }"
                    class="relative flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 rounded-3xl bg-white hover:bg-gray-50 transition-all cursor-pointer group overflow-hidden">
                    <input type="file" @change="handleFile" accept="image/*" hidden>
                    
                    <template v-if="previewImg">
                        <img class="w-full h-full object-cover" :src="previewImg">
                        <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Icon icon="solar:camera-add-bold" class="text-white" width="40" />
                        </div>
                    </template>
                    
                    <div v-else class="flex flex-col items-center justify-center space-y-2">
                        <div class="p-4 bg-blue-50 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                            <Icon icon="solar:camera-add-bold-duotone" width="48" />
                        </div>
                        <div class="text-center">
                            <span class="text-blue-950 font-bold block">Ambil Foto</span>
                            <span class="text-xs text-gray-400">JPG, PNG up to 5MB</span>
                        </div>
                    </div>
                </motion.label>

                <div class="space-y-4">
                    <motion.div :initial="{ x: -20, opacity: 0 }" :animate="{ x: 0, opacity: 1, transition: { delay: 0.1 } }">
                        <label class="text-xs font-bold text-blue-950 ml-2 mb-1 block uppercase tracking-wider">Nama Barang</label>
                        <input v-model="form.title" class="w-full shadow-sm bg-white border border-gray-200 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all" type="text" placeholder="Contoh: Dompet Kulit Cokelat">
                    </motion.div>

                    <motion.div :initial="{ x: -20, opacity: 0 }" :animate="{ x: 0, opacity: 1, transition: { delay: 0.2 } }">
                        <label class="text-xs font-bold text-blue-950 ml-2 mb-1 block uppercase tracking-wider">Lokasi</label>
                        <div class="relative">
                            <Icon icon="solar:map-point-bold-duotone" class="absolute left-4 top-4 text-gray-400" width="20" />
                            <input v-model="form.location" class="w-full shadow-sm bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-5 focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all" type="text" placeholder="Lokasi terakhir terlihat">
                        </div>
                    </motion.div>

                    <motion.div :initial="{ x: -20, opacity: 0 }" :animate="{ x: 0, opacity: 1, transition: { delay: 0.3 } }">
                        <label class="text-xs font-bold text-blue-950 ml-2 mb-1 block uppercase tracking-wider">Kategori</label>
                        <div class="relative">
                            <select class="w-full appearance-none shadow-sm bg-white border border-gray-200 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all text-gray-600" v-model="form.category">
                                <option value="" disabled selected>Pilih Kategori</option>
                                <option v-for="c in cat" class="text-black" :value="c">{{ c }}</option>
                            </select>
                            <Icon icon="solar:alt-arrow-down-linear" class="absolute right-5 top-4.5 text-gray-400 pointer-events-none" width="18" />
                        </div>
                    </motion.div>

                    <motion.div :initial="{ x: -20, opacity: 0 }" :animate="{ x: 0, opacity: 1, transition: { delay: 0.4 } }">
                        <label class="text-xs font-bold text-blue-950 ml-2 mb-1 block uppercase tracking-wider">Deskripsi Tambahan</label>
                        <textarea v-model="form.description" rows="3" class="w-full shadow-sm bg-white border border-gray-200 rounded-2xl p-5 focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all" placeholder="Ciri-ciri khusus barang..."></textarea>
                    </motion.div>
                </div>

                <motion.div 
                    :initial="{ y: 20, opacity: 0 }" 
                    :animate="{ y: 0, opacity: 1, transition: { delay: 0.5 } }"
                    class="pt-4 pb-10">
                    <button class="w-full bg-yellow-500 hover:bg-yellow-400 active:scale-95 text-blue-950 text-lg font-black py-4 rounded-2xl shadow-lg shadow-yellow-500/30 transition-all flex items-center justify-center gap-2">
                        <Icon icon="solar:cloud-upload-bold" width="24" />
                        Publikasikan Laporan
                    </button>
                </motion.div>
            </form>
        </div>
    </div>
</template>