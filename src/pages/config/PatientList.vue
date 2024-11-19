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

    <!-- Tabla para mostrar la lista de pacientes -->
    <div class="table-container">
      <SetDisplayTable
        :loading="loading"
        :data="filteredPatients"
        :headers="tableHeaders"
        :success="true"
        @rowClick="handlePatientClick"
        @contextmenu="showContextMenu"
      ></SetDisplayTable>
    </div>

    <!-- Context Menu -->
    <ContextMenu
      :position="contextMenuPosition"
      :visible="contextMenuVisible"
      @rename="showRenameModal"
      @remove="showRemoveModal"
    />

    <!-- Modal para crear nueva plantilla -->
    <CreateTemplate
      v-if="isCreateModalVisible"
      @close="isCreateModalVisible = false"
      @create="addNewTemplate"
    />

    <!-- Modal para renombrar plantilla -->
    <RenameTemplate
      v-if="isRenameModalVisible"
      :currentName="selectedPatient.name"
      @close="isRenameModalVisible = false"
      @rename="renamePatient"
    />

    <!-- Modal para eliminar plantilla -->
    <RemoveTemplate
      v-if="isRemoveModalVisible"
      :currentName="selectedPatient.name"
      @close="isRemoveModalVisible = false"
      @remove="removePatient"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import SearchBar from '@/components/Forms/InputField/SearchBar.vue'
import ContextMenu from '@/components/Feedback/Modals/ContextMenu.vue'
import CreateTemplate from '@/components/Feedback/Modals/CreateTemplate.vue'
import RenameTemplate from '@/components/Feedback/Modals/RenameTemplate.vue'
import RemoveTemplate from '@/components/Feedback/Modals/RemoveTemplate.vue'
import { useContextMenu } from '@/components/DataDisplay/Composables/useContextMenu.js'
import SetDisplayTable from '@/components/DataDisplay/Tables/SetDisplayTable.vue'
import { useApi } from '@/oauth/useApi'
import { useAuth0 } from '@auth0/auth0-vue'
// Usa useRouter para definir router

const emit = defineEmits('addToast')
const router = useRouter()
const { patchRequest, getRequest, deleteRequest, postRequest } = useApi()
const searchQuery = ref('')
const loading = ref(false)
const isCreateModalVisible = ref(false)
const isRenameModalVisible = ref(false)
const isRemoveModalVisible = ref(false)
const patients = ref([])
const selectedPatient = ref({})
const auth0 = useAuth0()

const get_doctor_id = async () => {
  let userId = auth0.user.value.sub.split('|')[1]
  let doctorId = ''
  try {
    const response = await postRequest('/users/@me', { id: userId })
    doctorId = response.data.roleDependentInfo.id
  } catch {
    emit('addToast', { content: 'Ocurrio un error obteniendo información del doctor', type: 0 })
  }
  return doctorId
}

const {
  position: contextMenuPosition,
  visible: contextMenuVisible,
  hideContextMenu
} = useContextMenu()

const tableHeaders = ref({
  name: 'Nombre',
  createdAt: 'Fecha de Creación'
})

const filteredPatients = computed(() =>
  patients.value.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

function showCreateModal() {
  isCreateModalVisible.value = true
}

function addNewTemplate(templateName) {
  // Cierra el modal de creación
  isCreateModalVisible.value = false

  // Navega al componente CustomizeTemplate sin templateId, indicando que es una nueva plantilla
  router.push({
    path: `/config/template`,
    query: { name: templateName }
  })
}

function showRenameModal() {
  hideContextMenu()
  console.log('Paciente recibido en showRenameModal:', selectedPatient.value)

  if (!selectedPatient.value || !selectedPatient.value.name) {
    console.error('No se ha seleccionado un paciente válido para renombrar.')
    return
  }

  console.log('selectedPatient después de asignación en showRenameModal:', selectedPatient.value)
  isRenameModalVisible.value = true
}

function showRemoveModal() {
  hideContextMenu()
  isRemoveModalVisible.value = true
}

function handlePatientClick(patient) {
  console.log('Paciente seleccionado:', patient)
  if (patient && patient.templateId) {
    router.push({ path: `/config/template/${patient.templateId}` })
  } else {
    console.error('El ID de la plantilla es requerido para redirigir.')
  }
}

async function loadTemplates() {
  loading.value = true
  try {
    const doctorId = await get_doctor_id()
    const response = await getRequest(`/doctor/PatientTemplate/list?doctorId=${doctorId}`)
    console.log('Plantillas obtenidas:', response)

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

onMounted(() => {
  loadTemplates() // Cargar las plantillas al montar el componente
})

async function renameTemplate(templateId, newName) {
  console.log('templateId recibido en renameTemplate:', templateId)
  console.log('newName recibido en renameTemplate:', newName)

  // Convertir templateId a string si es necesario
  if (typeof templateId !== 'string') {
    templateId = String(templateId)
    console.log('templateId convertido a string:', templateId)
  }

  if (!templateId) {
    console.error('El ID de la plantilla es requerido y debe ser válido')
    return
  }

  if (!newName || typeof newName !== 'string' || !newName.trim()) {
    console.error('El nuevo nombre de la plantilla es requerido')
    return
  }

  const requestBody = {
    doctorId: '66de4e2e2e0651893bc6b225',
    templateId: templateId,
    name: newName
  }

  console.log('Datos para enviar a la API:', JSON.stringify(requestBody, null, 2))

  try {
    const response = await patchRequest('/doctor/PatientTemplate/', requestBody)
    console.log('Respuesta de la API:', response)
    const updatedPatient = patients.value.find((patient) => patient.templateId === templateId)
    if (updatedPatient) {
      updatedPatient.name = newName
      console.log('Paciente actualizado en la lista:', updatedPatient)
    }
  } catch (error) {
    console.error('Error al renombrar la plantilla:', error)
    if (error.response) {
      console.error('Detalles del error:', error.response.data)
      alert(`Error: ${error.response.data.message}`)
    } else {
      console.error('No se recibió respuesta del servidor')
      alert('No se pudo actualizar el nombre de la plantilla')
    }
  }
}

async function renamePatient(newName) {
  console.log('Nuevo nombre recibido en renamePatient:', newName)
  console.log('selectedPatient antes de renombrar:', selectedPatient.value)

  // Verificar que `selectedPatient` tenga el `templateId` correctamente.
  const templateId = selectedPatient.value.templateId
  if (!templateId) {
    console.error('El ID de la plantilla es requerido')
    return
  }

  if (!newName.trim()) {
    console.error('El nuevo nombre de la plantilla es requerido')
    return
  }

  await renameTemplate(templateId, newName)
  isRenameModalVisible.value = false
}

function showContextMenu(event, patient) {
  if (!patient) {
    console.error('No se ha proporcionado un paciente válido para el menú contextual.')
    return
  }

  console.log('Paciente recibido en showContextMenu:', patient)
  selectedPatient.value = patient
  console.log('selectedPatient después de asignación en showContextMenu:', selectedPatient.value)
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  contextMenuVisible.value = true
}

async function removePatient() {
  const doctorId = '66de4e2e2e0651893bc6b225'
  const templateId = selectedPatient.value.templateId

  if (!templateId) {
    console.error('El ID de la plantilla es requerido para eliminar.')
    return
  }

  const requestBody = { doctorId, templateId }
  try {
    const response = await deleteRequest('/doctor/PatientTemplate', requestBody)
    if (response.status === 200) {
      // Filtrar la plantilla eliminada de la lista de pacientes
      patients.value = patients.value.filter((patient) => patient.templateId !== templateId)
      console.log(
        `Plantilla eliminada exitosamente: Status ${response.status}, Message: ${response.message}`
      )
    } else {
      console.warn('No se pudo eliminar la plantilla:', response.message)
    }
  } catch (error) {
    console.error('Error al intentar eliminar la plantilla:', error)
    if (error.response) {
      alert(`Error: ${error.response.data.message}`)
    }
  } finally {
    isRemoveModalVisible.value = false
    hideContextMenu()
  }
}
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

h1 {
  font-size: 24px;
  margin-bottom: 2rem;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.table-container {
  padding: 0 0 0 0;
}
</style>
