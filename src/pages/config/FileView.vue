<template>
  <div class="file-view-container" @click="hideContextMenu">
    <!-- Using SideBarConfig with appropriate color and labels -->
    <SideBarConfig
      backgroundColor="#1f3a93"
      arrowColor="#ffffff"
      iconColor="#ffffff"
      userName="Jose Marchena"
      userRole="Usuario"
      selectedOption="Archivos"
    />

    <div class="content">
      <!-- Page Title -->
      <h1 class="page-title">Archivos</h1>
      <p>
        En esta vista puede administrar a los usuarios que tienen acceso a la aplicación y editar su
        información.
      </p>

      <!-- Search bar and "Nuevo" button -->
      <div class="top-bar">
        <SearchBar pholder="Buscar por nombre..." v-model="searchQuery" />
        <ButtonSimple msg="Nuevo" @click="showCreateModal" />
      </div>

      <!-- Table to display the list of files -->
      <DisplayTable
        :loading="loading"
        :data="filteredFiles"
        :headers="tableHeaders"
        @rowClick="handleFileClick"
        @contextmenu.prevent="showContextMenu($event, file)"
      ></DisplayTable>

      <!-- Context Menu -->
      <ContextMenu
        :position="contextMenuPosition"
        :visible="contextMenuVisible"
        @rename="showRenameModal"
        @remove="showRemoveModal"
      />

      <!-- Modal to create a new file entry -->
      <CreateTemplate
        v-if="isCreateModalVisible"
        @close="isCreateModalVisible = false"
        @create="addNewFile"
      />

      <!-- Modal to rename a file entry -->
      <RenameTemplate
        v-if="isRenameModalVisible"
        :currentName="selectedFile.name"
        @close="isRenameModalVisible = false"
        @rename="renameFile"
      />

      <!-- Modal to remove a file entry -->
      <RemoveTemplate
        v-if="isRemoveModalVisible"
        :currentName="selectedFile.name"
        @close="isRemoveModalVisible = false"
        @remove="removeFile"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import SearchBar from '@/components/Forms/InputField/SearchBar.vue'
import DisplayTable from '@/components/DataDisplay/Tables/DisplayTable.vue'
import ContextMenu from '@/components/Feedback/Modals/ContextMenu.vue'
import CreateTemplate from '@/components/Feedback/Modals/CreateTemplate.vue'
import RenameTemplate from '@/components/Feedback/Modals/RenameTemplate.vue'
import RemoveTemplate from '@/components/Feedback/Modals/RemoveTemplate.vue'
import { useContextMenu } from '@/components/DataDisplay/Composables/useContextMenu.js'

const searchQuery = ref('')
const loading = ref(false)
const isCreateModalVisible = ref(false)
const isRenameModalVisible = ref(false)
const isRemoveModalVisible = ref(false)
const selectedFile = ref({})

const {
  position: contextMenuPosition,
  visible: contextMenuVisible,
  showContextMenu,
  hideContextMenu
} = useContextMenu()

const files = ref([
  { id: 1, name: 'Examen', createdAt: '02/3/2025' },
  { id: 2, name: 'Documento Legal', createdAt: '10/5/2024' },
  { id: 3, name: 'Normal', createdAt: '30/6/2016' }
])

const tableHeaders = ref({
  name: 'Nombre',
  createdAt: 'Created at'
})

const filteredFiles = computed(() =>
  files.value.filter((file) => file.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
)

function showCreateModal() {
  isCreateModalVisible.value = true
}

function addNewFile(fileName) {
  files.value.push({
    id: files.value.length + 1,
    name: fileName,
    createdAt: new Date().toLocaleDateString()
  })
  isCreateModalVisible.value = false
}

function showRenameModal() {
  hideContextMenu()
  isRenameModalVisible.value = true
}

function showRemoveModal() {
  hideContextMenu()
  isRemoveModalVisible.value = true
}

function renameFile(newName) {
  selectedFile.value.name = newName
  isRenameModalVisible.value = false
}

function removeFile() {
  files.value = files.value.filter((file) => file.id !== selectedFile.value.id)
  isRemoveModalVisible.value = false
}

function handleFileClick(fileId) {
  console.log('Archivo seleccionado:', fileId)
}
</script>

<style scoped>
.file-view-container {
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
  overflow-y: hidden;
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
