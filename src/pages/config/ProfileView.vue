<template>
  <div class="profile-container">
    <!-- SideBarConfig ahora está aquí -->
    <SideBarConfig
      :selectedOption="currentOption"
      backgroundColor="#1f3a93"
      arrowColor="#ffffff"
      iconColor="#ffffff"
      :userName="auth0.user.value.name"
      userRole="Usuario"
    />

    <!-- Contenedor principal para las subrutas -->
    <div class="content">
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

watch(
  () => route.path,
  (newPath) => {
    updateSelectedOption(newPath)
  }
)

function updateSelectedOption(path) {
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

updateSelectedOption(route.path)
</script>

<style scoped>
.profile-container {
  display: flex;
  height: 100vh;
}

.content {
  flex-grow: 1;
  padding: 65px;
  background-color: #fff;
  border-radius: 8px;
  height: 100vh;
  overflow-y: auto;
}
</style>
