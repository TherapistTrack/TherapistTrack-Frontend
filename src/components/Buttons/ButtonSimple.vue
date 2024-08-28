<template>
  <button
    :class="
      color == 'yellow'
        ? 'button-yellow'
        : color == 'red'
          ? 'button-red'
          : color == 'white'
            ? 'button-white'
            : ''
    "
    @click="handleClick"
    :disabled="disabled"
    :id="disabled ? 'disabled' : ''"
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
  color: String,
  onClick: Function
})
function handleClick() {
  props.onClick()
}
</script>

<style>
button {
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 0.2rem;
  cursor: pointer;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
  background-color: var(--green-1);
  cursor: pointer;
}
button b {
  color: white;
}
button#disabled {
  background-color: var(--gray-1);
  cursor: unset;
}
button#disabled b {
  color: white;
}

.button-yellow {
  background-color: var(--yellow-1);
}
.button-red {
  background-color: var(--red-1);
}
.button-white {
  background-color: var(--white-1);
  border: 1px solid var(--gray-2);
}
.button-white b {
  color: var(--gray-1);
}

.button-green:hover {
  background-color: var(--green-2);
}
.button-yellow:hover {
  background-color: var(--yellow-2);
}
.button-red:hover {
  background-color: var(--red-2);
}
.button-white:hover {
  background-color: var(--gray-3);
}
</style>
