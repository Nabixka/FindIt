<script setup>
  import { ref, onMounted, nextTick, computed } from 'vue'
  import { api, getToken } from '../../components/utils/helper'
  import Bar from '../Bar/Bar.vue'
  import Nav from '../Bar/Nav.vue'
  import { Icon } from '@iconify/vue'
  import { useRouter } from 'vue-router'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'

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
  const token = getToken()
  const detail = ref({})
  const message = ref("")
  let mapInstance = null;
  const user = computed(() => detail.value?.user)
  const loading = ref(true)

  const showMap = async (locationText) => {
    if (!locationText) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationText)}`
      );
      const data = await res.json();
      if (!data.length) return;

      const lat = data[0].lat;
      const lng = data[0].lon;

      await nextTick();

      if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
      }

      mapInstance = L.map('map').setView([lat, lng], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapInstance);

      L.marker([lat, lng]).addTo(mapInstance).bindPopup(locationText);

      setTimeout(() => {
        if (mapInstance) {
          mapInstance.invalidateSize({ animate: true });
        }
      }, 400);

    } catch (err) {
      console.error("Gagal memuat peta:", err);
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

      await new Promise(resolve => setTimeout(resolve, 2000));
      const res = await api.get(`/item/${id}`)
      detail.value = res.data.data

      if (detail.value.location) {
        showMap(detail.value.location)
      }
    } catch (err) {
      if(err.status == 500){
        message.value = "Maaf, Terjadi Gangguan Untuk Terhubung Dengan Server"
      }
      if(err.status == 403 || 401) {
        message.value = "Anda Tidak Berhak Mengakses Page Ini"
        router.push("/")
      }
      if(err.status == 404){
        message.value = "Barang Tersebut Tidak Ada"
      }
    }
    finally {
      loading.value = false
    }
  }

  onMounted(() => {
    getDetail()
  })

  const handleLapor = async (id, userId) => {
    router.push({
      name : 'MemberCreateReport',
      state: {id, userId}
    })
  }
  
  const handleHubungi = (e) => {
    const phoneNumber = e
    const whatsappUrl = `https://wa.me/${phoneNumber}`
    window.open(whatsappUrl, '_blank')
  }

</script>

<template>
  <div class="bg-gray-50 dark:bg-linear-to-b dark:from-gray-950/90 dark:to-blue-950 min-h-screen pt-20 pb-32 lg:pt-24 lg:pb-24">
    <Nav />

    <div class="max-w-md lg:max-w-6xl mx-auto px-4">

      <div v-if="loading" class="flex flex-col lg:grid lg:grid-cols-2 lg:gap-10 animate-pulse">

        <!-- SKELETON IMAGE -->
        <div class="relative">
          <div class="absolute top-4 right-4 z-10">
            <div class="w-16 h-6 bg-gray-300 rounded-full"></div>
          </div>
          <div class="overflow-hidden rounded-3xl shadow-xl border-4 border-white bg-white">
            <div class="w-full aspect-square lg:aspect-auto lg:h-[500px] bg-gray-300"></div>
          </div>
        </div>

        <!-- SKELETON RIGHT SIDE -->
        <div class="flex flex-col gap-5 mt-6 lg:mt-0">
          <!-- DETAIL -->
          <div class="bg-white dark:bg-white/10 rounded-3xl p-5 lg:p-8 shadow-sm">
            <div class="h-8 bg-gray-300 rounded mb-3 w-3/4"></div>
            <div class="flex items-center gap-2 mt-3">
              <div class="w-5 h-5 bg-gray-300 rounded"></div>
              <div class="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
            <div class="mt-5">
              <div class="h-3 bg-gray-300 rounded mb-2 w-16"></div>
              <div class="h-4 bg-gray-300 rounded mb-1 w-full"></div>
              <div class="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>

          <!-- MAP -->
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden relative border border-gray-100">
            <div class="w-full h-56 lg:h-72 bg-gray-300"></div>
          </div>

          <!-- USER -->
          <div class="dark:bg-white/10 bg-blue-50 rounded-2xl p-4 flex items-center justify-between dark:border-none border border-blue-100">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-gray-300 rounded-full"></div>
              <div>
                <div class="h-3 bg-gray-300 rounded mb-1 w-12"></div>
                <div class="h-4 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
          </div>

          <!-- BUTTON -->
          <div class="flex flex-col gap-2">
            <div class="w-full h-12 bg-gray-300 rounded-xl"></div>
            <div class="w-full h-12 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col lg:grid lg:grid-cols-2 lg:gap-10">

        <!-- IMAGE -->
        <motion.div :initial="{ scale: 0.8 }" :animate="{ scale: 1, transition: { duration: 0.6 } }" class="relative">
          <div class="absolute top-4 right-4 z-10">
            <span :class="detail.status === 'lost' ? 'bg-orange-500' : 'bg-blue-600'"
              class="px-4 py-1 rounded-full text-white font-bold text-xs lg:text-sm shadow-lg uppercase">
              {{ detail.status }}
            </span>
          </div>

          <div class="overflow-hidden rounded-3xl shadow-xl border-4 dark:border-gray-300 border-white bg-white">
            <img v-if="detail.image" class="w-full object-cover aspect-square lg:aspect-auto lg:h-[500px]"
              :src="`${detail.image}`" alt="Item Image" />
            <div v-else class="w-full aspect-square flex items-center justify-center bg-gray-200 text-gray-400">
              No Image
            </div>
          </div>
        </motion.div>

        <!-- RIGHT SIDE -->
        <div class="flex flex-col gap-5 mt-6 lg:mt-0">

          <!-- DETAIL -->
          <div class="bg-white dark:bg-white/10 rounded-3xl p-5 lg:p-8 shadow-sm">
            <h1 class="text-xl lg:text-3xl font-extrabold dark:text-white text-blue-950 break-words">
              {{ detail.title }}
            </h1>

            <div class="flex items-center gap-2 mt-3 text-gray-600">
              <Icon icon="solar:map-point-bold-duotone" class="text-blue-600" width="20" />
              <span class="text-sm dark:text-white/70 lg:text-base break-words">
                {{ detail.location }}
              </span>
            </div>

            <div class="mt-5">
              <h4 class="text-xs font-bold dark:text-white text-gray-400 uppercase mb-2">
                Deskripsi
              </h4>
              <p class="text-sm lg:text-lg dark:text-white/70 text-blue-900/80 leading-relaxed break-words">
                {{ detail.description }}
              </p>
            </div>
          </div>

          <!-- MAP -->
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden relative border border-gray-100">
            <div id="map" class="w-full h-56 lg:h-72 z-0"></div>
          </div>

          <!-- USER -->
          <div class="dark:bg-white/10 bg-blue-50 rounded-2xl p-4 flex items-center justify-between dark:border-none border border-blue-100">
            <div class="flex items-center gap-3">
              <div
                class="w-9 h-9 dark:bg-white/50 bg-blue-950 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {{ detail.user_found_id || 'P' }}
              </div>
              <div v-if="user">
                <p class="text-xs dark:text-white text-blue-900/50 font-bold uppercase">
                  Pelapor
                </p>
                <p class="text-blue-950 dark:text-white/70 font-bold text-sm lg:text-base">
                  {{ user.username }}
                </p>
              </div>
            </div>
          </div>

          <!-- BUTTON -->
          <div class="flex flex-col gap-2">
              <button @click="handleHubungi(user.nomor)" class="w-full flex items-center justify-center gap-2 break-words text-white font-bold bg-blue-700 hover:bg-blue-900 rounded-xl p-3">
                <Icon icon="solar:phone-calling-bold" width="24"  />
                Hubungi Pelapor
              </button>

              <button @click="handleLapor(detail.id, detail.user.id)" class="flex items-center justify-center gap-2 text-white font-bold bg-red-600 hover:bg-red-800 rounded-xl p-3">
                <Icon icon="solar:danger-bold" width="24" height="24" />
                Laporkan
              </button>
          </div>

        </div>
      </div>
    </div>

    <Bar />
  </div>
</template>