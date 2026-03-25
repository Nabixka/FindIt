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

  try {
    const res = await fetch(`${API_URL}/auth/login/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        otp: otpCode
      })
    })

    const json = await res.json()
    const data = json.data
    if (json.status == 200) {
      localStorage.setItem('token', data.token)
      if (data.role == "member") {
        router.push("/member/home")
      }
      if (data.role == "admin") {
        router.push("/admin/home")
      }
    }
    else {
      error.value = "Kode OTP Salah"
    }
  }
  catch (err) {
    error.value = "Gagal Terhubung Ke Server"
  }
}

</script>


<template>
  <div class="bg-linear-to-r from-white min-h-screen to-gray-200 lg:flex lg:justify-center lg:items-center">
    <motion.div :initial="{ scale: 0 }" :animate="{ scale: [0, 1.1, 1], transition: { duration: 1 } }" class="flex flex-col h-screen lg:h-1/2 lg:bg-white lg:rounded-lg lg:w-1/3 pt-10">

      <!-- Title -->
      <div class="flex flex-col gap-5 justify-center items-center pt-10">
        <div>
          <img src="/Findit.png" class="w-35 h-15">
        </div>
        <h3 class="text-blue-950/80 font-bold text-4xl text-center">
          Verifikasi Kode OTP
        </h3>
        <p class="text-center px-5 font-semibold text-blue-950/70">
          Kode OTP telah dikirim ke email anda dan akan kadaluarsa dalam 5 menit
        </p>
      </div>

      <!-- Form -->
      <div class="pl-10 pr-10 pb-10 mt-10 flex flex-col gap-5 bg-linear-to-b from-blue-900/80 to-blue-950 h-full p-5 rounded-t-4xl rounded-b-lg">
        <h3 class="text-red-500 text-center">{{ error }}</h3>
        <div class="grid grid-cols-6 gap-3">
          <input v-for="(item, index) in otp" :key="index" ref="inputs" inputmode="numeric" v-model="otp[index]"
            @input="handleInput($event, index)" @keydown.backspace="handleBackspace($event, index)" maxlength="1"
            class="text-center py-5 text-2xl bg-white rounded-md border-2 border-yellow-400" />
        </div>

        <button @click.once="verifyOtp" class="bg-yellow-400 text-white font-bold py-3 text-2xl rounded-full">
          Verifikasi Akun
        </button>
        <router-link to="/" class="text-center font-semibold text-blue-400">Kembali Ke Login</router-link>
      </div>
    </motion.div>

  </div>
</template>