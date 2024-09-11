<template>
  <input
    class="simple-input"
    :type="type"
    :id="id"
    :value="modelValue"
    @input="updateValue"
    :placeholder="placeholder"
    :maxlength="maxlength"
  />
</template>

<script setup>
const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  maxlength: {
    type: Number,
    default: 255
  }
})
</script>

<style>
.simple-input {
  padding: 0.75rem;
  border: 1px solid var(--gray-3);
  border-radius: 0.5rem;
  box-sizing: border-box;
}

@media (max-aspect-ratio: 6/9) {
  .input-group {
    display: flex;
    flex-direction: column;
  }
}
</style>
