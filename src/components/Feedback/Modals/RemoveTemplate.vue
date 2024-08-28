<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <h2>Desea eliminar "{{ currentName }}"?</h2>
      <p>Esta acción es irreversible.</p>
      <p>
        Escribe <strong>{{ currentName }}</strong> para confirmar
      </p>
      <input type="text" v-model="confirmationText" placeholder="Escribe el nombre aquí..." />
      <div class="modal-buttons">
        <button @click="cancel">Cancelar</button>
        <button
          class="delete-button"
          @click="removeTemplate"
          :disabled="confirmationText !== currentName"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  currentName: {
    type: String,
    required: true
  }
})

const confirmationText = ref('')
const emit = defineEmits(['close', 'remove'])

const removeTemplate = () => {
  if (confirmationText.value.trim() === props.currentName) {
    emit('remove')
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

.delete-button {
  background-color: var(--red-1); /* Puedes usar la variable de color que prefieras */
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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
