<script setup>
    import { ref } from "vue"
    import { useRouter } from "vue-router"
    import { motion } from "motion-v"

    const { state } = history
    const router = useRouter()
    const API_URL = import.meta.env.VITE_API_URL
    const otp = ref(["", "", "", "", "", ""])
    const inputs = ref([])
    const email = state?.email
    const error = ref(null)

    const handleInput = (e, index) => {
      const value = e.target.value.replace(/\D/g, "")
      otp.value[index] = value

      if (value && index < 5) {
        inputs.value[index + 1].focus()
      }
    }

    const handleBackspace = (e, index) => {
      if (!otp.value[index] && index > 0) {
        inputs.value[index - 1].focus()
      }
    }

    const verifyOtp = async () => {
      const otpCode = otp.value.join("")

      if (otpCode.length !== 6) {
        error.value = "Kode OTP Harus 6 Angka"
        return
      }

      try{
        const res = await fetch(`${API_URL}/user/login/verify`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                email: email,
                otp: otpCode
            })
        })

        const json = await res.json()
        const data = json.data
        if(json.status == 200){
            localStorage.setItem('token', data.token)
              if(data.role == "member"){
                router.push("/lost")
              }
              if(data.role == "admin"){
                router.push("/admin/dashboard")
              }
        }
        else{
            error.value = "Kode OTP Salah"
        }
      }
      catch(err){
        error.value = "Gagal Terhubung Ke Server"
      }
    }

</script>


<template>
  <div class="bg-linear-to-r from-white to-gray-200 h-screen grid grid-cols-1">

    <!-- Title -->
    <div class="flex flex-col gap-5 justify-center items-center">
      <motion.div :initial="{scale: 0}" :animate="{scale: [0, 1.3, 1], transition: {duration: 1}}">
        <img src="/Findit.png" class="w-35 h-15">
      </motion.div>
      <motion.h3 :initial="{scale: 0}" :animate="{scale: [0, 1.1, 1], transition: {duration: 1}}" class="text-blue-950/80 font-bold text-4xl text-center">
        Verifikasi Kode OTP
      </motion.h3>
      <motion.p :initial="{scale: 0}" :animate="{scale: [0, 1.1, 1], transition: {duration: 1}}" class="text-center px-5 font-semibold text-blue-950/70">
        Kode OTP telah dikirim ke email anda dan akan kadaluarsa dalam 5 menit
      </motion.p>
    </div>

    <!-- Form -->
    <motion.div :initial="{y: 300}" :animate="{y: 0, transition: { duration: 0.8}}" class="bg-linear-to-b from-blue-900/80 to-blue-950 rounded-t-4xl flex flex-col gap-10 p-5">
      <h3 class="text-red-500 text-center">{{ error }}</h3>
      <div class="grid grid-cols-6 gap-3">
        <input
          v-for="(item, index) in otp"
          :key="index"
          ref="inputs"
          v-model="otp[index]"
          @input="handleInput($event, index)"
          @keydown.backspace="handleBackspace($event, index)"
          maxlength="1"
          class="text-center py-5 text-2xl bg-white rounded-md border-2 border-yellow-400"
        />
      </div>

      <button @click="verifyOtp" class="bg-yellow-400 text-white font-bold py-3 text-2xl rounded-full" >
        Verifikasi Akun
      </button>
      <router-link to="/" class="text-center font-semibold text-blue-400">Kembali Ke Login</router-link>
    </motion.div>

  </div>
</template>