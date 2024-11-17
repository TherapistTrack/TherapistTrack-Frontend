<template>
  <div class="select-group">
    <label :for="id" v-if="label !== ''">
      <TypeIconLoader v-if="showTypeIcon" :icon-type="'CHOICE'" />
      <p>{{ label }}</p>
    </label>
    <select :id="id" :value="modelValue" @change="updateValue">
      <option disabled value="">{{ disabledValue }}</option>
      <option v-for="(item, index) in options" :key="index" :value="item">{{ item }}</option>
    </select>
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
  }
})
</script>

<style scoped>
.select-group {
  font-family: 'MotivaSansMedium';
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.select-group label {
  padding-bottom: 1vh;
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

.select-group select option {
  font-family: 'MotivaSansMedium' !important;
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
