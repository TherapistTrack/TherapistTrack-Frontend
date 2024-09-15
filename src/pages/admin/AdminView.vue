<template>
  <span>
    <div class="tabs">
      <SideBar :minim="minim" @updateValue="updateMinim" :user="auth0.user.value" />
    </div>
    <div class="view">
      <div class="sideSpace" :id="minim ? '' : 'max'"></div>
      <router-view @addToast="addToast" />
    </div>
  </span>
  <div class="toast-loader">
    <div class="sideSpace" :id="minim ? '' : 'max'"></div>
    <ToastLoader v-model:toastList="toastList" />
  </div>
</template>
<script setup>
import SideBar from '@/components/Navigation/SideBar/SideBar.vue'
import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import ToastLoader from '@/components/Feedback/Toast/ToastLoader.vue'
const auth0 = useAuth0()
console.log(auth0.user)
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
  justify-content: space-between;
}
.view {
  display: flex;
  height: 100%;
}
.sideSpace {
  width: 0vw;
  transition: Width 0.5s;
}
.sideSpace#max {
  width: 200px;
}
.toast-loader {
  position: relative;
  display: flex;
}

/* Media tags */
@media (max-aspect-ratio: 1/1) {
  .sideSpace#max {
    width: 0vw;
  }
}
</style>
