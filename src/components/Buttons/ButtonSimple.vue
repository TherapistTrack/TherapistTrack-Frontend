<template>
  <button
    class="button-component"
    @click="handleClick"
    :disabled="disabled"
    :id="disabled ? 'disabled' : 'active'"
  >
    <b>{{ msg }}</b>
  </button>
</template>

<script setup>
const props = defineProps({
  msg: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  onClick: Function
})
function handleClick() {
  props.onClick()
}
</script>

<style>
.button-component {
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 1vh;
  cursor: pointer;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
}
.button-component#disabled {
  background-color: var(--gray-1);
  cursor: not-allowed;
}
.button-component#active {
  background-color: var(--green-1);
  cursor: pointer;
}
.button-component b {
  color: white;
}

.button-component#active:hover {
  background-color: var(--green-2);
}
</style>
