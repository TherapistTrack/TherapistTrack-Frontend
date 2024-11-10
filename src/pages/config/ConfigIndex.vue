<template>
  <div class="config-top">
    <SideBarConfig
      :selectedOption="currentOption"
      backgroundColor="var(--dark-blue-1)"
      arrowColor="#ffffff"
      iconColor="#ffffff"
      :userName="auth0.user.value.name"
      userRole="Usuario"
      @updateValue="updateMinim"
    />
    <div class="view">
      <div class="sideSpace" :id="minim ? '' : 'max'"></div>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import SideBarConfig from '@/components/Navigation/SideBar/SideBarConfig.vue'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

const auth0 = useAuth0()
const route = useRoute()
const currentOption = ref('Mi Cuenta')
const minim = ref(true)

watch(
  () => route.path,
  (newPath) => {
    updateSelectedOption(newPath)
  }
)

const updateSelectedOption = (path) => {
  if (path.includes('/config/account')) {
    currentOption.value = 'Mi Cuenta'
  } else if (path.includes('/config/patients')) {
    currentOption.value = 'Pacientes'
  } else if (path.includes('/config/template')) {
    currentOption.value = 'Pacientes'
  } else if (path.includes('/config/files')) {
    currentOption.value = 'Archivos'
  } else if (path.includes('/config/backup')) {
    currentOption.value = 'Backup'
  } else {
    currentOption.value = ''
  }
}

const updateMinim = (val) => {
  minim.value = val
}

updateSelectedOption(route.path)
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.config-top {
  background-color: white;
}

.view {
  display: flex;
  height: auto;
  background-color: white;
  height: 100%;
  overflow-y: scroll;
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
