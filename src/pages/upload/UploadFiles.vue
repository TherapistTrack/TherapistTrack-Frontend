<template>
  <div class="upload-files-container">
    <div class="upload-card">
      <div class="header-container">
        <div class="go-back" @click="goBack()">
          <RiArrowGoBackLine color="var(--gray-1)" class="icon-go-back" size="1.2rem" />
          <p>Regresar</p>
        </div>
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
        <!-- Mensaje de confirmación de archivos seleccionados -->
        <div class="message-container">
          <div v-if="uploadStore.files.length > 0" class="selected-files-message">
            {{ uploadStore.files.length }} archivo(s) seleccionado(s).
          </div>
        </div>
      </div>
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
import { onMounted, ref } from 'vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import { RiUploadCloudLine } from '@remixicon/vue'
import { useUploadStore } from '@/stores/uploadStore'
import { RiArrowGoBackLine } from '@remixicon/vue'

const emit = defineEmits(['goToSelect', 'goToStart'])

const fileInput = ref(null)
const uploadStore = useUploadStore()

function triggerFileInput() {
  fileInput.value.click()
}

onMounted(() => {
  console.log(uploadStore.files)
})
function handleFileChange(event) {
  const selectedFiles = Array.from(event.target.files).map((file) => ({
    name: file.name,
    file: file
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
    emit('goToSelect')
  }
}

const goBack = () => {
  emit('goToStart')
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
  align-items: center;
  flex-grow: 1;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 125px;
  margin-bottom: 20px;
}

.message-container {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 60px;
}

.selected-files-message {
  font-size: 14px;
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

.go-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
  padding: 0.3rem;
  border-radius: 0.4rem;
  transition: all 0.2s;
  cursor: pointer;
}
.go-back:hover {
  background-color: var(--gray-3);
}
.go-back p {
  color: var(--gray-1);
}
.icon-go-back {
  flex-shrink: 0;
}
</style>
