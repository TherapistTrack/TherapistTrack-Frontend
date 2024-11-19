<template>
  <div class="select-group">
    <label @mouseover="onMouseOver" @mouseleave="onMouseLeave" :for="id">
      <TypeIconLoader :icon-type="'CHOICE'" />
      <p>{{ label }}<b class="red">*</b></p>
      <div v-if="isHovered" class="descriptor">{{ description }}</div>
    </label>

    <select :id="id" :value="modelValue" @change="updateValue">
      <option disabled value="">{{ disabledValue }}</option>
      <option v-for="(item, index) in options" :key="index" :value="item">{{ item }}</option>
    </select>
  </div>
</template>

<script setup>
import TypeIconLoader from '@/assets/TypeIcons/TypeIconLoader.vue'
import { ref } from 'vue'

const isHovered = ref(false)
const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}

const onMouseOver = () => {
  isHovered.value = true
}

const onMouseLeave = () => {
  isHovered.value = false
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
  label: {
    type: String,
    required: true
  },
  disabledValue: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    default: () => []
  },
  description: {
    type: String,
    required: true
  },
  showTypeIcon: {
    type: Boolean,
    default: false
  }
})
</script>

<style>
.select-group {
  font-family: 'MotivaSansMedium';
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.select-group .red {
  color: var(--red-1);
}

.select-group .descriptor {
  padding: 0.2rem;
  position: absolute;
  background-color: white;
  top: -30px;
  left: 50px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 100px;
  font-size: x-small;
}

.select-group label {
  padding-bottom: 1vh;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.select-group select,
.select-group select option {
  font-family: 'MotivaSansMedium';
  font-weight: normal;
  font-style: normal;
  width: 170px;
}
.select-group select {
  padding: 0.75rem;
  background-color: white;
  border: 1px solid var(--gray-3);
  border-radius: 0.5rem;
}

@media (max-aspect-ratio: 6/9) {
  .select-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }
}
</style>
