<template>
  <div class="patient-list-container" @click="hideContextMenu">
    <!-- Usando la SideBarConfig con color azul -->
    <SideBarConfig
      backgroundColor="#1f3a93"
      arrowColor="#ffffff"
      iconColor="#ffffff"
      userName="Jose Marchena"
      userRole="Usuario"
      selectedOption="Pacientes"
    />

    <div class="content">
      <!-- Título de la página -->
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
      <DisplayTable
        :loading="loading"
        :data="filteredPatients"
        :headers="tableHeaders"
        @rowClick="handlePatientClick"
        @contextmenu.prevent="showContextMenu($event, patient)"
      ></DisplayTable>

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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router' // Importa useRouter
import SideBarConfig from '@/components/Navigation/SideBar/SideBarConfig.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import SearchBar from '@/components/Forms/InputField/SearchBar.vue'
import DisplayTable from '@/components/DataDisplay/Tables/DisplayTable.vue'
import ContextMenu from '@/components/Feedback/Modals/ContextMenu.vue'
import CreateTemplate from '@/components/Feedback/Modals/CreateTemplate.vue'
import RenameTemplate from '@/components/Feedback/Modals/RenameTemplate.vue'
import RemoveTemplate from '@/components/Feedback/Modals/RemoveTemplate.vue'
import { useContextMenu } from '@/components/DataDisplay/Composables/useContextMenu.js'

// Usa useRouter para definir router
const router = useRouter()

const searchQuery = ref('')
const loading = ref(false)
const isCreateModalVisible = ref(false)
const isRenameModalVisible = ref(false)
const isRemoveModalVisible = ref(false)
const selectedPatient = ref({})

const {
  position: contextMenuPosition,
  visible: contextMenuVisible,
  showContextMenu,
  hideContextMenu
} = useContextMenu()

const patients = ref([
  { id: 1, name: 'Plantilla Infante', createdAt: '02/3/2025' },
  { id: 2, name: '2024-Adulto-v1', createdAt: '10/5/2024' },
  { id: 3, name: '2016-Adulto-v0', createdAt: '30/6/2016' }
])

const tableHeaders = ref({
  name: 'Nombre',
  createdAt: 'Created at'
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
  patients.value.push({
    id: patients.value.length + 1,
    name: templateName,
    createdAt: new Date().toLocaleDateString()
  })
  isCreateModalVisible.value = false
  router.push('/config/template/')
}

function showRenameModal() {
  hideContextMenu()
  isRenameModalVisible.value = true
}

function showRemoveModal() {
  hideContextMenu()
  isRemoveModalVisible.value = true
}

function renamePatient(newName) {
  selectedPatient.value.name = newName
  isRenameModalVisible.value = false
}

function removePatient() {
  patients.value = patients.value.filter((patient) => patient.id !== selectedPatient.value.id)
  isRemoveModalVisible.value = false
}

function handlePatientClick(patientId) {
  console.log('Paciente seleccionado:', patientId)
}
</script>

<style scoped>
.patient-list-container {
  display: flex;
  height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.content {
  flex-grow: 1;
  padding: 65px;
  background-color: #fff;
  border-radius: 8px;
  height: 100vh;
  margin-left: 0;
  box-shadow: none;
  overflow-y: auto;
}

.page-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
}

h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
