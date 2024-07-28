<template>
  <div class="center">
    <RiLoader2Line size="2rem" color="black" alt="loading" class="loading" />
  </div>
</template>

<script>
import { RiLoader2Line } from '@remixicon/vue'
export default {
  components: {
    RiLoader2Line
  }
}
</script>

<style>
.center {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 5vh;
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
