<template>
  <div class="upload-form-container">
    <!-- Left Sidebar with dynamic classes to toggle open/close -->
    <div :class="['fixed-left-sidebar', sidebarOpen ? 'open' : 'closed']">
      <div class="top">
        <h1>
          <b>{{ currentFileName }}</b>
        </h1>
        <!-- Show arrow left when sidebar is open -->
        <RiArrowLeftSLine
          v-if="sidebarOpen"
          class-name="icon"
          size="2rem"
          color="var(--gray-2)"
          alt="arrow-left"
          @click="toggleSidebar"
        />
      </div>
      <div class="descartar-container">
        <div>
          <IconButton
            msg="Descartar"
            :firstIcon="trashIcon"
            :secondIcon="arrowDownIcon"
            :onClick="handleDiscard"
          />
        </div>
      </div>
      <div class="mid">
        <SelectDropDown
          label="Plantilla"
          v-model:modelValue="fileData.template"
          id="plantilla-select"
          disabledValue="Seleccione una plantilla"
          :options="plantillaOptions"
        />
        <InputField :label="'Nombres'" v-model:modelValue="fileData.name" />
        <InputField :label="'Páginas'" v-model:model-value="fileData.pages" />
        <SelectDropDown
          label="Categoría"
          v-model:modelValue="fileData.category"
          id="categoria-select"
          disabledValue="Seleccione una categoría"
          :options="categoriaOptions"
        />
        <InputField
          :label="'Fecha de Creación'"
          v-model:model-value="fileData.creation"
          :type="'date'"
        />
      </div>
      <div class="bottom">
        <IconButton
          msg="Anterior"
          :firstIcon="arrowUp"
          :onClick="goToPreviousFile"
          :disabled="currentFileIndex.value === 0"
        />
        <div class="divider"></div>
        <IconButton
          msg="Siguiente"
          :secondIcon="arrowDown"
          :onClick="goToNextFile"
          :disabled="currentFileIndex.value >= totalFiles - 1"
        />
      </div>
    </div>

    <!-- Show arrow right to open sidebar when it's closed -->
    <div v-if="!sidebarOpen" class="open-sidebar-line" @click="toggleSidebar">
      <RiArrowRightSLine class="open-sidebar-icon" size="2rem" color="var(--gray-2)" />
    </div>

    <!-- Right Content: Preview -->
    <div :class="['content-preview', sidebarOpen ? '' : 'full-width']">
      <!-- Barra superior -->
      <div class="top-bar">
        <div class="textContainer">
          <h1>{{ currentFileIndexDisplay }}/{{ totalFiles }}</h1>
        </div>
        <div class="button-container2">
          <button class="select-files-btn" @click="goToDoing">
            <RiUploadCloudFill class="icon-upload" />
            Subir
          </button>
        </div>
      </div>

      <!-- File Preview goes here (pdf/image or other format viewer) -->
      <div class="file-preview">
        <iframe
          v-if="fileUrl"
          :src="fileUrl"
          style="width: 100%; height: 100%; border: none; flex-grow: 1"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import IconButton from '@/components/Buttons/IconButton.vue'
import InputField from '@/components/Forms/InputField/InputField.vue'
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import {
  RiDeleteBinFill,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiUploadCloudFill
} from '@remixicon/vue'
import { useUploadStore } from '@/stores/uploadStore'
// Importar PDF.js y el worker
import * as pdfjsLib from 'pdfjs-dist/build/pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

const uploadStore = useUploadStore()
const router = useRouter()
const route = useRoute()
const currentFileIndex = ref(0)
const sidebarOpen = ref(true)
const fileUrl = ref('')

// Opciones para los select
const plantillaOptions = ['Normal', 'Especial', 'Personalizada']
const categoriaOptions = ['Consultas', 'Análisis', 'Reportes']

// Datos del archivo actual
const fileData = ref({
  template: '',
  name: '',
  pages: '',
  category: '',
  creation: ''
})

// Íconos
const trashIcon = RiDeleteBinFill
const arrowDown = RiArrowDownSLine
const arrowUp = RiArrowUpSLine

// Computed properties
const totalFiles = computed(() => uploadStore.files.length)

const currentFile = computed(() => {
  if (uploadStore.files.length > 0) {
    return uploadStore.files[currentFileIndex.value]
  }
  return null
})

const currentFileName = computed(() => {
  if (currentFile.value && currentFile.value.name) {
    return currentFile.value.name.replace('.pdf', '')
  }
  return ''
})

const currentFileIndexDisplay = computed(() => currentFileIndex.value + 1)

// Funciones
function handleDiscard() {
  if (currentFile.value) {
    // Eliminar el archivo actual del store
    uploadStore.files.splice(currentFileIndex.value, 1)

    // Ajustar currentFileIndex si es necesario
    if (currentFileIndex.value >= uploadStore.files.length && currentFileIndex.value > 0) {
      currentFileIndex.value--
    }

    // Si no quedan archivos, redirigir o manejar el caso
    if (uploadStore.files.length === 0) {
      router.push('/upload/')
    } else {
      // Actualizar los datos del archivo actual
      updateFileData()
    }
  }
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function goToPreviousFile() {
  if (currentFileIndex.value > 0) {
    currentFileIndex.value--
    updateFileData()
  }
}

function goToNextFile() {
  if (currentFileIndex.value < totalFiles.value - 1) {
    currentFileIndex.value++
    updateFileData()
  }
}

function getLocalDateString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function updateFileData() {
  console.log('updateFileData called')
  if (fileUrl.value) {
    URL.revokeObjectURL(fileUrl.value)
  }
  if (currentFile.value) {
    console.log('currentFile.value:', currentFile.value)
    console.log('currentFile.value.file:', currentFile.value.file)
    if (!currentFile.value.data) {
      currentFile.value.data = {
        template: '',
        name: currentFile.value.name.replace('.pdf', ''),
        pages: '',
        category: '',
        creation: ''
      }
    }

    // Obtener el número de páginas del PDF
    try {
      const typedarray = await currentFile.value.file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise
      const numPages = pdf.numPages
      currentFile.value.data.pages = numPages.toString() // Convertimos a string
    } catch (error) {
      console.error('Error al obtener el número de páginas:', error)
    }

    // Establecer la fecha actual si no está establecida
    if (!currentFile.value.data.creation) {
      const today = getLocalDateString()
      currentFile.value.data.creation = today
    }

    fileData.value = { ...currentFile.value.data }
    if (currentFile.value.file instanceof Blob || currentFile.value.file instanceof File) {
      fileUrl.value = URL.createObjectURL(currentFile.value.file)
    } else {
      console.error('currentFile.value.file no es un Blob o File válido')
      fileUrl.value = ''
    }
  } else {
    fileData.value = {
      template: '',
      name: '',
      pages: '',
      category: '',
      creation: ''
    }
    fileUrl.value = ''
  }
}

function goToDoing() {
  if (uploadStore.files.length > 0) {
    // Recorrer todos los archivos en `uploadStore`
    uploadStore.files.forEach((file) => {
      console.log('Subiendo:', file.data)
    })
  }
  router.push('/upload/doing')
}

// Watchers
watch(
  fileData,
  (newData) => {
    if (currentFile.value) {
      currentFile.value.data = { ...newData }
    }
  },
  { deep: true }
)

onMounted(() => {
  updateFileData()

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

watch(currentFileIndex, () => {
  updateFileData()
})
</script>

<style scoped>
.upload-form-container {
  display: flex;
  gap: 2rem;
  height: 100vh;
}

/* Sidebar styles */
.fixed-left-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 400;
  background-color: white;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0 2vh 2vh 0;
  width: 400px;
  height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out;
}

.fixed-left-sidebar.closed {
  transform: translateX(-100%);
}

.fixed-left-sidebar.open {
  transform: translateX(0);
}

.fixed-left-sidebar .top {
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
}

.fixed-left-sidebar .mid {
  padding: 1rem;
  height: 360px;
  overflow-y: auto;
  flex-grow: 1;
  border-top: 1px solid var(--gray-3);
}

/* Línea vertical con icono para reabrir la sidebar */
.open-sidebar-line {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 4rem;
  background-color: white;
  display: flex;
  align-items: start;
  justify-content: center;
  cursor: pointer;
  z-index: 500;
}

.open-sidebar-icon {
  fill: var(--gray-2);
  padding: 1px;
  margin-top: 30px;
}

.descartar-container {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  margin-left: -10px;
}

.fixed-left-sidebar .bottom {
  border-top: 2px solid var(--gray-3);
  padding-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fixed-left-sidebar .divider {
  width: 2px;
  height: 2rem;
  background-color: var(--gray-3);
}

/* Adjust content width when sidebar is closed */
.content-preview {
  margin-left: 400px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content-preview.full-width {
  margin-left: 4rem;
}
/* Top and bottom bars */
.top-bar {
  display: flex;
  align-items: center;
  height: 8vh;
  background-color: var(--blue-1);
  transition: margin-left 0.3s ease-in-out;
}

/* Cuando la sidebar está abierta */
.content-preview.sidebar-open .top-bar {
  margin-left: 500px; /* Ajusta este valor según el ancho de la línea vertical */
}

/* Cuando la sidebar está cerrada */
.content-preview.full-width .top-bar {
  margin-left: 0; /* Igual que arriba */
}

.textContainer {
  display: flex;
  align-items: center;
  padding-left: 1rem; /* Consistent padding */
}

.textContainer h1 {
  color: white;
  font-size: 1.5rem;
  margin: 0;
  font-size: 18px;
}

/* Adjust bar width based on sidebar state */
.content-preview.full-width .top-bar,
.content-preview.full-width .bottom-bar {
  margin-left: 0;
}

.bottom-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 8vh;
  background-color: var(--gray-1);
  padding-right: 1rem;
}

.button-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.button-container2 {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  padding-right: 1rem;
  flex-grow: 1;
}

.select-files-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--light-blue-2);
  color: var(--blue-1);
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.select-files-btn:hover {
  background-color: var(--light-blue-1);
}

.icon-upload {
  fill: var(--blue-1);
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.file-preview {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
</style>
