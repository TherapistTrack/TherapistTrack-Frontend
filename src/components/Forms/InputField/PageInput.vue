<template>
  <span class="rows">
    <p>No. Filas</p>
    <span class="limiter">
      <input class="simple-input" :value="modelValue" @blur="updateValue" @keypress="updateValue" />
    </span>
  </span>
</template>

<script setup>
const emit = defineEmits(['update:modelValue'])
const updateValue = (event) => {
  if (event.key == 'Enter') {
    emit('update:modelValue', event.target.value)
  }
}
defineProps({
  modelValue: Number
})
</script>

<style>
.rows {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.limiter * {
  max-width: 4rem;
  padding: 0.5rem;
}
.rows p {
  display: inline-block;
  font-size: 0.8rem;
}
</style>
