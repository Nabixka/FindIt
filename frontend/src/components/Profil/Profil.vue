<script setup>
    import { ref, onMounted } from 'vue';
    import Bar from '../Bar/Bar.vue';
    import { getToken } from '../../utils/helper';

    const API_URL = import.meta.env.VITE_API_URL
    const message = ref("")
    const profil = ref({})
    const token = getToken()

    const getProfil = async () => {
        try{
            if(!token){
                router.push("/")
            }

            const res = await fetch(`${API_URL}/user/profil`, {
                headers: {
                    Authorization : `Bearer ${token}`
                }
            })

            const json = await res.json()
            profil.value = json.data
        }
        catch(err){
            console.log(err)
        }
    }

    onMounted(() => {
        getProfil()
    })

</script>

<template>
    <div>
        <Bar />
        <h3 class="text-5xl">{{ profil.username }}</h3>
    </div>
</template>