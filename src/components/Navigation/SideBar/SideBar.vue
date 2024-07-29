<template>
  <div class="sideBar">
    <div class="gravityTop">
      <div class="top">
        <img v-show="minim" class="logo" src="@/assets/Logo/LogoGray.png" alt="Therapist Track" />

        <RiArrowLeftDoubleFill size="1.5rem" color="var(--gray-1)" alt="minimize" @click="setMin" />
      </div>
      <br />
      <div class="middle" v-show="minim">
        <div class="option" @click="setSelected(true)" :id="selected ? 'selected' : ''">
          <h4>Usuarios</h4>
        </div>
        <div class="option" @click="setSelected(false)" :id="!selected ? 'selected' : ''">
          <h4>Roles</h4>
        </div>
      </div>
    </div>
    <div v-show="minim" class="bottom">
      <div class="userData">
        <p><b>Josue Rodriguez</b></p>
        <p>Administrador</p>
      </div>
      <RiLogoutBoxRLine class="logo" size="1.5rem" color="var(--gray-2)" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RiArrowLeftDoubleFill, RiLogoutBoxRLine } from '@remixicon/vue'

const minim = ref(true)
const selected = ref(true)

const setMin = () => {
  minim.value = !minim.value
}

const setSelected = (val) => {
  selected.value = val
}
</script>

<style>
.sideBar {
  background-color: var(--gray-3);
  padding: 1rem;
  border-radius: 0 3vh 3vh 0;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.11);
  width: fit-content;
  max-width: 19vw;
  height: 100vh;
  transition: width 2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Top */

.sideBar .top {
  display: grid;
  align-items: center;
  grid-template-columns: 2fr 1fr;
  gap: 1vh;
  max-width: 15vw;
}
.sideBar .top .logo {
  height: auto;
  max-width: 11vw;
}
.sideBar .bottom .logo {
  height: auto;
  min-width: 3vw;
}

/* Mid */
.sideBar .middle {
  display: flex;
  flex-direction: column;
}

/* Bottom */
.sideBar .bottom {
  padding: 1vh;
  height: 10vh;
  border-top: 1px solid var(--gray-2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1vw;
}
.sideBar .bottom * {
  font-size: smaller;
  color: var(--gray-1);
}

/* Other */
.minimize {
  max-height: 5vh;
  transition: background-color 0.3s;
  border-radius: 2vh;
  min-width: 5vh;
}

.minimize:hover {
  background-color: var(--gray-1);
}

.sideBar h4 {
  color: var(--gray-1);
}

.option {
  display: flex;
  padding: 0.4vh 0.4vh 0 1.5vh;
  border-radius: 1vh;
  cursor: pointer;
}

#selected {
  background-color: var(--gray-1);
}

#selected h4 {
  color: aliceblue;
}
</style>
