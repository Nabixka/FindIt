<script setup>
    import { ref, onMounted, nextTick, computed } from 'vue'
    import { getToken } from '../../../components/utils/helper'
    import Bar from '../../Bar/Bar.vue'
    import Nav from '../../Bar/Nav.vue'
    import { Icon } from '@iconify/vue'
    import { useRouter } from 'vue-router'
    import L from 'leaflet'
    import { motion } from 'motion-v'

    import markerIcon from 'leaflet/dist/images/marker-icon.png';
    import markerShadow from 'leaflet/dist/images/marker-shadow.png';

    let DefaultIcon = L.icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    const { state } = history
    const router = useRouter()
    const API_URL = import.meta.env.VITE_API_URL
    const token = getToken()
    const detail = ref({})
    let mapInstance = null;
    const user = computed(() => detail.value?.user)

    const showMap = async (locationText) => {
        if (!locationText) return

        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationText)}`
            )
            const data = await res.json()
            if (!data.length) return

            const lat = data[0].lat
            const lng = data[0].lon

            await nextTick()

            if (mapInstance) {
                mapInstance.remove() 
            }

            mapInstance = L.map('map').setView([lat, lng], 15)

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap'
            }).addTo(mapInstance)

            L.marker([lat, lng])
                .addTo(mapInstance)
                .bindPopup(locationText)
                .openPopup()
        } catch (err) {
            console.error("Gagal memuat peta:", err)
        }
    }

    const getDetail = async () => {
        try {
            if (!token) {
                router.push('/')
                return
            }

            const id = state?.id
            if (!id) return;

            const res = await fetch(`${API_URL}/item/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            const json = await res.json()
            detail.value = json.data

            if (detail.value.location) {
                showMap(detail.value.location)
            }
        } catch (err) {
            console.log(err)
        }
    }

    onMounted(() => {
        getDetail()
    })
</script>

<template>
    <div class="bg-gray-50 min-h-screen pb-32">
        <Nav />

        <div class="max-w-md mx-auto pt-20 px-4">
            <motion.div :initial="{scale: 0.6}" :animate="{scale: 1, transition: {duration: 1}}" class="relative group mt-4">
                <div class="absolute top-4 right-4 z-10">
                    <span
                        :class="detail.status === 'lost' ? 'bg-orange-500' : 'bg-blue-600'"
                        class="px-4 py-1 rounded-full text-white font-bold text-sm shadow-lg uppercase tracking-wider">
                        {{ detail.status }}
                    </span>
                </div>

                <div class="overflow-hidden rounded-3xl shadow-xl border-4 border-white aspect-square bg-white">
                    <img
                        v-if="detail.image"
                        class="w-full h-full bg-cover"
                        :src="`${API_URL}${detail.image}`"
                        alt="Item Image">
                    <div v-else class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                        No Image
                    </div>
                </div>
            </motion.div>

            <motion.div :initial="{scale: 0.6}" :animate="{scale: 1, transition: {duration: 1}}" class="mt-6 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h1 class="text-blue-950 font-extrabold text-3xl capitalize">
                    {{ detail.title || 'Loading...' }}
                </h1>

                <div class="flex items-center gap-2 mt-3 text-gray-600">
                    <Icon icon="solar:map-point-bold-duotone" class="text-blue-600" width="24" />
                    <span class="font-medium">{{ detail.location }}</span>
                </div>

                <div class="mt-6">
                    <h4 class="text-sm font-bold text-gray-400 uppercase mb-2">Deskripsi</h4>
                    <p class="text-blue-900/80 text-lg leading-relaxed">
                        {{ detail.description }}
                    </p>
                </div>
            </motion.div>

            <motion.div :initial="{scale: 0.6}" :animate="{scale: 1, transition: {duration: 1}}" class="mt-4 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
                <div id="map" class="w-full h-64 rounded-xl z-0"></div>
            </motion.div>

            <motion.div :initial="{scale: 0.6}" :animate="{scale: 1, transition: {duration: 1}}" class="mt-4 bg-blue-50 rounded-2xl p-4 flex items-center justify-between border border-blue-100">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-950 rounded-full flex items-center justify-center text-white font-bold">
                        {{ detail.user_found_id || 'P' }}
                    </div>
                    <div v-if="user">
                        <p class="text-xs text-blue-900/50 font-bold uppercase">Pelapor</p>
                        <p class="text-blue-950 font-bold">{{ user.username }}</p>
                    </div>
                </div>
            </motion.div>

            <div class="flex pt-5 gap-3">
                <motion.button :initial="{scale: 0.6}" :animate="{scale: 1, transition: {duration: 1}}"
                    class="flex-1 bg-blue-950 hover:bg-blue-900 transition-colors py-4 font-bold text-white text-lg rounded-2xl shadow-lg flex items-center justify-center gap-2">
                    <Icon icon="solar:phone-calling-bold" width="24" />
                    Hubungi Pelapor
                </motion.button>

                <motion.button :initial="{scale: 0.6}" :animate="{scale: 1, transition: {duration: 1}}"
                    class="bg-white border-2 border-gray-100 p-4 rounded-2xl shadow-sm text-blue-950 hover:bg-gray-50">
                    <Icon icon="solar:share-bold" width="24" />
                </motion.button>
            </div>
        </div>

        <Bar />
    </div>
</template>