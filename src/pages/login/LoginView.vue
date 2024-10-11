<template>
  <div class="login-container">
    <div class="login-form">
      <ButtonSimple :msg="'Iniciar Sesión ->'" :onClick="login" :color="''" />
      <!-- <button @click="logout">Logout →</button> -->
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
      router.replace({ path: '/record/main' })
    }
  }
})
</script>

<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #edece8;
  margin: 0;
  padding: 0;
}

.login-form {
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.804);
  width: 390px;
  display: flex;
  flex-direction: column;
  text-align: left;
  position: relative;
}

.login-form h1 {
  text-align: center;
  color: black;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: black;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  box-sizing: border-box;
}

.icon-eye {
  position: absolute;
  cursor: pointer;
  right: 1rem;
  top: 1rem;
}
.error-message {
  color: red;
  text-align: center;
  margin-top: 1rem;
}
</style>
