<script setup>
    import { ref, computed, onMounted, nextTick } from 'vue';
    import 'leaflet/dist/leaflet.css';
    import L from 'leaflet';
    
    import Bar from '../../../Bar/Bar.vue';
    import Nav from '../../../Bar/Nav.vue';
    import { Icon } from '@iconify/vue';
    import { api, getToken } from '../../../../components/utils/helper';
    import { useRouter, useRoute } from 'vue-router';
    import { motion } from 'motion-v';

    import markerIcon from 'leaflet/dist/images/marker-icon.png';
    import markerShadow from 'leaflet/dist/images/marker-shadow.png';

    const router = useRouter()
    const route = useRoute()
    const token = getToken()
    const status = computed(() => route.query.status)
    const previewImg = ref(null)
    const message = ref('')
    const cat = ref(['Elektronik', 'Aksesoris', 'Pribadi', 'Berharga', 'Lainnya'])

    const form = ref({
        title: '',
        location: '',
        description: '',
        image: null,
        category: ''
    })

    const queryLocation = ref('')
    const searchResults = ref([])
    const isSearching = ref(false)
    const defaultLat = -2.5489
    const defaultLng = 118.0149
    let searchTimeout = null
    let mapInstance = null
    let currentMarker = null

    const DefaultIcon = L.icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    const handleFile = (e) => {
        const file = e.target.files[0]
        if(!file) return
        form.value.image = file
        previewImg.value = URL.createObjectURL(file)
    }

    const initMap = async () => {
        await nextTick()

        mapInstance = L.map('create-map', {
            zoomControl: true,
            attributionControl: false
        }).setView([defaultLat, defaultLng], 5)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapInstance)

        currentMarker = L.marker([defaultLat, defaultLng], { icon: DefaultIcon }).addTo(mapInstance)
            .bindPopup('Indonesia - klik map untuk memilih lokasi')
            .openPopup()

        setTimeout(() => {
            if (mapInstance) {
                mapInstance.invalidateSize()
            }
        }, 600)

        mapInstance.on('click', async (e) => {
            const { lat, lng } = e.latlng
            updateMapMarker(lat, lng)
            await reverseGeocode(lat, lng)
        })
    }

    const updateMapMarker = (lat, lng) => {
        if (!mapInstance) return

        if (currentMarker) {
            mapInstance.removeLayer(currentMarker)
        }

        currentMarker = L.marker([lat, lng], { icon: DefaultIcon }).addTo(mapInstance)
        mapInstance.setView([lat, lng], 15) 
    }

    const searchLocation = async () => {
        const query = queryLocation.value.trim()
        if (!query) {
            searchResults.value = []
            return
        }

        isSearching.value = true
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(query)}`)
            const data = await res.json()
            searchResults.value = Array.isArray(data) ? data : []
        } catch (err) {
            console.error("Search error:", err)
            searchResults.value = []
        } finally {
            isSearching.value = false
        }
    }

    const handleSearchInput = () => {
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
            searchLocation()
        }, 500)
    }

    const selectLocation = (item) => {
        const lat = parseFloat(item.lat)
        const lon = parseFloat(item.lon)
        form.value.location = item.display_name
        queryLocation.value = item.display_name
        searchResults.value = []
        updateMapMarker(lat, lon)
    }

    const reverseGeocode = async (lat, lng) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            const data = await res.json()
            const label = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
            form.value.location = label
            queryLocation.value = label
        } catch (err) {
            form.value.location = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
            queryLocation.value = form.value.location
        }
    }

    const uploadBarang = async () => {
        try{
            if(!token){
                router.push("/")
                return
            }
            
            const formData = new FormData()
            formData.append('title', form.value.title)
            formData.append('location', form.value.location)
            formData.append('description', form.value.description)
            formData.append('image', form.value.image)
            formData.append('status', status.value || 'lost')
            formData.append('category', form.value.category)

            await api.post('/item', formData)
            router.push("/member/home")
        }
        catch(err){
            message.value = "Maaf, Gagal mengunggah laporan. Cek koneksi atau server."
            console.error(err)
        }
    }

    onMounted(() => {
        initMap()
    })
</script>

<template>
    <div class="dark:bg-slate-950 bg-slate-50 min-h-screen">
        <Nav />
        <Bar />

        <div class="pt-20 pb-20 flex flex-col h-full lg:justify-center lg:items-center px-4">
            <motion.div 
                :initial="{ opacity: 0, y: -20 }" 
                :animate="{ opacity: 1, y: 0 }"
                class="mb-8 text-center">
                <h2 class="text-2xl font-black dark:text-white text-blue-950">Lapor Barang Hilang</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">Isi detail barang agar mudah diidentifikasi</p>
            </motion.div>

            <form @submit.prevent="uploadBarang" class="w-full lg:w-1/3 p-6 bg-white dark:bg-slate-900 shadow-xl rounded-3xl border border-gray-100 dark:border-slate-800">
                
                <motion.label 
                    :initial="{ scale: 0.9, opacity: 0 }" 
                    :animate="{ scale: 1, opacity: 1 }"
                    class="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-3xl dark:bg-slate-800 bg-gray-50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all cursor-pointer group overflow-hidden">
                    <input type="file" @change="handleFile" accept="image/*" hidden>
                    
                    <template v-if="previewImg">
                        <img class="w-full h-full object-cover" :src="previewImg">
                        <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Icon icon="solar:camera-add-bold" class="text-white" width="40" />
                        </div>
                    </template>
                    
                    <div v-else class="flex flex-col items-center justify-center space-y-2">
                        <div class="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600">
                            <Icon icon="solar:camera-add-bold-duotone" width="48" />
                        </div>
                        <div class="text-center">
                            <span class="text-blue-950 dark:text-white font-bold block">Ambil Foto</span>
                            <span class="text-xs text-gray-400">JPG, PNG up to 5MB</span>
                        </div>
                    </div>
                </motion.label>

                <div class="space-y-5 pt-6">
                    <motion.div :initial="{ x: -20, opacity: 0 }" :animate="{ x: 0, opacity: 1 }">
                        <label class="dark:text-slate-300 text-xs font-bold text-blue-950 ml-2 mb-1 block uppercase tracking-wider">Nama Barang</label>
                        <input v-model="form.title" required class="w-full shadow-sm dark:bg-slate-800 dark:text-white bg-white border border-gray-200 dark:border-slate-700 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all" type="text" placeholder="Contoh: Dompet Kulit Cokelat">
                    </motion.div>

                    <motion.div :initial="{ x: -20, opacity: 0 }" :animate="{ x: 0, opacity: 1, transition: { delay: 0.1 } }">
                        <label class="dark:text-slate-300 text-xs font-bold text-blue-950 ml-2 mb-1 block uppercase tracking-wider">Lokasi Kejadian</label>
                        <div class="relative">
                            <Icon icon="solar:map-point-bold-duotone" class="absolute left-4 top-4 text-gray-400" width="20" />
                            <input v-model="queryLocation" @input="handleSearchInput" class="w-full shadow-sm dark:bg-slate-800 dark:text-white bg-white border border-gray-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-5 focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all" type="text" placeholder="Cari lokasi...">
                            
                            <div v-if="searchResults.length" class="absolute z-[2000] w-full mt-2 max-h-60 overflow-auto rounded-2xl border border-gray-200 bg-white shadow-2xl">
                                <button v-for="item in searchResults" :key="item.place_id" type="button" @click="selectLocation(item)" class="w-full px-4 py-3 text-left hover:bg-yellow-50 border-b border-gray-50 last:border-none">
                                    <p class="font-semibold text-sm text-gray-900">{{ item.display_name }}</p>
                                </button>
                            </div>
                        </div>

                        <div class="mt-4 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-inner h-60 relative z-10">
                            <div id="create-map" class="w-full h-full"></div>
                        </div>
                        <p class="mt-2 text-[10px] text-gray-400 uppercase font-medium">Klik peta jika pencarian tidak akurat</p>
                    </motion.div>

                    <motion.div :initial="{ x: -20, opacity: 0 }" :animate="{ x: 0, opacity: 1, transition: { delay: 0.2 } }">
                        <label class="text-xs dark:text-slate-300 font-bold text-blue-950 ml-2 mb-1 block uppercase tracking-wider">Kategori</label>
                        <div class="relative">
                            <select v-model="form.category" required class="w-full appearance-none shadow-sm dark:bg-slate-800 bg-white dark:text-white border border-gray-200 dark:border-slate-700 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all">
                                <option value="" disabled>Pilih Kategori</option>
                                <option v-for="c in cat" :key="c" :value="c">{{ c }}</option>
                            </select>
                            <Icon icon="solar:alt-arrow-down-linear" class="absolute right-5 top-4.5 text-gray-400 pointer-events-none" width="18" />
                        </div>
                    </motion.div>

                    <motion.div :initial="{ x: -20, opacity: 0 }" :animate="{ x: 0, opacity: 1, transition: { delay: 0.3 } }">
                        <label class="text-xs font-bold text-blue-950 dark:text-slate-300 ml-2 mb-1 block uppercase tracking-wider">Deskripsi Tambahan</label>
                        <textarea v-model="form.description" rows="3" class="w-full shadow-sm dark:bg-slate-800 dark:text-white bg-white border border-gray-200 dark:border-slate-700 rounded-2xl p-5 focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all" placeholder="Ciri-ciri khusus barang..."></textarea>
                    </motion.div>
                </div>

                <div v-if="message" class="mt-4 p-3 bg-red-100 text-red-600 rounded-xl text-xs text-center font-bold">
                    {{ message }}
                </div>

                <motion.div 
                    :initial="{ y: 20, opacity: 0 }" 
                    :animate="{ y: 0, opacity: 1, transition: { delay: 0.4 } }"
                    class="pt-6">
                    <button type="submit" class="w-full bg-yellow-500 hover:bg-yellow-400 active:scale-95 text-blue-950 text-lg font-black py-4 rounded-2xl shadow-lg shadow-yellow-500/30 transition-all flex items-center justify-center gap-2">
                        <Icon icon="solar:cloud-upload-bold" width="24" />
                        Publikasikan Laporan
                    </button>
                </motion.div>
            </form>
        </div>
    </div>
</template>

<style>
</style>