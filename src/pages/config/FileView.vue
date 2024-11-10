<template>
  <div class="file-view-container" @click="hideContextMenu">
    <h1 class="page-title">Archivos</h1>
    <p>Aquí puede administrar los archivos disponibles.</p>

    <div class="top-bar">
      <SearchBar pholder="Buscar por nombre..." v-model="searchQuery" />
      <ButtonSimple msg="Nuevo" @click="showCreateModal" />
    </div>

    <SetDisplayTable
      :loading="loading"
      :data="filteredFiles"
      :headers="tableHeaders"
      :success="true"
      @rowClick="handleFileClick"
      @contextmenu="showContextMenu"
    ></SetDisplayTable>

    <!-- Context Menu -->
    <ContextMenu
      :position="contextMenuPosition"
      :visible="contextMenuVisible"
      @rename="showRenameModal"
      @remove="showRemoveModal"
    />

    <!-- Modal para crear un nuevo archivo -->
    <CreateTemplate
      v-if="isCreateModalVisible"
      type="file"
      @close="isCreateModalVisible = false"
      @create="addNewFile"
    />

    <!-- Modal para renombrar archivo -->
    <RenameTemplate
      v-if="isRenameModalVisible"
      :currentName="selectedFile.name"
      @close="isRenameModalVisible = false"
      @rename="renameFileHandler"
    />

    <!-- Modal para eliminar archivo -->
    <RemoveTemplate
      v-if="isRemoveModalVisible"
      :currentName="selectedFile.name"
      @close="isRemoveModalVisible = false"
      @remove="removeFile"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import SearchBar from '@/components/Forms/InputField/SearchBar.vue'
import CreateTemplate from '@/components/Feedback/Modals/CreateTemplate.vue'
import RenameTemplate from '@/components/Feedback/Modals/RenameTemplate.vue'
import RemoveTemplate from '@/components/Feedback/Modals/RemoveTemplate.vue'
import SetDisplayTable from '@/components/DataDisplay/Tables/SetDisplayTable.vue'
import ContextMenu from '@/components/Feedback/Modals/ContextMenu.vue'
import { useApi } from '@/oauth/useApi'
import { useContextMenu } from '@/components/DataDisplay/Composables/useContextMenu.js'

const router = useRouter()
const { getRequest, patchRequest, deleteRequest } = useApi()

const searchQuery = ref('')
const loading = ref(false)
const isCreateModalVisible = ref(false)
const isRenameModalVisible = ref(false)
const isRemoveModalVisible = ref(false)
const files = ref([])
const selectedFile = ref({})

const {
  position: contextMenuPosition,
  visible: contextMenuVisible,
  hideContextMenu
} = useContextMenu()

const tableHeaders = ref({
  name: 'Nombre',
  createdAt: 'Fecha de Creación'
})

const filteredFiles = computed(() =>
  files.value.filter((file) => file.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
)

function showCreateModal() {
  isCreateModalVisible.value = true
}

function addNewFile(fileName) {
  // Close the creation modal
  isCreateModalVisible.value = false

  // Navigate to CustomizeFile component for creating a new file
  router.push({
    path: `/config/files/new`,
    query: { name: fileName }
  })
}

function showRenameModal() {
  hideContextMenu()
  console.log('Paciente recibido en showRenameModal:', selectedFile.value)

  if (!selectedFile.value || !selectedFile.value.name) {
    console.error('No se ha seleccionado un archivo válido para renombrar.')
    return
  }

  console.log('selectedFile después de asignación en showRenameModal:', selectedFile.value)
  isRenameModalVisible.value = true
}

function showRemoveModal() {
  hideContextMenu()
  isRemoveModalVisible.value = true
}

function handleFileClick(file) {
  console.log('Archivo seleccionado:', file)
  if (file && file.fileId) {
    // Cambia a la ruta correcta para 'files/:fileId'
    router.push({ path: `/config/files/${file.fileId}` })
  } else {
    console.error('El ID del archivo es requerido para redirigir.')
  }
}

function showContextMenu(event, file) {
  selectedFile.value = file
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  contextMenuVisible.value = true
}

async function renameFile(fileId, newName) {
  if (!fileId) {
    console.error('El ID del archivo es requerido y debe ser válido')
    return
  }

  if (!newName || typeof newName !== 'string' || !newName.trim()) {
    console.error('El nuevo nombre del archivo es requerido')
    return
  }

  const requestBody = {
    doctorId: '66de4e2e2e0651893bc6b225',
    templateId: fileId, // Cambiar a templateId
    name: newName
  }

  try {
    const response = await patchRequest('/doctor/FileTemplate', requestBody)
    console.log('Archivo renombrado exitosamente:', response)

    const updatedFile = files.value.find((file) => file.fileId === fileId)
    if (updatedFile) {
      updatedFile.name = newName
    }
  } catch (error) {
    console.error('Error al renombrar el archivo:', error)
    alert(`Error al renombrar el archivo: ${error.response?.data?.message || error.message}`)
  }
}

async function renameFileHandler(newName) {
  const fileId = selectedFile.value.fileId
  await renameFile(fileId, newName)
  isRenameModalVisible.value = false
}

async function removeFile() {
  const fileId = selectedFile.value.fileId

  if (!fileId) {
    console.error('El ID del archivo es requerido para eliminar.')
    return
  }

  const requestBody = {
    doctorId: '66de4e2e2e0651893bc6b225',
    templateId: fileId // Cambiar a templateId
  }

  try {
    const response = await deleteRequest('/doctor/FileTemplate', requestBody)
    if (response.status === 200) {
      files.value = files.value.filter((file) => file.fileId !== fileId)
      console.log(
        `Archivo eliminado exitosamente: Status ${response.status}, Message: ${response.message}`
      )
    } else {
      console.warn('No se pudo eliminar el archivo:', response.message)
    }
  } catch (error) {
    console.error('Error al intentar eliminar el archivo:', error)
    alert(`Error al eliminar el archivo: ${error.response?.data?.message || error.message}`)
  } finally {
    isRemoveModalVisible.value = false
    hideContextMenu()
  }
}

async function loadFiles() {
  loading.value = true
  try {
    const doctorId = '66de4e2e2e0651893bc6b225'
    const response = await getRequest(`/doctor/FileTemplate/list?doctorId=${doctorId}`)
    console.log('Archivos obtenidos:', response)

    if (response.status === 200 && Array.isArray(response.templates)) {
      files.value = response.templates.map((template) => ({
        fileId: template.templateId, // Asegúrate de que el campo esté mapeado correctamente
        name: template.name,
        createdAt: new Date(template.lastUpdate).toLocaleDateString()
      }))
    } else {
      console.error('No se encontraron archivos en la respuesta:', response)
    }
  } catch (error) {
    console.error('Error al cargar los archivos:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFiles()
})
</script>

<style scoped>
.file-view-container {
  padding: 1rem 3rem 0 3rem;
  width: 100vw;
  background-color: white;
  height: 100vh;
}

DisplayTable {
  max-height: calc(100vh - 150px);
  overflow-y: auto;
}

.page-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
}

.top-bar {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}
</style>
