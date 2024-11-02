<template>
  <div class="tabs"></div>
  <div class="view">
    <router-view @enableSpace="onEnableSpace" @disableSpace="onDisnableSpace" />
    <div class="side-space" :id="isSpaceEnabled ? 'en' : 'dis'"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const isSpaceEnabled = ref(false)

const onEnableSpace = () => {
  isSpaceEnabled.value = true
}
const onDisnableSpace = () => {
  isSpaceEnabled.value = false
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  background-color: white;
  font-family: 'MotivaSansMedium';
}

.side-space {
  transition: width 0.25s;
}
.side-space#dis {
  width: 0;
}
.side-space#en {
  width: 350px;
}
.tabs {
  background-color: var(--gray-3);
  border-bottom: 1px solid var(--gray-4);
  display: flex;
  height: 2.3rem;
}
.view {
  display: flex;
  height: auto;
  background-color: white;
}
</style>
