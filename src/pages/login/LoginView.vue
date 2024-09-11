<template>
  <div class="login-container">
    <div class="login-form">
      <button @click="login">Ingresar →</button>
      <button @click="logout">Logout →</button>
      <p v-if="mensajeError" class="error-message">{{ mensajeError }}</p>
    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const auth0 = useAuth0()
const router = useRouter()

function login() {
  auth0.loginWithRedirect()
}

function logout() {
  auth0.logout({
    logoutParams: {
      returnTo: import.meta.env.VITE_OAUTH_LOGOUT_URI
    }
  })
}

// TODO : Redirect to Admin or Doctor UI depending on the user info.
onMounted(() => {
  const freeNavigation = import.meta.env.VITE_FREE_NAVIGATION || 'FALSE'
  if (auth0.isAuthenticated.value && freeNavigation === 'FALSE') {
    auth0.getAccessTokenSilently().then((a) => console.log(a))
    router.replace({ path: '/admin/user' })
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

button {
  background: #f9bb42;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  align-self: flex-end;
  transition: background-color 0.2s;
}

button:hover {
  background: #ffcd6c;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 1rem;
}
</style>
