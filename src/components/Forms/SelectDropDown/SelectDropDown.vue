<template>
  <div class="select-group">
    <label @mouseover="onMouseOver" @mouseleave="onMouseLeave" :for="id" v-if="label !== ''">
      <TypeIconLoader v-if="showTypeIcon" :icon-type="'CHOICE'" />
      <p>{{ label }} <b v-if="required">*</b></p>
      <div v-if="isHovered && required" class="descriptor">
        {{ description }}
      </div>
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
const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}

const props = defineProps({
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
    default: ''
  },
  disabledValue: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    default: () => []
  },
  showTypeIcon: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  }
})

const isHovered = ref(false)

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
.select-group {
  font-family: 'MotivaSansMedium';
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  position: relative;
}

.select-group .descriptor {
  padding: 0.2rem;
  position: absolute;
  background-color: white;
  left: 7rem;
  top: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 100px;
  font-size: x-small;
}

.select-group label {
  padding-bottom: 1vh;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.select-group label b {
  color: var(--red-1);
  font-size: larger;
}

.select-group select,
.select-group select option {
  font-family: 'MotivaSansMedium';
  font-weight: normal;
  font-style: normal;
}

.select-group select option {
  font-family: 'MotivaSansMedium' !important;
}
.select-group select {
  padding: 0.75rem;
  background-color: white;
  border: 1px solid var(--gray-3);
  border-radius: 0.5rem;
}

@media (max-aspect-ratio: 1/1) {
  .select-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }
}
</style>
