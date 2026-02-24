<script setup>
    import { ref, onMounted } from 'vue';
    import Bar from '../../Bar/Bar.vue';
    import Nav from '../../Bar/Nav.vue';
    import { Icon } from '@iconify/vue';
    import { getToken } from '../../../components/utils/helper';
    import { useRouter } from 'vue-router';
    import { motion } from 'motion-v';

    const router = useRouter()
    const API_URL = import.meta.env.VITE_API_URL
    const token = getToken()
    const previewImg = ref(null)
    const cat = ref([
        'Elektronik', 
        'Aksesoris', 
        'Pribadi', 
        'Berharga', 
        'Lainnya' 
    ])

    const form = ref({
        title: '',
        location: '',
        description: '',
        image: null,
        status: 'found',
        category: ''
    })

    const handleFile = (e) => {
        const file = e.target.files[0]
        if(!file) return

        form.value.image = file
        previewImg.value = URL.createObjectURL(file)
    }

    const uploadBarang = async () => {
        try{
            if(!token){
                router.push("/")
            }
            
            const formData = new FormData()
            formData.append('title', form.value.title)
            formData.append('location', form.value.location)
            formData.append('description', form.value.description)
            formData.append('image', form.value.image)
            formData.append('status', form.value.status)
            formData.append('category', form.value.category)

            const res = await fetch(`${API_URL}/item`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })

            if(res.ok){
                router.push("/found")
            }
        }
        catch(err){
            console.log(err)
        }
    }

</script>

<template>
    <div class="bg-gray-200 min-h-screen h-full">
        <Nav />
        <Bar />

        <div class="pl-10 pr-10 h-full">
            <form @submit.prevent="uploadBarang" class="flex flex-col h-screen justify-around">
                <div class="flex flex-col gap-5">
                    <motion.label :initial="{scale: 0 }" :animate="{scale: [0, 1.2, 1], transition: {duration: 1}}" class="flex flex-col items-center border-dashed border-2 p-5 border-gray-400/40 rounded-lg">
                        <input type="file" @change="handleFile" accept="image/*" hidden>
                            <img v-if="previewImg" class="w-40 h-40" :src="previewImg">
                            <div v-else class="flex flex-col items-center justify-center">
                            <Icon icon="ri:camera-fill" class="text-blue-950/90" width="100" height="100" />
                            <h3 class="text-gray-400 text-2xl font-semibold">Upload Photo</h3>
                            </div>
                    </motion.label>
                    <motion.div class="w-full" :initial="{scale: 0 }" :animate="{scale: [0, 1.2, 1], transition: {duration: 1}}">
                        <input v-model="form.title" class="w-full shadow-md bg-white rounded-lg py-3 pl-5" type="text" placeholder="Nama Barang">
                    </motion.div>
                    <motion.div class="w-full" :initial="{scale: 0 }" :animate="{scale: [0, 1.2, 1], transition: {duration: 1}}">
                        <input v-model="form.location" class="w-full shadow-md bg-white rounded-lg py-3 pl-5" type="text" placeholder="Nama Lokasi">
                    </motion.div>
                    <motion.div class="w-full" :initial="{scale: 0 }" :animate="{scale: [0, 1.2, 1], transition: {duration: 1}}">
                        <select class="w-full text-gray-400 shadow-md bg-white rounded-lg py-3 pl-5" v-model="form.category">
                            <option class="text-gray-400" value="" default>All</option>
                            <option v-for="c in cat" class="text-black" :value="c">{{ c }}</option>
                        </select>
                    </motion.div>
                    <motion.div class="w-full" :initial="{scale: 0 }" :animate="{scale: [0, 1.2, 1], transition: {duration: 1}}">
                        <textarea v-model="form.description" class="w-full shadow-md bg-white rounded-lg pl-5 pt-2 py-5" placeholder="Description Barang"></textarea>
                    </motion.div>
                </div>
                <motion.div :initial="{scale: 0 }" :animate="{scale: [0, 1.2, 1], transition: {duration: 1}}" class="flex flex-col justify-end">
                    <button class="bg-yellow-400/60 rounded-lg text-blue-950/80 text-2xl font-bold py-3">Buat Penemuan</button>
                </motion.div>
            </form>
        </div>
    </div>
</template>