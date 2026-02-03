<script setup>
    import { Icon } from "@iconify/vue"
    import { useRoute } from "vue-router";

</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-50">
    <div class="flex justify-around bg-blue-900/90 p-3">
      <router-link active-class="bg-yellow-500/80 rounded-full p-1" to="/home">
        <Icon icon="mdi:home-variant" class="text-white" width="30" height="30" />
      </router-link>
      <router-link active-class="bg-yellow-500/80 rounded-full p-1" to="/profil">
        <Icon icon="line-md:account" class="text-white" width="30" height="30" />
      </router-link>
    </div>
  </div>
</template>