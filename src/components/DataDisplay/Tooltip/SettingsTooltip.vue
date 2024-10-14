<template>
  <span class="visible" :id="ready == 0 ? '' : ready == 1 ? 'startup' : 'wrapup'">
    <div class="setting-component" ref="myDiv">
      <div class="setting-container">
        <div class="setting-option-red" @click="handleLogout">
          <p>Cerrar Sesión</p>
          <RiLogoutBoxRLine color="var(--red-1)" size="1.2rem" />
        </div>
        <div v-if="settingsCase == 'config'" class="setting-option" @click="handleProfile">
          <p>Expedientes</p>
          <RiFileTextLine color="var(--blue-1)" size="1.2rem" />
        </div>
        <div v-else class="setting-option" @click="handleProfile">
          <p>Perfil</p>
          <RiUserFill color="var(--blue-1)" size="1.2rem" />
        </div>
      </div>
    </div>
    <div class="tail" />
  </span>
</template>

<script setup>
import { RiUserFill, RiLogoutBoxRLine, RiFileTextLine } from '@remixicon/vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
const myDiv = ref(null)
const ready = ref(0)
const props = defineProps({
  onLogout: Function,
  onSecondary: Function,
  onClickOutside: Function,
  settingsCase: String
})

const handleClickOutside = (event) => {
  if (myDiv.value && !myDiv.value.contains(event.target)) {
    ready.value = 2
    setTimeout(() => {
      props.onClickOutside()
    }, 200)
  }
}

const handleLogout = () => {
  props.onLogout()
}
const handleProfile = () => {
  props.onSecondary()
}

onMounted(() => {
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside)
    ready.value = 1
  }, 2)
})

onBeforeUnmount(() => {
  ready.value = 0
  document.removeEventListener('click', handleClickOutside) // Step 4: Remove event listener on unmount
})
</script>

<style>
.visible {
  position: relative;
  transition: all ease-in-out 0.2s;
  opacity: 0;
  margin-top: 0;
}
.visible#startup {
  opacity: 1;
  margin-top: -20px;
}
.visible#wrapup {
  margin-top: 20px;
}

.setting-component {
  position: absolute;
  padding: 0.5rem;
  width: 160px;
  min-height: 5rem;
  left: -4rem;
  top: -6.7rem;
  background-color: white;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.4);
  border-left: 1rem;
  z-index: 2;
}

.setting-component .setting-option,
.setting-component .setting-option-red {
  padding: 0.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 11500;
  transition: all 0.2s;
}

.setting-container {
  display: flex;
  flex-direction: column;
}

.setting-component .setting-option p {
  color: var(--blue-1);
  font-weight: bold;
  font-size: 0.7rem;
  z-index: 60;
}

.setting-component .setting-option-red p {
  color: var(--red-1);
  font-weight: bold;
  font-size: 0.7rem;
  z-index: 60;
}
.setting-component .setting-option-red:hover {
  background-color: var(--red-1);
  cursor: pointer;
}
.setting-component .setting-option-red:hover * {
  fill: var(--white);
  color: var(--white);
}

.setting-component .setting-option:hover {
  background-color: var(--blue-1);
  cursor: pointer;
}

.setting-component .setting-option:hover * {
  fill: var(--white);
  color: var(--white);
}

.tail {
  position: absolute;
  background-color: black;
  height: 1.5rem;
  width: 1.5rem;
  top: -2.5rem;
  transform: rotate(45deg);
  z-index: 2;
  background-color: white;
  border-radius: 5rem 0 0 0;
}
</style>
