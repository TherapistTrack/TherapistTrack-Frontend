<template>
  <div class="tabs">
    <SideBar :minim="minim" @updateValue="updateMinim" />
  </div>
  <div class="view">
    <div class="sideSpace" :id="minim ? '' : 'max'"></div>
    <router-view />
  </div>
</template>
<script setup>
import SideBar from '@/components/Navigation/SideBar/SideBar.vue'
import { ref } from 'vue'
const minim = ref(false)

const updateMinim = () => {
  minim.value = !minim.value
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  background-color: white;
}
.view {
  display: flex;
}
.sideSpace {
  width: 0vw;
  transition: Width 0.5s;
}
.sideSpace#max {
  width: 15vw;
}

/* Media tags */
@media (max-aspect-ratio: 1/1) {
  .sideSpace#max {
    width: 0vw;
  }
}
</style>
