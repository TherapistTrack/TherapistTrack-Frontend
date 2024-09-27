<template>
  <div class="upload-select-container">
    <div class="upload-card">
      <div class="header-container">
        <h2>Subir Archivos</h2>
      </div>

      <div class="file-list">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(file, index) in uploadStore.files" :key="index">
              <td>{{ file.name }}</td>
              <td>
                <button class="delete-btn" @click="removeFile(index)">X</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="add-more">
        <a href="#" @click="triggerFileInput">Agregar más archivos +</a>
        <input
          type="file"
          ref="fileInput"
          @change="handleFileChange"
          style="display: none"
          multiple
          accept="application/pdf"
        />
      </div>

      <div class="actions">
        <ButtonSimple msg="Cancelar" color="white" @click="handleCancel" />
        <ButtonSimple
          msg="Continuar"
          color="green"
          :disabled="!uploadStore.files.length"
          @click="goToForm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import { useUploadStore } from '@/stores/uploadStore'

const uploadStore = useUploadStore()
const router = useRouter()
const fileInput = ref(null)

// Función para agregar más archivos
function triggerFileInput() {
  fileInput.value.click()
}

// Manejar el cambio de archivos seleccionados
function handleFileChange(event) {
  const newFiles = Array.from(event.target.files).map((file) => ({
    name: file.name
  }))
  uploadStore.addFiles(newFiles)
}

// Función para eliminar un archivo de la lista
function removeFile(index) {
  uploadStore.files.splice(index, 1)
}

// Función para cancelar la subida
function handleCancel() {
  uploadStore.clearFiles()
  console.log('Subida cancelada')
}

// Función para continuar con la subida
function goToForm() {
  router.push('/upload/form')
}
</script>

<style scoped>
.upload-select-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--gray-3);
}

.upload-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  width: 45vw;
  height: 85vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 550px;
}

.header-container {
  text-align: center;
  margin-bottom: 20px;
}

.file-list {
  margin-bottom: 20px;
  max-height: 200px;
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ccc;
}

.delete-btn {
  background-color: transparent;
  margin-left: 45%;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 16px;
  padding: 5px;
}

.delete-btn:hover {
  color: darkred;
}

.add-more {
  margin-top: 10px;
  text-align: left;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
