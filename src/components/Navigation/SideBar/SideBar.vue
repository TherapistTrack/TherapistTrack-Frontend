<template>
  <div class="sideBtn">
    <img
      @click="setMin(false)"
      class="sideLogo"
      src="@/assets/Logo/LogoSoloMono.png"
      alt="Therapist Track Logo"
      :id="minim ? 'minimized' : 'maximized'"
    />

    <div class="bar" :id="minim ? 'minimized' : 'maximized'">
      <div class="gravityTop">
        <div class="top" @click="setMin(true)">
          <img class="logo" src="@/assets/Logo/LogoGray.png" alt="Therapist Track" />
          <RiArrowLeftDoubleFill size="1.5rem" color="var(--gray-1)" alt="" />
        </div>
        <div class="mid">
          <div class="option" @click="setSelected(true)" :id="selected ? 'selected' : ''">
            <h4>Usuarios</h4>
          </div>
          <div class="option" @click="setSelected(false)" :id="!selected ? 'selected' : ''">
            <h4>Roles</h4>
          </div>
        </div>
      </div>

      <div class="bottom">
        <div class="userData">
          <p><b>Josue Rodriguez</b></p>
          <p>Administrador</p>
        </div>
        <RiLogoutBoxRLine class="icon" size="1.5rem" color="var(--gray-2)" />
      </div>
    </div>
  </div>
  <div class="sideSpace" :id="minim ? 'minimized' : 'maximized'"></div>
</template>

<script setup>
import { RiArrowLeftDoubleFill, RiLogoutBoxRLine } from '@remixicon/vue'
import { ref } from 'vue'
const minim = ref(true)
const selected = ref(true)

const setMin = (val) => {
  minim.value = val
}

const setSelected = (val) => {
  selected.value = val
}
</script>

<style>
.sideSpace {
  width: 0vw;
  transition: Width 0.5s;
}

.sideBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--gray-3);
  height: 5vw;
  width: 8vw;
}

.sideBtn .sideLogo {
  max-height: 6vh;
}

.sideBtn .bar {
  top: 0vh;
  z-index: 400;
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
  cursor: pointer;
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
</style>
