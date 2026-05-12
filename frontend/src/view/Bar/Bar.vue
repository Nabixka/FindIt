<script setup>
  import { Icon } from "@iconify/vue"
  import { useRouter } from "vue-router";
  import { getToken } from "../../components/utils/helper";
  import { ref, onMounted, computed } from "vue"
  
  const router = useRouter()
  const token = getToken()
  const detail = ref({})
  const API_URL = import.meta.env.VITE_API_URL
  const showAdminMenu = ref(false)

  const getRole = async () => {
    try{
      const res = await fetch(`${API_URL}/user/profil`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const json = await res.json()
      detail.value = json.data
    }
    catch(err){
      console.log(err)
    }
  }

  onMounted(() => {
    getRole()
  })

  const handleNavigate = (e) => {
    if(detail.value.role == "member"){
      router.push(`/member/${e}`)
    }
    if(detail.value.role == "admin"){
      router.push(`/admin/${e}`)
    }
    showAdminMenu.value = false
  }

  const navigateToMatches = () => {
    router.push("/admin/matches")
    showAdminMenu.value = false
  }

</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-50">
    <div class="flex justify-around bg-blue-900 p-3">
      <button @click="handleNavigate('home')">
        <Icon icon="mdi:home-variant" class="text-white" width="30" height="30" />
      </button>
      <button v-if="detail.role === 'admin'" @click="showAdminMenu = !showAdminMenu" class="relative">
        <Icon icon="carbon:menu" class="text-white" width="30" height="30" />
        <div v-if="showAdminMenu" class="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 min-w-max z-50">
          <button @click="navigateToMatches" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left text-blue-950 dark:text-white">
            <Icon icon="solar:link-circle-2-bold-duotone" width="20" />
            <span>Matching Items</span>
          </button>
          <button @click="() => { router.push('/admin/barang'); showAdminMenu = false }" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left text-blue-950 dark:text-white">
            <Icon icon="solar:box-minimalistic-bold-duotone" width="20" />
            <span>List Barang</span>
          </button>
          <button @click="() => { router.push('/admin/user'); showAdminMenu = false }" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left text-blue-950 dark:text-white">
            <Icon icon="solar:user-bold-duotone" width="20" />
            <span>List User</span>
          </button>
        </div>
      </button>
      <button @click="handleNavigate('profil')">
        <Icon icon="line-md:account" class="text-white" width="30" height="30" />
      </button>
    </div>
  </div>
</template>