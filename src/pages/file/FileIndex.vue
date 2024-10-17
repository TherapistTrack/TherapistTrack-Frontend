<template>
  <div class="tabs">asd</div>
  <div class="view">
    <router-view />
  </div>
</template>

<script setup></script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  background-color: white;
  font-family: 'MotivaSansMedium';
}

.tabs {
  background-color: var(--gray-3);
  border-bottom: 1px solid var(--gray-4);
  display: flex;
}
.view {
  display: flex;
  height: auto;
  background-color: white;
}
</style>
