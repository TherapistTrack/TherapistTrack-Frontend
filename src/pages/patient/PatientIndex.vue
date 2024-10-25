<template>
  <div class="tabs">
    <RecordSideBar :minim="minim" @updateValue="updateMinim" />
    <!-- All the tabs will be shown here -->
  </div>
  <div class="view">
    <div class="sideSpace" :id="minim ? '' : 'max'"></div>
    <router-view @addToast="addToast" />
  </div>
  <div class="toast-loader">
    <div class="sideSpace" :id="minim ? '' : 'max'"></div>
    <ToastLoader v-model:toastList="toastList" />
  </div>
</template>

<script setup>
import RecordSideBar from '@/components/Navigation/SideBar/RecordSideBar.vue'
import { ref } from 'vue'
import ToastLoader from '@/components/Feedback/Toast/ToastLoader.vue'
const minim = ref(true)
const toastList = ref([])
const addToast = (toast) => {
  toastList.value.push(toast)
}
const updateMinim = () => {
  minim.value = !minim.value
}
</script>

<style>
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
.toast-loader {
  position: fixed;
  display: flex;
  bottom: 0;
}

.sideSpace {
  width: 0vw;
  transition: Width 0.5s;
}
.sideSpace#max {
  width: 250px;
}

/* Media tags */
@media (max-aspect-ratio: 1/1) {
  .sideSpace#max {
    width: 0vw;
  }
}
</style>
