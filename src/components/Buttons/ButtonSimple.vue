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
  background-color: var(--vt-c-green-1);
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 1vh;
  cursor: pointer;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  align-self: flex-end;
  transition: background-color 0.2s;
}

button:hover {
  background-color: var(--vt-c-green-2);
}
</style>
