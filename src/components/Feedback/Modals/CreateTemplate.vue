<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <h2>{{ modalTitle }}</h2>
      <p>{{ modalMessage }}</p>
      <input type="text" v-model="itemName" :placeholder="placeholderText" />
      <div v-if="showDropdown" class="select-group">
        <label for="data-type">Seleccione un tipo</label>
        <select id="data-type" v-model="selectedType">
          <option disabled value="">Seleccionar...</option>
          <option v-for="option in dataTypes" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
      <div class="modal-buttons">
        <button @click="cancel">Cancelar</button>
        <button class="create-button" @click="createItem">Crear</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, computed } from 'vue'

const emit = defineEmits(['close', 'create'])
const props = defineProps({
  type: {
    type: String,
    default: 'template' // 'template' or 'field'
  }
})

const itemName = ref('')
const selectedType = ref('')
const dataTypes = ['SHORT_TEXT', 'TEXT', 'NUMBER', 'FLOAT', 'DATE']

const modalTitle = computed(() =>
  props.type === 'template' ? 'Crear Nueva Plantilla' : 'Crear Nuevo Campo'
)
const modalMessage = computed(() =>
  props.type === 'template'
    ? '¿Con qué nombre te referirás a ella?'
    : 'Asigne un nombre y tipo al campo.'
)
const placeholderText = computed(() =>
  props.type === 'template' ? 'Nombre de la plantilla' : 'Nombre del campo'
)
const showDropdown = computed(() => props.type === 'field')

const createItem = () => {
  if (itemName.value.trim() && (props.type !== 'field' || selectedType.value)) {
    if (props.type === 'template') {
      emit('create', itemName.value) // Emitir solo el nombre si es una plantilla
    } else {
      emit('create', { name: itemName.value, type: selectedType.value }) // Emitir objeto si es un campo
    }
  }
}

const cancel = () => {
  emit('close')
}
</script>

<style scoped>
/* estilos similares a los ya definidos */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

.select-group {
  margin-top: 1rem;
  text-align: left;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.create-button {
  background-color: var(--green-1);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.create-button:hover {
  background-color: var(--green-2);
}

button {
  background-color: #ccc;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #bbb;
}

input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
