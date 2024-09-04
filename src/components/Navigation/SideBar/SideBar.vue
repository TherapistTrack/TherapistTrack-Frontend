<template>
  <div class="sideBtn">
    <img
      @click="handleClick"
      class="sideLogo"
      src="@/assets/Logo/LogoSoloMono.png"
      alt="Therapist Track Logo"
      :id="localMin ? 'minimized' : 'maximized'"
    />

    <div class="bar" :id="localMin ? 'minimized' : 'maximized'">
      <div class="gravityTop">
        <div class="top" @click="handleClick">
          <img class="logo" src="@/assets/Logo/LogoGray.png" alt="Therapist Track" />
          <RiArrowLeftDoubleFill size="1.5rem" color="var(--gray-1)" alt="" />
        </div>
        <div class="mid">
          <div class="option" id="selected">
            <h4>Usuarios</h4>
          </div>
        </div>
      </div>

      <div class="bottom">
        <div class="userData">
          <p><b>Josue Rodriguez</b></p>
          <p>Administrador</p>
        </div>
        <RiLogoutBoxRLine class="icon" size="1.5rem" color="var(--gray-2)" @click="handleLogout" />
      </div>
    </div>
  </div>
  <AlertOptionSimple
    v-if="logoutAttempt"
    msg="¿Estas seguro que deseas cerrar sesión?"
    :on-no="abortLogout"
    :on-yes="logout"
  />
</template>

<script setup>
import { RiArrowLeftDoubleFill, RiLogoutBoxRLine } from '@remixicon/vue'
import AlertOptionSimple from '@/components/Feedback/Alerts/AlertOptionSimple.vue'
import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
const auth0 = useAuth0()
const localMin = ref(false)
const logoutAttempt = ref(false)
defineProps({
  minim: {
    type: Boolean,
    required: true
  }
})

const handleClick = () => {
  localMin.value = !localMin.value
  emitUpdate()
}
const handleLogout = () => {
  logoutAttempt.value = true
}
const abortLogout = () => {
  logoutAttempt.value = false
}

const emit = defineEmits(['updateValue'])
const emitUpdate = () => {
  emit('updateValue')
}

const logout = () => {
  auth0.logout({
    logoutParams: {
      returnTo: import.meta.env.VITE_OAUTH_LOGOUT_URI
    }
  })
}
</script>

<style>
.sideSpace {
  width: 0vw;
  transition: Width 0.5s;
}
.icon {
  transition: fill 0.2s;
  cursor: pointer;
}
.icon:hover {
  fill: var(--gray-1);
}
.sideBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--gray-3);
  height: 8vh;
  width: 8vw;
  max-width: 100px;
}

.sideBtn .sideLogo {
  max-height: 6vh;
}

.sideBtn .bar {
  top: 0vh;
  z-index: 200;
  background-color: var(--gray-3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  height: 100vh;
  width: 20vw;

  padding: 1rem;

  border-radius: 0 3vh 3vh 0;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.11);
  transition: left 0.5s;
}

/* Top */
.sideBtn .bar .top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1vh;
  width: 100%;
  cursor: pointer;
}

.sideBtn .bar .top .logo {
  height: auto;
  max-width: 11vw;
}
.sideBtn .bar .mid {
  padding-top: 6vh;
}

/* mid */
.sideBtn .option {
  display: flex;
  padding: 0.4vh 0.4vh 0 1.5vh;
  border-radius: 1vh;
}
/* Bottom */
.sideBtn .bottom {
  padding: 1vh;
  height: 10vh;
  border-top: 1px solid var(--gray-2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1vw;
}

.sideBtn .bottom * {
  font-size: smaller;
  color: var(--gray-1);
}

/* Animations */
.bar#minimized {
  left: -20vw;
}

.bar#maximized {
  left: 0;
}

.sideSpace#minimized {
  width: 0;
}

.sideSpace#maximized {
  width: 12vw;
}

.sideLogo#minimized {
  cursor: pointer;
}

.sideLogo#maximized {
  cursor: default;
}

#selected {
  background-color: var(--gray-1);
}

#selected h4 {
  color: aliceblue;
}

@media (min-aspect-ratio: 1/1) {
  .sideBtn {
    height: 7vh;
    width: 8vw;
    max-width: 70px;
    min-width: 40px;

    max-height: 40px;
    min-height: 35px;
  }
  .sideBtn .bar {
    max-width: 200px;
  }
  .sideBtn .sideLogo {
    max-height: 32px;
  }
}

@media (max-aspect-ratio: 1/1) {
  .sideBtn {
    height: 6vh;
    width: 6vh;
  }
  .sideBtn .bar {
    min-width: 20vh;
  }
  .sideBtn .sideLogo {
    max-height: 4vh;
  }
  .bar#minimized {
    left: -20vh;
  }

  .bar#maximized {
    left: 0;
  }
  .sideBtn .bar .top .logo {
    height: auto;
    max-width: 10vh;
  }
  .sideSpace#maximized {
    width: 0vw;
  }
}
</style>
