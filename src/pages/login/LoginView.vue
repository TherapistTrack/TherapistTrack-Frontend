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
import logo from '@/assets/Logo/LogoColorVertical.png'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'

const auth0 = useAuth0()
const router = useRouter()

function login() {
  auth0.loginWithRedirect()
}

/*function logout() {
  auth0.logout({
    logoutParams: {
      returnTo: import.meta.env.VITE_OAUTH_LOGOUT_URI
    }
  })
}*/

// TODO : Redirect to Admin or Doctor UI depending on the user info.
onMounted(() => {
  const freeNavigation = import.meta.env.VITE_FREE_NAVIGATION || 'FALSE'

  // Solo redirige si el usuario está autenticado
  if (auth0.isAuthenticated.value) {
    if (freeNavigation === 'FALSE') {
      auth0.getAccessTokenSilently().then((token) => {
        console.log(token)
        router.replace({ path: '/admin/user' })
      })
    }
  } else {
    console.log('No autenticado, permanece en la página de login.')
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
  color: var(--gray-2);
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
