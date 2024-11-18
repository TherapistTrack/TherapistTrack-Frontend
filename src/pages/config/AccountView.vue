<template>
  <div class="account-container">
    <div v-if="isLoading">
      <p>Cargando información del usuario...</p>
    </div>
    <div v-else-if="userData">
      <!-- Nombre del usuario -->
      <h1 class="user-name">{{ userData.names }} {{ userData.lastNames }}</h1>

      <!-- Información Básica -->
      <section class="info-section">
        <h2>Información Básica</h2>
        <div class="user-info-row">
          <p class="label">ID:</p>
          <p class="value">{{ userData.id }}</p>
        </div>
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
        <div class="user-info-row">
          <p class="label">Número de Colegiado:</p>
          <p class="value">{{ userData.roleDependentInfo.collegiateNumber }}</p>
        </div>
        <div class="user-info-row">
          <p class="label">Especialidad:</p>
          <p class="value">{{ userData.roleDependentInfo.specialty }}</p>
        </div>
        <!-- Agrega más campos según sea necesario -->
      </section>

      <!-- Enlace para editar información en Auth0 -->
    </div>
    <div v-else>
      <p>Error al cargar la información del usuario.</p>
    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { useApi } from '@/oauth/useApi'
import { onMounted, ref } from 'vue'

// Constants
const { postRequest } = useApi()
const auth0 = useAuth0()
const id = ref('')

// Variables reactivas
const userData = ref(null)
const isLoading = ref(true) // Declarar e inicializar isLoading

// Functions
onMounted(async () => {
  id.value = auth0.user.value.sub.split('|')[1]
  try {
    const response = await postRequest('/users/@me', { id: id.value })
    console.log(response.data)
    userData.value = response.data // Asigna directamente response.data
  } catch (error) {
    console.error('Error al obtener la información del usuario:', error)
    // Manejar el error si es necesario
  } finally {
    isLoading.value = false // Actualizar isLoading a false cuando la carga finaliza
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

h1 {
  font-size: 32px;
  margin-bottom: 20px;
}

.account-info a {
  color: inherit;
  text-decoration: none;
}

.account-info a:hover {
  color: inherit;
  text-decoration: none;
}

.user-name {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
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

.user-info-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
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
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0;
}

.userData {
  color: #ffffff !important;
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
