<template>
  <div class="config-button" @click="handleClick">
    <p>...</p>
  </div>
</template>

<script setup>
const props = defineProps({
  onClick: Function
})

const handleClick = () => {
  props.onClick()
}
</script>

<style>
.config-button {
  padding: 0.3rem;
  color: var(--gray-1);
  align-self: start;
  text-align: center;
}
.config-button:hover {
  background-color: var(--yellow-2);
}
</style>
