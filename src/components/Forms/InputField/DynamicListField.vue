<template>
  <div class="input-group">
    <input
      type="text"
      :id="isDummy ? 'dummy' : ''"
      :value="modelValue"
      @input="updateValue"
      placeholder="Agregar una opción..."
      :maxlength="maxlength"
    />
    <RiCloseLine
      size="1.5rem"
      v-if="!isDummy"
      class="icon-remove"
      color="var(--red-1)"
      @click="handleClose"
    />
    <span v-if="showIcon" class="icon-eye"></span>
  </div>
</template>

<script setup>
import { RiCloseLine } from '@remixicon/vue'
const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  maxlength: {
    type: Number,
    default: 255
  },
  onClose: Function,
  isDummy: {
    type: Boolean,
    default: false
  }
})

const handleClose = () => {
  props.onClose()
}
</script>

<style scoped>
.input-group {
  display: flex;
}

.input-group input {
  padding: 0.75rem;
  border: none;
  background-color: transparent;
  border-bottom: 1px solid var(--gray-2);
  outline: none;
  width: 170px;
  transition: all 0.2s;
}

.input-group input#dummy {
  width: calc(170px + 1.5rem);
}

.input-group input:focus {
  background-color: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid var(--gray-1);
}

.input-group input:focus + .icon-remove {
  background-color: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid var(--gray-1);
}

.input-group .icon-remove {
  transition: all 0.2s;
  border-bottom: 1px solid var(--gray-2);
  cursor: pointer;
  height: 100%;
  padding-top: 1rem;
}

@media (max-aspect-ratio: 6/9) {
  .input-group {
    display: flex;
    align-items: start;
    flex-direction: column;
  }
}
</style>
