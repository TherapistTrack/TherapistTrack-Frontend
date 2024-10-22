<template>
  <div class="custom-select-group" ref="myDiv">
    <label :for="id" v-if="label !== ''">
      <p>{{ label }}</p>
    </label>
    <div class="select" :id="id" @click="isClicked = !isClicked">
      <span class="select-container">
        <span v-if="options.includes(localValue)">
          <TypeIconLoader :icon-type="fields[localValue].type || ''" :small="true" />
        </span>
        <p>
          <b class="select-title" v-if="!options.includes(localValue)">
            {{ disabledValue }}
          </b>
          <b class="select-title" v-else>
            {{ localValue }}
          </b>
        </p>
      </span>

      <RiArrowDownSLine size="1rem" />
    </div>
    <div class="options" v-if="isClicked">
      <p class="disabled">{{ disabledValue }}</p>
      <div
        class="option"
        v-for="(item, key) in options"
        :key="key"
        @click="() => handleSelectOption(key)"
        :id="options.indexOf(localValue) == key ? 'selected' : ''"
      >
        <TypeIconLoader :icon-type="fields[item].type" :small="true" />
        <p>{{ item }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RiArrowDownSLine } from '@remixicon/vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import TypeIconLoader from '@/assets/TypeIcons/TypeIconLoader.vue'
const emit = defineEmits(['update:modelValue'])

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
  fields: Object
})
const myDiv = ref(null)
const isClicked = ref(false)
const localValue = ref(props.modelValue)

const handleSelectOption = (key) => {
  localValue.value = props.options[key]
  emit('update:modelValue', localValue.value)
  setTimeout(() => {
    isClicked.value = false
  }, 1)
}

const handleClickOutside = (event) => {
  if (myDiv.value && !myDiv.value.contains(event.target)) {
    isClicked.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside) // Step 4: Remove event listener on unmount
})
</script>

<style scoped>
.select-container {
  display: flex;
  align-items: center;
  gap: 0.1rem;
  overflow-x: hidden;
  text-overflow: ellipsis;
}
.custom-select-group {
  position: relative;
}
.options p {
  font-size: 0.75rem;
}
.select-title {
  font-size: 0.8rem;
  text-wrap: nowrap;
}
.options {
  position: absolute;
  background-color: white;
  width: 170px;
  padding: 0.7rem;
  border-radius: 0.5rem;
  box-sizing: border-box;
  border: 1px solid var(--gray-2);
  box-shadow: 0 0 0.2rem rgba(0, 0, 0, 0.3);
}
.select {
  width: 170px;
  box-sizing: border-box;
  border: 1px solid var(--gray-3);
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 2.6rem;
}
.disabled {
  color: var(--gray-1);
  padding-bottom: 0.5rem;
}
.option {
  padding: 0.2rem;
  display: flex;
  gap: 0.4rem;
}
.option#selected {
  background-color: var(--gray-3);
}
.option:hover {
  background-color: var(--gray-3);
}
</style>
