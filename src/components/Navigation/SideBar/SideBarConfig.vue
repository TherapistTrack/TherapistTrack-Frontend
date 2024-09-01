<template>
  <div class="sideBtn">
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
          <!-- Enlace a 'Backup' -->
          <router-link
            to="/config/backup"
            class="option"
            :class="{ selected: selectedOption === 'Backup' }"
          >
            <h4>Backup</h4>
          </router-link>
        </div>
      </div>

      <div class="bottom">
        <div class="userData">
          <p>
            <b>{{ userName }}</b>
          </p>
          <p>{{ userRole }}</p>
        </div>
        <RiLogoutBoxRLine class="icon" size="1.5rem" :color="iconColor" />
      </div>
    </div>
  </div>
  <div class="sideSpace" :id="minim ? 'minimized' : 'maximized'"></div>
</template>

<script setup>
import { RiArrowLeftDoubleFill, RiLogoutBoxRLine } from '@remixicon/vue'
import { ref, defineProps } from 'vue'

const {
  backgroundColor,
  arrowColor,
  iconColor,
  logoSrc,
  logoGraySrc,
  userName,
  userRole,
  selectedOption
} = defineProps({
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
    default: new URL('@/assets/Logo/LogoSoloMono.png', import.meta.url).href
  },
  logoGraySrc: {
    type: String,
    default: new URL('@/assets/Logo/LogoGray.png', import.meta.url).href
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

const minim = ref(true)

const setMin = (val) => {
  minim.value = val
}
</script>

<style scoped>
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
  position: absolute;
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
}

/* mid */
.sideBtn .option {
  display: flex;
  padding: 1vh 1.5vh;
  border-radius: 1vh;
  color: white;
  cursor: pointer;
}

.sideBtn .option.selected {
  background-color: #1565c0;
}

.sideBtn .option h4 {
  color: white;
  margin: 0;
}

.mid .option {
  text-decoration: none;
}

.mid .option h4 {
  margin: 0;
  color: white;
  text-decoration: none;
}

.mid .option:hover h4,
.mid .option.selected h4 {
  text-decoration: none;
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

.sideBtn .bottom .userData {
  color: #ffffff !important;
}

.sideBtn .bottom p {
  margin: 0;
}

.sideBtn .bottom .userData p {
  margin: 0;
  color: #ffffff !important;
}

.sideBtn .bottom .userData b {
  color: #ffffff !important;
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
