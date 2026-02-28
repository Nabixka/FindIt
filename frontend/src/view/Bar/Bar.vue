<script setup>
  import { Icon } from "@iconify/vue"
  import { useRouter } from "vue-router";
  import { getToken } from "../../components/utils/helper";
  import { ref, onMounted, computed } from "vue"
  
  const router = useRouter()
  const token = getToken()
  const detail = ref({})
  const API_URL = import.meta.env.VITE_API_URL

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
      console.log
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
  }

</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-50">
    <div class="flex justify-around bg-blue-900 p-3">
      <button @click="handleNavigate('lost')">
        <Icon icon="mdi:home-variant" class="text-white" width="30" height="30" />
      </button>
      <button @click="handleNavigate('profil')">
        <Icon icon="line-md:account" class="text-white" width="30" height="30" />
      </button>
    </div>
  </div>
</template>