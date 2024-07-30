<template>
  <button @click="handleClick">
    <b>{{ msg }}</b>
  </button>
</template>

<script setup>
const props = defineProps({
  msg: String,
  color: String,
  onClick: Function
})
function handleClick() {
  props.onClick()
}
</script>

<style>
button {
  background-color: var(--green-1);
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 1vh;
  cursor: pointer;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
}
button b {
  color: white;
}

button:hover {
  background-color: var(--green-2);
}
</style>
