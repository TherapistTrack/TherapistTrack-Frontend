<template>
  <button @click="handleClick" :disabled="disabled" :id="disabled ? 'disabled' : 'active'">
    <b>{{ msg }}</b>
  </button>
</template>

<script setup>
const props = defineProps({
  msg: String,
  disabled: Boolean,
  onClick: Function
})
function handleClick() {
  props.onClick()
}
</script>

<style>
button#disabled,
button#active {
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 1vh;
  cursor: pointer;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
}
button#disabled {
  background-color: var(--gray-1);
  cursor: not-allowed;
}
button#active {
  background-color: var(--green-1);
  cursor: pointer;
}
button b {
  color: white;
}

button:hover {
  background-color: var(--green-2);
}
</style>
