<script setup>
    import { getToken } from '../../components/utils/helper';

    const token = getToken()
</script>

<template>
    <h3>{{ token }}</h3>
</template>