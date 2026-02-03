<script setup>
    import { getToken, removeToken } from '../../utils/helper';
    import { useRouter} from 'vue-router'

    const router = useRouter()

    const token = getToken()

    const logOut = () => {
        removeToken(),
        router.push('/')
    }
</script>

<template>
    <div>
        <h3>{{ token }}</h3>

        <button @click="logOut">Log Out</button>
    </div>
</template>
