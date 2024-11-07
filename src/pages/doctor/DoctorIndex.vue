<template>
  <div class="doctor-top">
    <RecordSideBar v-if="showSidebar" :minim="minim" @updateValue="updateMinim" />
    <Tabs />
  </div>
  <div class="view">
    <div class="sideSpace" :id="minim ? '' : 'max'"></div>
    <router-view @addToast="addToast" />
  </div>
  <div class="toast-loader">
    <div class="sideSpace" :id="minim ? '' : 'max'"></div>
    <span>
      <ToastLoader v-model:toastList="toastList" />
    </span>
  </div>
</template>

<script setup>
import RecordSideBar from '@/components/Navigation/SideBar/RecordSideBar.vue'
import { ref } from 'vue'
import Tabs from '@/components/Tabs/TabComponent.vue'
import ToastLoader from '@/components/Feedback/Toast/ToastLoader.vue'

const showSidebar = ref(true)

const minim = ref(true)
const toastList = ref([])

const addToast = (toast) => {
  let newToast = {
    ...toast,
    id: [Math.floor(Math.random() * 100) + 1]
  }
  toastList.value.push(newToast)
}

const updateMinim = () => {
  minim.value = !minim.value
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  background-color: white;
  font-family: 'MotivaSansMedium';
}

.doctor-top {
  display: flex;
  background-color: var(--gray-3);
  border-bottom: 1px solid var(--gray-4);
}
.view {
  display: flex;
  height: auto;
  background-color: white;
  height: 100%;
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
  width: 200px;
}

/* Media tags */
@media (max-aspect-ratio: 1/1) {
  .sideSpace#max {
    width: 0vw;
  }
}
</style>
