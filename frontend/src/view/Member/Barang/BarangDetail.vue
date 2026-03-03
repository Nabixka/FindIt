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
  <div class="bg-gray-50 min-h-screen pt-20 pb-32 lg:pt-24 lg:pb-24">
    <Nav />

    <div class="max-w-md lg:max-w-6xl mx-auto px-4">

      <div class="flex flex-col lg:grid lg:grid-cols-2 lg:gap-10">

        <!-- IMAGE -->
        <motion.div
          :initial="{ scale: 0.8 }"
          :animate="{ scale: 1, transition: { duration: 0.6 } }"
          class="relative"
        >
          <div class="absolute top-4 right-4 z-10">
            <span
              :class="detail.status === 'lost' ? 'bg-orange-500' : 'bg-blue-600'"
              class="px-4 py-1 rounded-full text-white font-bold text-xs lg:text-sm shadow-lg uppercase"
            >
              {{ detail.status }}
            </span>
          </div>

          <div
            class="overflow-hidden rounded-3xl shadow-xl border-4 border-white bg-white"
          >
            <img
              v-if="detail.image"
              class="w-full object-cover aspect-square lg:aspect-auto lg:h-[500px]"
              :src="`${API_URL}${detail.image}`"
              alt="Item Image"
            />
            <div
              v-else
              class="w-full aspect-square flex items-center justify-center bg-gray-200 text-gray-400"
            >
              No Image
            </div>
          </div>
        </motion.div>

        <!-- RIGHT SIDE -->
        <div class="flex flex-col gap-5 mt-6 lg:mt-0">

          <!-- DETAIL -->
          <div class="bg-white rounded-3xl p-5 lg:p-8 shadow-sm">
            <h1 class="text-xl lg:text-3xl font-extrabold text-blue-950 break-words">
              {{ detail.title || 'Loading...' }}
            </h1>

            <div class="flex items-center gap-2 mt-3 text-gray-600">
              <Icon icon="solar:map-point-bold-duotone" class="text-blue-600" width="20" />
              <span class="text-sm lg:text-base break-words">
                {{ detail.location }}
              </span>
            </div>

            <div class="mt-5">
              <h4 class="text-xs font-bold text-gray-400 uppercase mb-2">
                Deskripsi
              </h4>
              <p class="text-sm lg:text-lg text-blue-900/80 leading-relaxed break-words">
                {{ detail.description }}
              </p>
            </div>
          </div>

          <!-- MAP -->
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div id="map" class="w-full h-56 lg:h-72"></div>
          </div>

          <!-- USER -->
          <div class="bg-blue-50 rounded-2xl p-4 flex items-center justify-between border border-blue-100">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-blue-950 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {{ detail.user_found_id || 'P' }}
              </div>
              <div v-if="user">
                <p class="text-xs text-blue-900/50 font-bold uppercase">
                  Pelapor
                </p>
                <p class="text-blue-950 font-bold text-sm lg:text-base">
                  {{ user.username }}
                </p>
              </div>
            </div>
          </div>

          <!-- BUTTON -->
          <div class="flex gap-3">
            <button
              class="flex-1 bg-blue-950 hover:bg-blue-900 transition py-3 lg:py-4 text-sm lg:text-lg font-bold text-white rounded-2xl shadow-lg flex items-center justify-center gap-2"
            >
              <Icon icon="solar:phone-calling-bold" width="20" />
              Hubungi Pelapor
            </button>

            <button
              class="bg-white border-2 border-gray-100 p-3 lg:p-4 rounded-2xl shadow-sm text-blue-950 hover:bg-gray-50"
            >
              <Icon icon="solar:share-bold" width="20" />
            </button>
          </div>

        </div>
      </div>
    </div>

    <Bar />
  </div>
</template>