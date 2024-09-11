<template>
  <div class="checkbox-group">
    <input type="checkbox" :id="id" :checked="modelValue" @change="updateValue" />
    <label :for="id">{{ label }}</label>
  </div>
</template>

<script setup>
const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  emit('update:modelValue', event.target.checked)
}

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group input {
  margin-right: 0.5rem;
}
</style>
