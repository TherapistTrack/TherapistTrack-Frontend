<template>
  <div class="searchBar">
    <RiSearchLine size="1rem" color="var(--gray-1)" alt="search" />
    <input :placeholder="pholder" :value="modelValue" @input="onInput" />

    <div class="container" :id="isEmpty ? '' : 'active'">
      <RiCloseLine
        v-if="showIcon"
        size="1rem"
        color="var(--gray-1)"
        class="close"
        @click="clearInput"
      />
    </div>
  </div>
</template>

<script setup>
import { RiSearchLine, RiCloseLine } from '@remixicon/vue'
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  pholder: { type: String, default: 'Buscar...' },
  modelValue: { type: String, default: '' } // Cambiamos a modelValue
})

// Emisor de eventos
const emit = defineEmits(['update:modelValue']) // Cambiamos a update:modelValue

const isEmpty = ref(true)
const showIcon = ref(false)

// Observamos cambios en isEmpty para controlar el ícono
watch(isEmpty, () => {
  if (!isEmpty.value) {
    setTimeout(() => {
      showIcon.value = !isEmpty.value
    }, 300)
  } else {
    showIcon.value = false
  }
})

function updateState(val) {
  isEmpty.value = val === ''
}

// Función para limpiar el input
function clearInput() {
  emit('update:modelValue', '')
  isEmpty.value = true
}

// Maneja la entrada del usuario
function onInput(event) {
  const value = event.target.value
  emit('update:modelValue', value)
  updateState(value)
}

// Inicializa el estado según el valor inicial
updateState(props.modelValue)
</script>

<style scoped>
.searchBar {
  display: flex;
  align-items: center;
  width: fit-content;
  background-color: #e9e9e9;
  border: 0;
  border-radius: 2vh;
  padding: 1vh;
  color: #6e6e6e;
  gap: 1rem;
}

.searchBar input {
  border: none;
  background: none;
  max-width: 150px;
}

.searchBar .container {
  width: 0;
  display: flex;
  position: relative;
  transition: width 0.5s;
}

.searchBar .container#active {
  width: 1rem;
}

.searchBar .close {
  position: absolute;
  top: -0.5rem;
}

.searchBar .close:hover {
  fill: var(--gray-2);
}
</style>
