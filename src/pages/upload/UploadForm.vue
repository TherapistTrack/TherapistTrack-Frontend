<template>
  <div class="upload-form-container">
    <!-- Left Sidebar with dynamic classes to toggle open/close -->
    <div :class="['fixed-left-sidebar', sidebarOpen ? 'open' : 'closed']">
      <div class="top">
        <h1>
          <b>{{ fileData.name }}</b>
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
        <InputField :label="'Nombres'" v-model:model-value="fileData.name" />
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
        <IconButton msg="Anterior" :firstIcon="arrowUp" />
        <div class="divider"></div>
        <IconButton msg="Siguiente" :secondIcon="arrowDown" />
      </div>
    </div>

    <!-- Show arrow right to open sidebar when it's closed -->
    <RiArrowRightSLine
      v-if="!sidebarOpen"
      class="open-sidebar-btn"
      size="2rem"
      color="var(--gray-2)"
      alt="arrow-right"
      @click="toggleSidebar"
    />

    <!-- Right Content: Preview -->
    <div :class="['content-preview', sidebarOpen ? '' : 'full-width']">
      <!-- Barra superior -->
      <div class="top-bar">
        <div class="textContainer">
          <h1>20/30 Completados</h1>
        </div>
        <div class="button-container2">
          <button class="select-files-btn">
            <RiUploadCloudLine class="icon-upload" @click="goToDoing" />
            Subir
          </button>
        </div>
      </div>

      <!-- Barra inferior -->
      <div class="bottom-bar">
        <div class="button-container">
          <button class="zoom-button">
            <RiAddFill class="icon-add" />
          </button>
          <span class="zoom-percentage">120%</span>
          <button class="zoom-button">
            <RiSubtractFill class="icon-subtract" />
          </button>
          <button class="zoom-button">
            <RiExpandDiagonalLine class="icon-expand" />
          </button>
        </div>
      </div>

      <!-- File Preview goes here (pdf/image or other format viewer) -->
      <div class="file-preview">
        <iframe v-if="fileUrl" :src="fileUrl" width="100%" height="500px"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import IconButton from '@/components/Buttons/IconButton.vue'
import InputField from '@/components/Forms/InputField/InputField.vue'
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import {
  RiUploadCloudLine,
  RiDeleteBinFill,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiSubtractFill,
  RiAddFill,
  RiExpandDiagonalLine
} from '@remixicon/vue'

const plantillaOptions = ['Normal', 'Especial', 'Personalizada']
const categoriaOptions = ['Consultas', 'Análisis', 'Reportes']

// File data for the form
const fileData = ref({
  template: '',
  name: 'Consulta 1',
  pages: '12',
  category: '',
  creation: '03/03/2003'
})

// Icons
const trashIcon = RiDeleteBinFill
const arrowDown = RiArrowDownSLine
const arrowUp = RiArrowUpSLine

// File preview URL
const fileUrl = ref('/path/to/your/uploaded/file.pdf')

const router = useRouter()

// Reactive state to control sidebar visibility
const sidebarOpen = ref(true)

// Handlers
function handleDiscard() {
  console.log('Archivo descartado')
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

// Functions for file input
//const fileInput = ref(null)

/*function triggerFileInput() {
  fileInput.value.click()
}

function handleFileChange(event) {
  const selectedFiles = Array.from(event.target.files)
  console.log('Archivos seleccionados:', selectedFiles)
}

function triggerZoomIn() {
  console.log('Zoom In')
}

function triggerZoomOut() {
  console.log('Zoom Out')
}

function triggerExpand() {
  console.log('Expandir')
}*/

function goToDoing() {
  router.push('/upload/doing')
}
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

/* Button to reopen the sidebar */
.open-sidebar-btn {
  position: fixed;
  left: 0;
  top: 50%;
  z-index: 500;
  background-color: white;
  padding: 0.5rem;
  border-radius: 0 2vh 2vh 0;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

/* Adjust content width when sidebar is closed */
.content-preview {
  margin-left: 400px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.content-preview.full-width {
  margin-left: 0;
}
/* Top and bottom bars */
.top-bar {
  display: flex;
  align-items: center;
  height: 8vh;
  background-color: var(--blue-1);
  transition: margin-left 0.3s ease-in-out;
}

.textContainer {
  display: flex;
  align-items: center;
  padding-left: 1rem;
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

.zoom-button {
  background-color: var(--gray-1);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.zoom-button:hover {
  background-color: var(--gray-2);
}

.zoom-percentage {
  color: white;
  font-size: 1rem;
}

.icon-add,
.icon-subtract,
.icon-expand {
  fill: white;
  width: 24px;
  height: 24px;
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
  background-color: var(--blue-1);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.select-files-btn:hover {
  background-color: var(--dark-blue-1);
}

.icon-upload {
  fill: white;
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.file-preview {
  flex-grow: 1;
  padding: 1rem;
}
</style>
