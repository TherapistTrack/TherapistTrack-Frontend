<template>
  <div class="sideBtn" :style="{ backgroundColor: backgroundColor }">
    <!-- SideBar Configuration -->
    <img
      @click="setMin(false)"
      class="sideLogo"
      :src="logoSrc"
      alt="Therapist Track Logo"
      :id="minim ? 'minimized' : 'maximized'"
    />

    <div
      class="bar"
      :id="minim ? 'minimized' : 'maximized'"
      :style="{ backgroundColor: backgroundColor }"
    >
      <div class="gravityTop">
        <div class="top" @click="setMin(true)">
          <img class="logo" :src="logoGraySrc" alt="Therapist Track" />
          <RiArrowLeftDoubleFill size="1.5rem" :color="arrowColor" />
        </div>
        <div class="mid">
          <!-- Enlace a 'Mi Cuenta' -->
          <router-link
            to="/config/account"
            class="option"
            :class="{ selected: selectedOption === 'Mi Cuenta' }"
          >
            <h4>Mi Cuenta</h4>
          </router-link>
          <!-- Enlace a 'Pacientes' -->
          <router-link
            to="/config/patients"
            class="option"
            :class="{ selected: selectedOption === 'Pacientes' }"
          >
            <h4>Pacientes</h4>
          </router-link>
          <!-- Enlace a 'Archivos' -->
          <router-link
            to="/config/files"
            class="option"
            :class="{ selected: selectedOption === 'Archivos' }"
          >
            <h4>Archivos</h4>
            <!-- Corregido a 'Archivos' -->
          </router-link>
          <!-- Enlace a 'Backup' -->
        </div>
      </div>

      <div class="bottom">
        <div class="userData">
          <p>
            <b>{{ userName }}</b>
          </p>
          <p>{{ userRole }}</p>
        </div>
        <div class="settings-menu">
          <SettingsTooltip
            v-if="trySetting"
            v-on:logout="onLogout"
            :on-secondary="handleRecords"
            :onClickOutside="undoSetting"
            settings-case="config"
          />
          <RiSettings3Fill
            class="icon"
            size="1.4rem"
            color="var(--light-blue-1)"
            @click="doSetting"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="sideSpace" :id="minim ? 'minimized' : 'maximized'"></div>
  <AlertOptionSimple
    v-if="tryLogout"
    msg="¿Estas seguro que deseas cerrar sesión?"
    :on-no="cancelLogout"
    :on-yes="logout"
  />
</template>

<script setup>
import { RiArrowLeftDoubleFill, RiSettings3Fill } from '@remixicon/vue'
import SettingsTooltip from '@/components/DataDisplay/Tooltip/SettingsTooltip.vue'
import AlertOptionSimple from '@/components/Feedback/Alerts/AlertOptionSimple.vue'
import { ref, defineProps } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRouter } from 'vue-router'

const auth0 = useAuth0()
const minim = ref(true)
const trySetting = ref(false)
const tryLogout = ref(false)
const router = useRouter()

const emit = defineEmits(['updateValue'])

const { backgroundColor, arrowColor, logoSrc, logoGraySrc, userName, userRole, selectedOption } =
  defineProps({
    backgroundColor: {
      type: String,
      default: '#e3f2fd'
    },
    arrowColor: {
      type: String,
      default: '#ffffff'
    },
    iconColor: {
      type: String,
      default: '#ffffff'
    },
    logoSrc: {
      type: String,
      default: new URL('@/assets/Logo/LogoSoloWhite.png', import.meta.url).href
    },
    logoGraySrc: {
      type: String,
      default: new URL('@/assets/Logo/LogoWhite.png', import.meta.url).href
    },
    userName: {
      type: String,
      default: 'Jose Marchena'
    },
    userRole: {
      type: String,
      default: 'Usuario'
    },
    selectedOption: {
      type: String,
      default: 'Mi Cuenta'
    }
  })

const handleRecords = () => {
  router.push('/doctor/records')
}
const onLogout = () => {
  tryLogout.value = true
}
const cancelLogout = () => {
  tryLogout.value = false
}

const logout = () => {
  auth0.logout({
    logoutParams: {
      returnTo: import.meta.env.VITE_OAUTH_LOGOUT_URI
    }
  })
}
const doSetting = () => {
  trySetting.value = true
}
const undoSetting = () => {
  trySetting.value = false
}
const setMin = (val) => {
  emitUpdate(val)
  minim.value = val
}

const emitUpdate = (val) => {
  emit('updateValue', val)
}
</script>

<style scoped>
.icon {
  transition:
    fill 0.2s,
    transform 0.5s;
  cursor: pointer;
}
.icon:hover {
  fill: var(--white);
  transform: rotate(45deg);
}

.sideSpace {
  width: 0vw;
  transition: Width 0.5s;
}

.sideBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 8vh;
  width: 8vw;
  max-width: 100px;
  margin: 0;
  padding: 0;
}

.sideBtn .sideLogo {
  max-height: 6vh;
}

.sideBtn .bar {
  top: 0vh;
  z-index: 200;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 20vw;
  padding: 1rem;
  border-radius: 0 3vh 3vh 0;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.11);
  transition: left 0.5s;
  position: fixed;
  left: 0;
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
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

/* mid */
.sideBtn .option {
  display: flex;
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  color: white;
  cursor: pointer;
}

.sideBtn .option.selected {
  background-color: var(--blue-1);
}

.mid .option {
  text-decoration: none;
}
.mid .option h4 {
  color: white;
  font-size: 0.85rem;
}

a:hover {
  background-color: var(--blue-2);
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

.sideBtn .bottom .userData * {
  font-size: smaller;
  color: var(--white);
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
  width: 8.5vw;
}

.sideLogo#minimized {
  cursor: pointer;
}

sideLogo#maximized {
  cursor: default;
}

#selected {
  background-color: var(--gray-1);
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
