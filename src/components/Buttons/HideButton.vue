<template>
  <div @click="handleClick" ref="myDiv" class="hide-ui">
    <RiEyeOffFill color="var(--red-1)" size="1rem" />
    Esconder
  </div>
</template>

<script setup>
import { RiEyeOffFill } from '@remixicon/vue'

import { ref, onMounted, onBeforeUnmount } from 'vue'
const myDiv = ref(null) // Step 1: Create a reference to the div
const props = defineProps({
  onClick: Function,
  onClickOutside: Function
})
const handleClick = () => {
  props.onClick()
}

const handleClickOutside = (event) => {
  if (myDiv.value && !myDiv.value.contains(event.target)) {
    // Handle the click outside the div
    props.onClickOutside()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside) // Step 2: Add event listener on mount
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside) // Step 4: Remove event listener on unmount
})
</script>

<style>
.hide-ui {
  position: absolute;
  background-color: white;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  border: 2px solid white;
  z-index: 1;
  color: var(--red-1);
  align-items: center;
  transition: border 0.2s;
}

.hide-ui:hover {
  border: 2px solid var(--red-2);
}
</style>
