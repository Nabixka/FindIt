<script setup>
    import { ref } from "vue"
    import { useRouter } from "vue-router"

    const { state } = history
    const router = useRouter()
    const API_URL = import.meta.env.VITE_API_URL
    const otp = ref(["", "", "", "", "", ""])
    const inputs = ref([])
    const email = state?.email

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
        alert("OTP harus 6 digit")
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
            console.log("Berhasil")

            localStorage.setItem('token', data.token)

            router.push("/lost")
        }
        else{
            console,log("Gagal")
        }
      }
      catch(err){
        console.log(err.message)
      }
    }

</script>


<template>
  <div class="bg-gray-200 h-screen grid grid-cols-1">
    <div class="flex flex-col gap-5 justify-center items-center">
      <img src="/Findit.png" class="w-35 h-15">
      <h3 class="text-blue-950/80 font-bold text-4xl text-center">
        Verifikasi Kode OTP
      </h3>
      <p class="text-center px-5 font-semibold text-blue-950/70">
        Kode OTP telah dikirim ke email anda dan akan kadaluarsa dalam 5 menit
      </p>
    </div>

    <div class="bg-blue-900/80 rounded-t-4xl flex flex-col gap-10 p-5">
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

      <button
        @click="verifyOtp"
        class="bg-yellow-400 text-white font-bold py-3 text-2xl rounded-full"
      >
        Verifikasi Akun
      </button>
    </div>
  </div>
</template>