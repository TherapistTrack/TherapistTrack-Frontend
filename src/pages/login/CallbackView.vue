<template>
  <div class="container">
    {{ result }}
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'

const result = ref('')

onMounted(() => {
  console.log(window.location)
})
</script>
<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
