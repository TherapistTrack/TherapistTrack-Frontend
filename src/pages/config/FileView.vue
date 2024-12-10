<template>
  <div class="file-view-container" @click="hideContextMenu">
    <h1 class="page-title">Archivos</h1>
    <p>Aquí puede administrar los archivos disponibles.</p>

    <!-- Barra Superior: Búsqueda y Nuevo Archivo -->
    <div class="top-bar">
      <SearchBar pholder="Buscar por nombre..." v-model="searchQuery" />
      <ButtonSimple msg="Nuevo" @click="showCreateModal" />
    </div>

    <!-- Tabla de Archivos -->
    <SetDisplayTable
      :loading="loading"
      :data="filteredFiles"
      :headers="tableHeaders"
      :success="true"
      @rowClick="handleFileClick"
      @contextmenu="showContextMenu"
    />

    <!-- Menú contextual -->
    <ContextMenu
      :position="contextMenuPosition"
      :visible="contextMenuVisible"
      @rename="showRenameModal"
      @remove="showRemoveModal"
    />

    <!-- Modal Crear Archivo -->
    <CreateTemplate
      v-if="isCreateModalVisible"
      type="file"
      @close="isCreateModalVisible = false"
      @create="addNewFile"
    />

    <!-- Modal Renombrar Archivo -->
    <RenameTemplate
      v-if="isRenameModalVisible"
      :currentName="selectedFile.name"
      @close="isRenameModalVisible = false"
      @rename="renameFileHandler"
    />

    <!-- Modal Eliminar Archivo -->
    <RemoveTemplate
      v-if="isRemoveModalVisible"
      :currentName="selectedFile.name"
      @close="isRemoveModalVisible = false"
      @remove="removeFile"
    />
  </div>
</template>

<script setup>
/**
 * Este componente muestra la lista de archivos (FileTemplates) asociados a un doctor.
 * Permite:
 *  - Buscar archivos por nombre.
 *  - Crear un nuevo archivo (redirige a la pantalla de configuración).
 *  - Renombrar un archivo existente.
 *  - Eliminar un archivo.
 *  - Seleccionar un archivo para editar su configuración.
 */

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Componentes internos
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import SearchBar from '@/components/Forms/InputField/SearchBar.vue'
import CreateTemplate from '@/components/Feedback/Modals/CreateTemplate.vue'
import RenameTemplate from '@/components/Feedback/Modals/RenameTemplate.vue'
import RemoveTemplate from '@/components/Feedback/Modals/RemoveTemplate.vue'
import SetDisplayTable from '@/components/DataDisplay/Tables/SetDisplayTable.vue'
import ContextMenu from '@/components/Feedback/Modals/ContextMenu.vue'

// Composables
import { useApi } from '@/oauth/useApi'
import { useContextMenu } from '@/components/DataDisplay/Composables/useContextMenu.js'
import { useAuth0 } from '@auth0/auth0-vue'

// Emisor de eventos
const emit = defineEmits(['addToast'])

/** Composables & Hooks */
const router = useRouter()
const { getRequest, patchRequest, deleteRequest, postRequest } = useApi()
const auth0 = useAuth0()

// Estados reactivos
const searchQuery = ref('')
const loading = ref(false)
const isCreateModalVisible = ref(false)
const isRenameModalVisible = ref(false)
const isRemoveModalVisible = ref(false)
const files = ref([])
const selectedFile = ref({})

// Menú contextual
const {
  position: contextMenuPosition,
  visible: contextMenuVisible,
  hideContextMenu
} = useContextMenu()

// Definición de encabezados para la tabla
const tableHeaders = ref({
  name: 'Nombre',
  createdAt: 'Fecha de Creación'
})

// Computed: Filtra archivos según el query de búsqueda
const filteredFiles = computed(() =>
  files.value.filter((file) => file.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
)

/**
 * Obtiene el ID del doctor.
 */
async function getDoctorId() {
  const userId = auth0.user.value.sub.split('|')[1]
  try {
    const response = await postRequest('/users/@me', { id: userId })
    return response.data.roleDependentInfo.id
  } catch {
    emit('addToast', { content: 'Ocurrió un error obteniendo información del doctor', type: 0 })
    return ''
  }
}

/**
 * Muestra el modal para crear un nuevo archivo.
 */
function showCreateModal() {
  isCreateModalVisible.value = true
}

/**
 * Maneja la creación de un nuevo archivo, redirigiendo a la pantalla de configuración.
 * @param {String} fileName - Nombre del nuevo archivo.
 */
function addNewFile(fileName) {
  isCreateModalVisible.value = false
  router.push({ path: '/config/files/new', query: { name: fileName } })
}

/**
 * Muestra el modal para renombrar un archivo seleccionado.
 */
function showRenameModal() {
  hideContextMenu()
  if (!selectedFile.value || !selectedFile.value.name) {
    console.error('No se ha seleccionado un archivo válido para renombrar.')
    return
  }
  isRenameModalVisible.value = true
}

/**
 * Muestra el modal para eliminar un archivo seleccionado.
 */
function showRemoveModal() {
  hideContextMenu()
  isRemoveModalVisible.value = true
}

/**
 * Redirige a la vista de detalle/configuración de un archivo.
 * @param {Object} file - Archivo seleccionado.
 */
function handleFileClick(file) {
  if (file && file.fileId) {
    router.push({ path: `/config/files/${file.fileId}` })
  } else {
    console.error('El ID del archivo es requerido para redirigir.')
  }
}

/**
 * Muestra el menú contextual sobre un archivo.
 * @param {Event} event - Evento del click derecho.
 * @param {Object} file - Archivo seleccionado.
 */
function showContextMenu(event, file) {
  selectedFile.value = file
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  contextMenuVisible.value = true
}

/**
 * Renombra el archivo seleccionado en el backend.
 * @param {String} fileId - ID del archivo.
 * @param {String} newName - Nuevo nombre.
 */
async function renameFile(fileId, newName) {
  if (!fileId || !newName || !newName.trim()) {
    console.error('El ID del archivo y el nuevo nombre son requeridos')
    return
  }

  const doctorId = await getDoctorId()
  if (!doctorId) return

  const requestBody = {
    doctorId,
    templateId: fileId, // Se envía como templateId
    name: newName
  }

  try {
    await patchRequest('/doctor/FileTemplate', requestBody)
    const updatedFile = files.value.find((file) => file.fileId === fileId)
    if (updatedFile) updatedFile.name = newName
  } catch (error) {
    console.error('Error al renombrar el archivo:', error)
    alert(`Error al renombrar el archivo: ${error.response?.data?.message || error.message}`)
  }
}

/**
 * Handler para el modal de renombrar archivo.
 * @param {String} newName - Nuevo nombre.
 */
async function renameFileHandler(newName) {
  const fileId = selectedFile.value.fileId
  await renameFile(fileId, newName)
  isRenameModalVisible.value = false
}

/**
 * Elimina el archivo seleccionado en el backend.
 */
async function removeFile() {
  const fileId = selectedFile.value.fileId
  if (!fileId) {
    console.error('El ID del archivo es requerido para eliminar.')
    return
  }

  const doctorId = await getDoctorId()
  if (!doctorId) return

  const requestBody = {
    doctorId,
    templateId: fileId
  }

  try {
    const response = await deleteRequest('/doctor/FileTemplate', requestBody)
    if (response.status === 200) {
      files.value = files.value.filter((file) => file.fileId !== fileId)
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

/**
 * Carga la lista de archivos desde el backend.
 */
async function loadFiles() {
  loading.value = true
  try {
    const doctorId = await getDoctorId()
    if (!doctorId) return

    const response = await getRequest(`/doctor/FileTemplate/list?doctorId=${doctorId}`)
    if (response.status === 200 && Array.isArray(response.templates)) {
      files.value = response.templates.map((template) => ({
        fileId: template.templateId,
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

// Hook: Cargar archivos al montar el componente
onMounted(() => {
  loadFiles()
})
</script>

<style scoped>
.file-view-container {
  padding: 2rem 4rem;
  width: 100vw;
  background-color: white;
  height: 100vh;
}

.page-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 2rem;
}

.top-bar {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.table-container {
  padding: 0;
}
</style>
