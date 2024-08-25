<template>
  <div class="input-group">
    <label :for="id">{{ label }}</label>
    <input
      :type="type"
      :id="id"
      :value="modelValue"
      @input="updateValue"
      :placeholder="placeholder"
      :maxlength="maxlength"
    />
    <span v-if="showIcon" class="icon-eye"></span>
  </div>
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
  label: {
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
  },
  showIcon: {
    type: Boolean,
    default: false
  }
})
</script>

<style>
.input-group {
  margin-bottom: 1rem;
  display: flex;
  justify-content: start;
  gap: 1rem;
  align-items: center;
}

.input-group label {
  margin-bottom: 0.5rem;
  color: black;
}

.input-group input {
  padding: 0.75rem;
  border: 1px solid var(--gray-3);
  border-radius: 0.5rem;
  box-sizing: border-box;
}

.input-group .icon-eye {
  position: absolute;
  cursor: pointer;
  right: 1rem;
  top: 1rem;
}

@media (max-aspect-ratio: 6/9) {
  .input-group {
    display: flex;
    flex-direction: column;
  }
}
</style>
