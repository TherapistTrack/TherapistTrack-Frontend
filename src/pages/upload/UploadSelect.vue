<template>
  <div class="upload-select-container">
    <div class="upload-card">
      <div class="header-container">
        <h2>Subir Archivos</h2>
      </div>

      <!-- Mantenemos la estructura de la tabla dentro de .file-list -->
      <div class="file-list">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(file, index) in uploadStore.files" :key="index">
              <td class="file-row">
                <RiFile3Fill class="file-icon" />
                <span class="file-name">{{ file.name }}</span>
                <RiCloseLine class="delete-btn" @click="removeFile(index)" color="red" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="add-more">
        <a href="#" @click.prevent="triggerFileInput">Agregar más archivos +</a>
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import { useUploadStore } from '@/stores/uploadStore'
import { RiCloseLine, RiFile3Fill } from '@remixicon/vue'

const emit = defineEmits(['goToForm'])

const uploadStore = useUploadStore()
const route = useRoute()
const fileInput = ref(null)

// Función para agregar más archivos
function triggerFileInput() {
  fileInput.value.click()
}

// Manejar el cambio de archivos seleccionados
function handleFileChange(event) {
  const newFiles = Array.from(event.target.files).map((file) => ({
    name: file.name,
    file: file
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
  emit('goToForm')
}

onMounted(() => {
  // Reemplazar la entrada actual en el historial para evitar retroceder
  history.pushState(null, null, document.URL)

  const handlePopState = () => {
    if (route.name !== 'uploadFiles') {
      // Bloquear el retroceso si no es la página UploadFiles
      console.log('Intento de retroceder detectado, redirigiendo a la página actual.')
      history.pushState(null, null, document.URL)
    }
  }

  // Añadir el listener para el evento 'popstate'
  window.addEventListener('popstate', handlePopState)

  // Limpiar el listener cuando el componente sea desmontado
  onBeforeUnmount(() => {
    window.removeEventListener('popstate', handlePopState)
  })
})
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
  min-width: 550px;
}

.header-container {
  text-align: center;
  margin-bottom: 20px;
}

.file-list {
  flex-grow: 1; /* Para que este contenedor ocupe el espacio disponible */
  margin-bottom: 10px; /* Reducimos el margen si es necesario */
  max-height: 600px;
  overflow-y: auto;
  margin-top: 0px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  padding: 10px;
  text-align: left;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}

td {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.file-row {
  display: flex;
  align-items: center;
}

.file-icon {
  margin-right: 10px;
}

.file-name {
  flex-grow: 1;
  text-align: left; /* Añade esta línea */
}

.delete-btn {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 16px;
}

.delete-btn:hover {
  color: darkred;
}

.add-more {
  margin-top: 10px;
  text-align: left;
}

.add-more a {
  color: blue;
  text-decoration: none;
}

.add-more a:hover {
  text-decoration: none;
  color: blue;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding: 10px;
}
</style>
