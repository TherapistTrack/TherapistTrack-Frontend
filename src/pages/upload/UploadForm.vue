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
          v-model:modelValue="currentTemplate"
          id="plantilla-select"
          disabledValue="Seleccione una plantilla"
          :options="Object.keys(templateOptions)"
        />

        <InputField :label="'Nombre'" v-model:modelValue="fileData.name" type="SHORT_TEXT" />

        <span v-for="(field, key) in Object.keys(templateInfo)" :key="key">
          <span v-if="templateInfo[field].type == 'CHOICE'">
            <SelectDropDown
              :id="field + templateInfo[field].type"
              :label="field"
              :options="templateInfo[field].options"
              v-model:model-value="fileData[field]"
              disabled-value="Escoga una opción"
            />
          </span>
          <span v-else>
            <InputField
              :label="field"
              :type="templateInfo[field].type"
              v-model:model-value="fileData[field]"
              :required="templateInfo[field].required"
            />
          </span>
        </span>
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
import { useRoute } from 'vue-router'
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
import { useApi } from '@/oauth/useApi'

const emit = defineEmits(['goToDoing', 'goToFiles'])

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

const uploadStore = useUploadStore()
const route = useRoute()
const currentFileIndex = ref(0)
const sidebarOpen = ref(true)
const fileUrl = ref('')

const { getRequest } = useApi()

// Opciones para los select
// Datos del archivo actual

const templateOptions = ref({})
const currentTemplate = ref('')
const templateInfo = ref({})
const fileData = ref({})

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

watch(currentTemplate, async () => {
  await getTemplateInfo()
  updateFileData()
})

watch(
  fileData,
  (newData) => {
    if (currentFile.value) {
      currentFile.value.data = { ...newData }
    }
  },
  { deep: true }
)
watch(currentFileIndex, async () => {
  await getTemplateInfo()
  updateFileData()
})

// Template logic
const getTemplateOptions = async () => {
  let doctorId = uploadStore.doctorId
  if (doctorId != '' && doctorId != undefined) {
    try {
      const response = await getRequest(`/doctor/FIleTemplate/list?doctorId=${doctorId}`, {})
      templateOptions.value = response.templates.reduce((arr, item) => {
        arr[item.name] = item.templateId
        return arr
      }, {})
      currentTemplate.value = Object.keys(templateOptions.value)[0]
    } catch {
      console.log('couldnt get template options')
    }
  }
}
const getTemplateInfo = async () => {
  let temId = templateOptions.value[currentTemplate.value]
  let doctorId = uploadStore.doctorId
  try {
    const response = await getRequest(
      `/doctor/FileTemplate?doctorId=${doctorId}&templateId=${temId}`
    )
    let fields = response.data.fields
    templateInfo.value = fields.reduce((arr, item) => {
      arr[item.name] = {
        type: item.type,
        options: item.options,
        required: item.required
      }
      return arr
    }, {})
    fileData.value = fields.reduce((arr, item) => {
      arr[item.name] = ''
      return arr
    }, {})
  } catch {
    console.log('couldng get template info')
  }
}

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
      emit('goToFiles')
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

async function updateFileData() {
  if (fileUrl.value) {
    URL.revokeObjectURL(fileUrl.value)
  }
  if (currentFile.value) {
    console.log('currentFile.value.data:', currentFile.value.data)
    console.log('currentFile.value.file:', currentFile.value.file)
    if (!currentFile.value.data) {
      currentFile.value.data = {
        templateId: templateOptions.value[currentTemplate.value],
        name: currentFile.value.name.replace('.pdf', '')
      }
    }
    fileData.value = {
      ...currentFile.value.data,
      templateId: templateOptions.value[currentTemplate.value]
    }
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
  emit('goToDoing')
}

// Watchers

onMounted(async () => {
  await getTemplateOptions()
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
