<template>
  <div class="account-container">
    <!-- Estado de Carga -->
    <div v-if="isLoading">
      <p>Cargando información del usuario...</p>
    </div>

    <!-- Estado de Error -->
    <div v-else-if="hasError">
      <p>Error al cargar la información del usuario.</p>
    </div>

    <!-- Estado Normal (Información de Usuario) -->
    <div v-else-if="userData">
      <!-- Nombre del usuario -->
      <h1 class="user-name">{{ fullName }}</h1>

      <!-- Información Básica -->
      <section class="info-section">
        <h2>Información Básica</h2>
        <!-- Campo de ID removido -->
        <div class="user-info-row">
          <p class="label">Rol:</p>
          <p class="value">{{ userData.rol }}</p>
        </div>
      </section>

      <!-- Información de Contacto -->
      <section class="info-section">
        <h2>Información de Contacto</h2>
        <div class="user-info-row">
          <p class="label">Correos:</p>
          <div class="value">
            <ul>
              <li v-for="(mail, index) in userData.mails" :key="index">{{ mail }}</li>
            </ul>
          </div>
        </div>
        <div class="user-info-row">
          <p class="label">Teléfonos:</p>
          <div class="value">
            <ul>
              <li v-for="(phone, index) in userData.phones" :key="index">{{ phone }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Información Adicional Dependiente del Rol -->
      <section v-if="userData.roleDependentInfo" class="info-section">
        <h2>Información Adicional</h2>
        <div class="user-info-row" v-if="userData.roleDependentInfo?.collegiateNumber">
          <p class="label">Número de Colegiado:</p>
          <p class="value">{{ userData.roleDependentInfo.collegiateNumber }}</p>
        </div>
        <div class="user-info-row" v-if="userData.roleDependentInfo?.specialty">
          <p class="label">Especialidad:</p>
          <p class="value">{{ userData.roleDependentInfo.specialty }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useApi } from '@/oauth/useApi'

const { postRequest } = useApi()
const auth0 = useAuth0()

// Reactive vars
const isLoading = ref(true)
const hasError = ref(false)
const userData = ref(null)
const userId = ref('')

// Computed
const fullName = computed(() => {
  const names = userData.value?.names || ''
  const lastNames = userData.value?.lastNames || ''
  return `${names} ${lastNames}`.trim()
})

onMounted(async () => {
  try {
    userId.value = auth0.user.value.sub.split('|')[1]
    const response = await postRequest('/users/@me', { id: userId.value })
    userData.value = response.data
  } catch (error) {
    console.error('Error al obtener la información del usuario:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.account-container {
  padding: 2rem 3rem;
  width: 100vw;
  background-color: white;
  height: 100vh;
  margin: 0 auto;
}

/* Ajustes en el título del usuario */
h1 {
  font-size: 32px;
  margin-bottom: 20px;
}

/* Nombre del usuario a la izquierda y en negrita */
.user-name {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
  text-align: left;
}

.info-section {
  margin-bottom: 2rem;
}

.info-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
}

/* Mover la información más a la derecha para reforzar jerarquía */
.user-info-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  margin-left: 2rem; /* mayor margen a la izquierda */
}

.user-info-row .label {
  width: 180px;
  font-weight: bold;
  color: #333;
}

.user-info-row .value {
  flex: 1;
  color: #555;
}

.user-info-row .value ul {
  list-style-type: none; /* Sin bullet points */
  padding-left: 0;
  margin: 0;
}

/* Opcional: Podrías ajustar el estilo de las li si prefieres */
.user-info-row .value li {
  margin-bottom: 0.5rem;
}

.edit-profile-link {
  text-align: center;
  margin-top: 2rem;
}

.edit-profile-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.edit-profile-link a:hover {
  text-decoration: underline;
}
</style>
