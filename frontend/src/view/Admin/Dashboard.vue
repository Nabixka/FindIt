<script setup>
    import { ref, onMounted } from 'vue';
    import { getToken, removeToken } from '../../components/utils/helper';
    import { useRouter } from 'vue-router';
import Bar from '../Bar/Bar.vue';

    const API_URL = import.meta.env.VITE_API_URL
    const token = getToken()
    const router = useRouter()
    const profil = ref({})
    const error = ref("")

    const getProfil = async () => {
        try{
        if(!token){
            removeToken()
            router.push("/")
        }
        const res = await fetch(`${API_URL}/user/profil`, {
            headers : {
                Authorization: `Bearer ${token}`
            }
        })

        const json = await res.json()
        profil.value = json.data
        }
        catch(err){
            error.value = "Tidak Dapat Terhubung Ke Server"
        }
    }

    const logout = () => {
        removeToken()
        router.push("/")
    }

    onMounted(() => {
        getProfil()
    })

</script>

<template>
    <div class="min-h-screen bg-gray-50 text-slate-800">
        <Bar />
        <div class="flex flex-col gap-8 pt-10">
            <div class="flex flex-col items-center gap-5">
                <h3 class="text-yellow-600 text-3xl font-extrabold tracking-tight text-center">Selamat Datang Admin</h3>
                <img class="w-28" src="/Findit.png">
            </div>
            <div class="bg-linear-to-b from-blue-950 to-blue-800">
                <h3>Hai</h3>
            </div>
        </div>
    </div>
</template>