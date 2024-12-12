<template>
  <div class="input-group">
    <label @mouseover="onMouseOver" @mouseleave="onMouseLeave" :for="id">
      <span v-if="type !== ''">
        <TypeIconLoader :icon-type="type" />
      </span>
      <p>{{ label }} <b v-if="required">*</b></p>
      <div v-if="isHovered && required" class="descriptor">
        {{ description }}
      </div>
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
import { ref } from 'vue'
const emit = defineEmits(['update:modelValue'])
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
  showIcon: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ''
  }
})

const isHovered = ref(false)

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
.input-group .descriptor {
  padding: 0.2rem;
  position: absolute;
  background-color: white;
  left: 7rem;
  top: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 100px;
  font-size: x-small;
}

.input-group {
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  position: relative;
}

.input-group label {
  color: black;
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.input-group label b {
  color: var(--red-1);
  font-size: larger;
}

.input-group input {
  padding: 0.75rem;
  border: 1px solid var(--gray-3);
  border-radius: 0.5rem;
}

.input-group .icon-eye {
  position: absolute;
  cursor: pointer;
  right: 1rem;
  top: 1rem;
}

@media (max-aspect-ratio: 1/1) {
  .input-group {
    display: flex;
    align-items: start;
    flex-direction: column;
  }
  .input-group input {
    width: 100%;
  }
}
</style>
