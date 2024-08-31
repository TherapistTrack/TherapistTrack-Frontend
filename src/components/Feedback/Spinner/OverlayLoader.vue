<template>
  <div class="overlay-loader">
    <RiLoader2Line size="3rem" color="black" alt="loading" class="loading" />
  </div>
</template>

<script setup>
import { RiLoader2Line } from '@remixicon/vue'
</script>

<style>
.overlay-loader {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 500;
}

.loading {
  height: 12vh;
  animation: rotate 2.5s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
