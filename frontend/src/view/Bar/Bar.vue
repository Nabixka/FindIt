<script setup>
  import { Icon } from "@iconify/vue"
  import { useRouter } from "vue-router";
  import { getToken } from "../../components/utils/helper";
  import { ref, onMounted, onUnmounted } from "vue"
  
  const router = useRouter()
  const token = getToken()
  const detail = ref({})
  const hidden = ref(false)
  let lastScrollY = 0
  const API_URL = import.meta.env.VITE_API_URL

  const handleScroll = () => {
    const currentScroll = window.scrollY
    if (currentScroll > lastScrollY + 10 && currentScroll > 100) {
      hidden.value = true
    }
    else if (currentScroll < lastScrollY - 10) {
      hidden.value = false
    }
    lastScrollY = currentScroll
  }

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
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  const handleNavigate = (e) => {
    if(detail.value.role === "member"){
      router.push(`/member/${e}`)
    }
    if(detail.value.role === "admin"){
      router.push(`/admin/${e}`)
    }
  }

</script>

<template>
  <div :class="['fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out', hidden ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100']">
    <div class="bg-slate-950/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 flex justify-around gap-4">
      <button @click="handleNavigate('home')" class="flex flex-col items-center gap-1 text-slate-100 hover:text-white transition">
        <Icon icon="mdi:home-variant" width="26" height="26" />
        <span class="text-[11px]">Home</span>
      </button>
      <button @click="handleNavigate('profil')" class="flex flex-col items-center gap-1 text-slate-100 hover:text-white transition">
        <Icon icon="line-md:account" width="26" height="26" />
        <span class="text-[11px]">Profil</span>
      </button>
    </div>
  </div>
</template>