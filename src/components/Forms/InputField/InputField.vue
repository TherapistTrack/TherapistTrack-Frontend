<template>
  <div class="input-group">
    <label :for="id">
      <span v-if="type !== ''">
        <TypeIconLoader :icon-type="type" />
      </span>
      {{ label }}
    </label>
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
import TypeIconLoader from '@/assets/TypeIcons/TypeIconLoader.vue'
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
    default: ''
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

<style scoped>
.input-group {
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-group label {
  color: black;
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.input-group input {
  padding: 0.75rem;
  border: 1px solid var(--gray-3);
  border-radius: 0.5rem;
  width: 170px;
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
    align-items: start;
    flex-direction: column;
  }
}
</style>
