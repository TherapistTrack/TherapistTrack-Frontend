<template>
  <div class="upload-files-container">
    <div class="upload-card">
      <div class="header-container">
        <h2>Subir Archivos</h2>
      </div>
      <div class="content-container">
        <div class="button-container">
          <button class="select-files-btn" @click="triggerFileInput">
            <RiUploadCloudLine class="icon-upload" />
            Seleccionar Archivos
          </button>
          <input
            type="file"
            ref="fileInput"
            @change="handleFileChange"
            style="display: none"
            multiple
            accept="application/pdf"
          />
        </div>
      </div>

      <!-- Usando el componente de botón ya creado -->
      <div class="actions">
        <ButtonSimple msg="Cancelar" color="white" @click="handleCancel" />
        <ButtonSimple
          msg="Continuar"
          color="blue"
          :disabled="!uploadStore.files.length"
          @click="goToSelect"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import { RiUploadCloudLine } from '@remixicon/vue'
import { useUploadStore } from '@/stores/uploadStore'

const fileInput = ref(null)
const router = useRouter()
const uploadStore = useUploadStore()

function triggerFileInput() {
  fileInput.value.click()
}

function handleFileChange(event) {
  const selectedFiles = Array.from(event.target.files).map((file) => ({
    name: file.name
  }))
  console.log('Archivos seleccionados:', selectedFiles)
  uploadStore.setFiles(selectedFiles) // Almacena los archivos con su ruta
}

function handleCancel() {
  uploadStore.clearFiles()
}

// Función para redirigir a UploadSelect
function goToSelect() {
  if (uploadStore.files.length > 0) {
    router.push('/upload/select')
  }
}
</script>

<style scoped>
.upload-files-container {
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

.content-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.select-files-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--blue-1);
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 50px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  height: 50px;
  width: 300px;
}

.select-files-btn i {
  margin-right: 8px;
}

.actions {
  display: flex;
  justify-content: right;
  margin-top: 20px;
  padding: 20px;
  gap: 10px;
}

.icon-upload {
  fill: white;
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
</style>
