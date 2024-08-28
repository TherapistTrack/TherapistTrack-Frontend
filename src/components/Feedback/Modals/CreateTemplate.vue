<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <h2>Crear Nueva Plantilla</h2>
      <p>¿Con qué nombre te referirás a ella?</p>
      <input type="text" v-model="templateName" placeholder="Nombre de la plantilla" />
      <div class="modal-buttons">
        <button @click="cancel">Cancelar</button>
        <button class="create-button" @click="createTemplate">Crear</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const templateName = ref('')
const emit = defineEmits(['close', 'create'])

const createTemplate = () => {
  if (templateName.value.trim()) {
    emit('create', templateName.value)
  }
}

const cancel = () => {
  emit('close')
}
</script>

<style scoped>
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
