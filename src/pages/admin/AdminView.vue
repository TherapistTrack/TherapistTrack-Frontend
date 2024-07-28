<template>
  <div class="view">
    <SideBar />
    <router-view />
  </div>
</template>
<script setup>
import SideBar from '@/components/Navigation/SideBar/SideBar.vue'
</script>

<style>
.view {
  display: flex;
}
</style>
