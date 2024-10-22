<template>
  <div class="input-group">
    <label @mouseover="onMouseOver" @mouseleave="onMouseLeave" :for="id">
      <span v-if="type !== ''">
        <TypeIconLoader :icon-type="type" />
      </span>
      <p>{{ label }}<b class="red">*</b></p>
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
import TypeIconLoader from '@/assets/TypeIcons/TypeIconLoader.vue'
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

<style scoped>
.input-group {
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  display: flex;
  gap: 0.6rem;
}

.input-group input {
  padding: 0.75rem;
  border: 1px solid var(--gray-3);
  border-radius: 0.5rem;
  width: 170px;
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
    align-items: start;
    flex-direction: column;
  }
}
</style>
