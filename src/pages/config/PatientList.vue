<template>
  <div class="patient-container" @click="hideContextMenu">
    <h1 class="page-title">Pacientes</h1>
    <p>
      En esta vista puede administrar a los usuarios que tienen acceso a la aplicación y editar su
      información.
    </p>

    <!-- Barra de búsqueda y botón "Nuevo" -->
    <div class="top-bar">
      <SearchBar pholder="Buscar por nombre..." v-model="searchQuery" />
      <ButtonSimple msg="Nuevo" @click="showCreateModal" />
    </div>

    <!-- Tabla de pacientes -->
    <div class="table-container">
      <SetDisplayTable
        :loading="loading"
        :data="filteredPatients"
        :headers="tableHeaders"
        :success="true"
        @rowClick="handlePatientClick"
        @contextmenu="showContextMenu"
      />
    </div>

    <!-- Menú contextual -->
    <ContextMenu
      :position="contextMenuPosition"
      :visible="contextMenuVisible"
      @rename="showRenameModal"
      @remove="showRemoveModal"
    />

    <!-- Modal Crear -->
    <CreateTemplate
      v-if="isCreateModalVisible"
      @close="isCreateModalVisible = false"
      @create="addNewTemplate"
    />

    <!-- Modal Renombrar -->
    <RenameTemplate
      v-if="isRenameModalVisible"
      :currentName="selectedPatient.name"
      @close="isRenameModalVisible = false"
      @rename="renamePatientHandler"
    />

    <!-- Modal Eliminar -->
    <RemoveTemplate
      v-if="isRemoveModalVisible"
      :currentName="selectedPatient.name"
      @close="isRemoveModalVisible = false"
      @remove="removePatient"
    />
  </div>
</template>

<script setup>
/**
 * Este componente permite administrar las plantillas de pacientes (PatientTemplates).
 * Permite:
 *  - Buscar plantillas por nombre.
 *  - Crear una nueva plantilla.
 *  - Renombrar una plantilla existente.
 *  - Eliminar una plantilla.
 *  - Navegar a la configuración detallada de una plantilla seleccionada.
 */

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Componentes Internos
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import SearchBar from '@/components/Forms/InputField/SearchBar.vue'
import ContextMenu from '@/components/Feedback/Modals/ContextMenu.vue'
import CreateTemplate from '@/components/Feedback/Modals/CreateTemplate.vue'
import RenameTemplate from '@/components/Feedback/Modals/RenameTemplate.vue'
import RemoveTemplate from '@/components/Feedback/Modals/RemoveTemplate.vue'
import SetDisplayTable from '@/components/DataDisplay/Tables/SetDisplayTable.vue'

// Composables
import { useContextMenu } from '@/components/DataDisplay/Composables/useContextMenu.js'
import { useApi } from '@/oauth/useApi'
import { useAuth0 } from '@auth0/auth0-vue'

const emit = defineEmits(['addToast'])
const router = useRouter()
const { patchRequest, getRequest, deleteRequest, postRequest } = useApi()
const auth0 = useAuth0()

// Estado Reactivo
const searchQuery = ref('')
const loading = ref(false)
const isCreateModalVisible = ref(false)
const isRenameModalVisible = ref(false)
const isRemoveModalVisible = ref(false)
const patients = ref([])
const selectedPatient = ref({})

// Menú Contextual
const {
  position: contextMenuPosition,
  visible: contextMenuVisible,
  hideContextMenu
} = useContextMenu()

// Encabezados de la tabla
const tableHeaders = ref({
  name: 'Nombre',
  createdAt: 'Fecha de Creación'
})

// Computed: Filtra pacientes según el término de búsqueda
const filteredPatients = computed(() =>
  patients.value.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

/**
 * Obtiene el ID del doctor autenticado.
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
 * Muestra el modal para crear una nueva plantilla de paciente.
 */
function showCreateModal() {
  isCreateModalVisible.value = true
}

/**
 * Handler al crear una nueva plantilla desde el modal.
 * Navega a la vista de configuración de una plantilla nueva.
 * @param {String} templateName - Nombre de la nueva plantilla.
 */
function addNewTemplate(templateName) {
  isCreateModalVisible.value = false
  router.push({
    path: '/config/template',
    query: { name: templateName }
  })
}

/**
 * Muestra el modal para renombrar la plantilla seleccionada.
 */
function showRenameModal() {
  hideContextMenu()
  if (!selectedPatient.value || !selectedPatient.value.name) {
    console.error('No se ha seleccionado un paciente válido para renombrar.')
    return
  }
  isRenameModalVisible.value = true
}

/**
 * Muestra el modal para eliminar la plantilla seleccionada.
 */
function showRemoveModal() {
  hideContextMenu()
  isRemoveModalVisible.value = true
}

/**
 * Redirige a la vista de detalle/configuración de la plantilla seleccionada.
 * @param {Object} patient - Objeto de plantilla seleccionada.
 */
function handlePatientClick(patient) {
  if (patient && patient.templateId) {
    router.push({ path: `/config/template/${patient.templateId}` })
  } else {
    console.error('El ID de la plantilla es requerido para redirigir.')
  }
}

/**
 * Muestra el menú contextual en la posición del clic derecho sobre una plantilla.
 * @param {Event} event
 * @param {Object} patient - Plantilla seleccionada
 */
function showContextMenu(event, patient) {
  if (!patient) {
    console.error('No se ha proporcionado una plantilla válida para el menú contextual.')
    return
  }
  selectedPatient.value = patient
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  contextMenuVisible.value = true
}

/**
 * Carga la lista de plantillas del doctor.
 */
async function loadTemplates() {
  loading.value = true
  try {
    const doctorId = await getDoctorId()
    if (!doctorId) return

    const response = await getRequest(`/doctor/PatientTemplate/list?doctorId=${doctorId}`)
    if (response.status === 200 && Array.isArray(response.templates)) {
      patients.value = response.templates.map((template) => ({
        templateId: template.templateId,
        name: template.name,
        categories: template.categories.join(', '),
        createdAt: new Date(template.lastUpdate).toLocaleDateString()
      }))
    } else {
      console.error('No se encontraron plantillas en la respuesta:', response)
    }
  } catch (error) {
    console.error('Error al cargar las plantillas:', error)
  } finally {
    loading.value = false
  }
}

/**
 * Renombra una plantilla en el backend.
 * @param {String} templateId - ID de la plantilla
 * @param {String} newName - Nuevo nombre
 */
async function renameTemplate(templateId, newName) {
  if (!templateId) {
    console.error('El ID de la plantilla es requerido.')
    return
  }
  if (!newName.trim()) {
    console.error('El nuevo nombre de la plantilla es requerido.')
    return
  }

  const doctorId = await getDoctorId()
  if (!doctorId) return

  const requestBody = {
    doctorId,
    templateId,
    name: newName
  }

  try {
    await patchRequest('/doctor/PatientTemplate/', requestBody)
    const updatedPatient = patients.value.find((p) => p.templateId === templateId)
    if (updatedPatient) updatedPatient.name = newName
  } catch (error) {
    console.error('Error al renombrar la plantilla:', error)
    const message =
      error.response?.data?.message || 'No se pudo actualizar el nombre de la plantilla'
    alert(`Error: ${message}`)
  }
}

/**
 * Handler para renombrar la plantilla seleccionado desde el modal.
 * @param {String} newName - Nuevo nombre
 */
async function renamePatientHandler(newName) {
  const templateId = selectedPatient.value.templateId
  await renameTemplate(templateId, newName)
  isRenameModalVisible.value = false
}

/**
 * Elimina la plantilla seleccionada en el backend.
 */
async function removePatient() {
  const doctorId = await getDoctorId()
  const templateId = selectedPatient.value.templateId

  if (!templateId) {
    console.error('El ID de la plantilla es requerido para eliminar.')
    return
  }
  if (!doctorId) return

  const requestBody = { doctorId, templateId }
  try {
    const response = await deleteRequest('/doctor/PatientTemplate', requestBody)
    if (response.status === 200) {
      patients.value = patients.value.filter((p) => p.templateId !== templateId)
    } else {
      console.warn('No se pudo eliminar la plantilla:', response.message)
    }
  } catch (error) {
    console.error('Error al intentar eliminar la plantilla:', error)
    const message = error.response?.data?.message || 'No se pudo eliminar la plantilla'
    alert(`Error: ${message}`)
  } finally {
    isRemoveModalVisible.value = false
    hideContextMenu()
  }
}

// Hook: Cargar plantillas al montar el componente
onMounted(() => {
  loadTemplates()
})
</script>

<style scoped>
.patient-container {
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
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.table-container {
  padding: 0;
}
</style>
