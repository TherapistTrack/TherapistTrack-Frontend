<template>
  <div class="input-group">
    <label @mouseover="onMouseOver" @mouseleave="onMouseLeave" :for="id"
      >{{ label }}<b class="red">*</b>
      <div v-if="isHovered" class="descriptor">{{ description }}</div>
    </label>
    <input
      :class="alert ? 'alert' : ''"
      :type="type"
      :id="id"
      :value="modelValue"
      @input="updateValue"
      :placeholder="placeholder"
      :maxlength="maxlength"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
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
  description: {
    type: String,
    required: false
  },
  alert: {
    type: Boolean,
    default: false
  }
})
const isHovered = ref(false)
const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}

const onMouseOver = () => {
  if (props.description !== '' && props.description !== undefined) {
    isHovered.value = true
  }
}

const onMouseLeave = () => {
  isHovered.value = false
}
</script>

<style>
.input-group {
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 1rem;
}

.input-group .red {
  color: var(--red-1);
}

.input-group .descriptor {
  padding: 0.2rem;
  position: absolute;
  background-color: white;
  top: -30px;
  left: 50px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 100px;
  font-size: x-small;
}

.input-group label {
  margin-bottom: 0.5rem;
  color: black;
  position: relative;
}

.input-group input {
  padding: 0.75rem;
  border: 1px solid var(--gray-3);
  border-radius: 0.5rem;
  box-sizing: border-box;
}

.input-group .alert {
  border: 2px solid var(--red-1);
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
