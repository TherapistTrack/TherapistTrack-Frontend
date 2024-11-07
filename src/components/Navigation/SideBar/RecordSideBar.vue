<template>
  <div class="R-sideBtn">
    <div class="clickable" @click="handleClick">
      <img
        class="sideLogo"
        src="@/assets/Logo/LogoSoloWhite.png"
        alt="Therapist Track Logo"
        :id="localMin ? 'minimized' : 'maximized'"
      />
    </div>

    <div class="bar" :id="localMin ? 'minimized' : 'maximized'">
      <div class="gravityTop">
        <div class="top" @click="handleClick">
          <img class="logo" src="@/assets/Logo/LogoWhite.png" alt="Therapist Track" />
          <RiArrowLeftDoubleFill size="1.5rem" color="White" alt="minimize" />
        </div>
        <div class="mid">
          <b>Recientes</b>
          <div class="option" :id="select == 0 ? 'selected' : ''" @click="setSelect(0)">
            ● Daniel Rayo
          </div>
          <div class="option" :id="select == 1 ? 'selected' : ''" @click="setSelect(1)">
            ● Esteban Zambrano
          </div>
          <div class="option" :id="select == 2 ? 'selected' : ''" @click="setSelect(2)">
            ● Juan Pablo Solis
          </div>
        </div>
      </div>

      <div class="bottom">
        <div class="userData">
          <p>
            <b>{{ auth0.user.value.name }}</b>
          </p>
          <p>Administrador</p>
        </div>
        <div class="settings-menu">
          <SettingsMenu
            v-if="trySetting"
            v-on:logout="handleLogout"
            :on-secondary="handleProfile"
            :onClickOutside="undoSetting"
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
  <div class="sideSpace" :id="localMin ? 'minimized' : 'maximized'"></div>
  <AlertOptionSimple
    v-if="logoutAttempt"
    msg="¿Estas seguro que deseas cerrar sesión?"
    :on-no="abortLogout"
    :on-yes="logout"
  />
</template>

<script setup>
import { RiArrowLeftDoubleFill, RiSettings3Fill } from '@remixicon/vue'
import SettingsMenu from '@/components/DataDisplay/Tooltip/SettingsTooltip.vue'
import AlertOptionSimple from '@/components/Feedback/Alerts/AlertOptionSimple.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
const auth0 = useAuth0()
const trySetting = ref(false)
const logoutAttempt = ref(false)
const router = useRouter()

const doSetting = () => {
  trySetting.value = true
}
const undoSetting = () => {
  trySetting.value = false
}
const handleLogout = () => {
  logoutAttempt.value = true
}
const abortLogout = () => {
  logoutAttempt.value = false
}
const handleProfile = () => {
  router.push('/config')
}

defineProps({
  minim: {
    type: Boolean,
    required: true
  }
})
const localMin = ref(true)

const select = ref(0)
const setSelect = (val) => {
  select.value = val
}

const handleClick = () => {
  localMin.value = !localMin.value
  emitUpdate()
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
.settings-menu {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sideSpace {
  width: 0vw;
  transition: Width 0.5s;
}
.R-sideBtn .icon {
  transition:
    fill 0.2s,
    transform 0.5s;
  cursor: pointer;
}
.R-sideBtn .icon:hover {
  fill: var(--white);
  transform: rotate(45deg);
}
.R-sideBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--blue-1);
  height: 8vh;
  width: 8vw;
  max-width: 100px;
}

.R-sideBtn .sideLogo {
  max-height: 6vh;
}

.R-sideBtn .bar {
  top: 0vh;
  z-index: 200;
  background-color: var(--blue-1);
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

.R-sideBtn .bar * {
  color: var(--white);
}
/* Top */
.R-sideBtn .bar .top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1vh;
  width: 100%;
  cursor: pointer;
}

.R-sideBtn .bar .top .logo {
  height: auto;
  max-width: 11vw;
}
/* mid */
.R-sideBtn .bar .mid {
  padding-top: 6vh;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.R-sideBtn .bar .mid b {
  color: var(--light-blue-1);
}

.R-sideBtn .bar .mid .option {
  display: flex;
  padding: 0.4vh 0.4vh 0 1.5vh;
  border-radius: 1vh;
  cursor: pointer;
  align-items: center;
}
/* Bottom */
.R-sideBtn .bottom {
  padding: 1vh;
  height: 10vh;
  border-top: 1px solid var(--white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1vw;
}

.R-sideBtn .bottom * {
  font-size: smaller;
  color: var(--white);
}

.R-sideBtn .clickable {
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
}
/* Animations */

.R-sideBtn .bar#maximized {
  left: 0;
}

.sideSpace#minimized {
  width: 0;
}

.sideSpace#maximized {
  width: 160px;
}

.R-sideBtn .option#selected {
  background-color: var(--light-blue-2);
  color: var(--dark-blue-1);
}

@media (min-aspect-ratio: 1/1) {
  .R-sideBtn {
    height: 7vh;
    width: 8vw;
    max-width: 70px;
    min-width: 40px;

    max-height: 40px;
    min-height: 35px;
  }
  .R-sideBtn .bar {
    max-width: 200px;
  }
  .R-sideBtn .sideLogo {
    max-height: 32px;
  }
  .bar#minimized {
    left: -200px;
  }
}

@media (max-aspect-ratio: 1/1) {
  .R-sideBtn {
    height: 6vh;
    width: 6vh;
  }
  .R-sideBtn .bar {
    min-width: 200px;
  }
  .R-sideBtn .sideLogo {
    max-height: 4vh;
  }
  .bar#minimized {
    left: -200px;
  }

  .bar#maximized {
    left: 0;
  }
  .R-sideBtn .bar .top .logo {
    height: auto;
    max-width: 13vh;
  }
  .sideSpace#maximized {
    width: 0vw;
  }
}
</style>
