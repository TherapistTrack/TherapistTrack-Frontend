<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <h2>{{ modalTitle }}</h2>
      <p>{{ modalMessage }}</p>
      <input type="text" v-model="itemName" :placeholder="placeholderText" />
      <!-- Dropdown para seleccionar el tipo de dato (solo si es 'field') -->
      <div v-if="showDropdown" class="select-group">
        <label for="data-type">Seleccione un tipo</label>
        <select id="data-type" v-model="selectedType">
          <option disabled value="">Seleccionar...</option>
          <option v-for="option in dataTypes" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
      <!-- Botones para crear o cancelar -->
      <div class="modal-buttons">
        <button @click="cancel">Cancelar</button>
        <button class="create-button" @click="createItem">Crear</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, computed } from 'vue'

// Definir los 'emits' para poder emitir los eventos 'close' y 'create'
const emit = defineEmits(['close', 'create'])

// Definir los 'props' para recibir el tipo de modal ('template' o 'field')
const props = defineProps({
  type: {
    type: String,
    default: 'template' // El valor por defecto es 'template'
  }
})

// Definir los valores y opciones de estado
const itemName = ref('') // Nombre del archivo o campo
const selectedType = ref('') // Tipo seleccionado para 'field' (solo si corresponde)
const dataTypes = ['SHORT_TEXT', 'TEXT', 'NUMBER', 'FLOAT', 'DATE'] // Tipos de datos disponibles

// Computados para generar el título, mensaje y placeholder dinámicamente
const modalTitle = computed(() =>
  props.type === 'template' ? 'Crear Nueva Plantilla' : 'Crear Nuevo Archivo'
)
const modalMessage = computed(() =>
  props.type === 'template' ? 'Asigne un nombre al archivo:' : 'Asigne un nombre y tipo al campo:'
)
const placeholderText = computed(() =>
  props.type === 'template' ? 'Nombre del archivo' : 'Nombre del campo'
)
const showDropdown = computed(() => props.type === 'field') // Mostrar el dropdown solo si es 'field'

// Función para crear el archivo o campo y emitir el evento correspondiente
const createItem = () => {
  if (itemName.value.trim() && (props.type !== 'field' || selectedType.value)) {
    if (props.type === 'template' || props.type === 'file') {
      emit('create', itemName.value) // Emitir solo el nombre si es un archivo o una plantilla
    } else {
      emit('create', { name: itemName.value, type: selectedType.value }) // Emitir objeto si es un campo
    }
  }
}

// Función para cancelar y cerrar el modal
const cancel = () => {
  emit('close')
}
</script>

<style scoped>
/* Estilos del modal */
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
