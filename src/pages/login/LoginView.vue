<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Texto de bienvenida -->
      <h1>Bienvenido a</h1>
      <!-- Logo de la plataforma -->
      <img :src="logo" alt="Logo de la Plataforma" class="logo" />
      <!-- Borde debajo del logo -->
      <hr class="divider" />
      <!-- Botón de iniciar sesión -->
      <div class="login-button-container">
        <ButtonSimple msg="Iniciar Sesión →" color="green" @click="login" class="login-button" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import { useApi } from '@/oauth/useApi'
const { postRequest } = useApi()
import logo from '@/assets/Logo/LogoColorVertical.png'
const auth0 = useAuth0()
const router = useRouter()

function login() {
  auth0.loginWithRedirect()
}

// TODO : Redirect to Admin or Doctor UI depending on the user info.
const getCurrentUser = async (_id) => {
  let rol = ''
  try {
    const response = await postRequest(`/users/@me`, { id: _id })
    rol = response.data.rol
  } catch {
    console.error('Error verifying role')
  }
  return rol
}

onMounted(async () => {
  const freeNavigation = import.meta.env.VITE_FREE_NAVIGATION || 'FALSE'
  if (auth0.isAuthenticated.value && freeNavigation === 'FALSE') {
    auth0.getAccessTokenSilently().then((a) => console.log(a))
    let rol = await getCurrentUser(auth0.user.value.sub.split('|')[1])
    if (rol == 'Admin') {
      router.replace({ path: '/admin/user' })
    } else if ((rol == 'Doctor') | (rol == 'Assistant')) {
      router.replace({ path: '/doctor/records' })
    }
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: var(--gray-3);
}

.login-card {
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  width: 25vw;
  height: 75vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 400px;
  min-height: 300px;
}

h1 {
  margin-top: 30px;
  color: var(--gray-1);
  font-size: 24px;
}

.logo {
  width: 150px;
  margin: 20px auto;
}

.divider {
  margin: 5px 0;
  border: 1px solid #ddd;
}

.login-button-container {
  display: flex;
  justify-content: right;
  margin-top: 20px;
  padding: 20px;
  gap: 10px;
}

.login-button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  background-color: var(--green-1);
  color: white;
  border: none;
  cursor: pointer;
}
</style>
