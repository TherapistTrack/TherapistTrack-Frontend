<template>
  <div class="file-view-container" @click="hideContextMenu">
    <SideBarConfig
      backgroundColor="#1f3a93"
      arrowColor="#ffffff"
      iconColor="#ffffff"
      userName="Jose Marchena"
      userRole="Usuario"
      selectedOption="Archivos"
    />

    <div class="content">
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
      ></SetDisplayTable>

      <!-- Modal para crear un nuevo archivo -->
      <CreateTemplate
        v-if="isCreateModalVisible"
        type="file"
        @close="isCreateModalVisible = false"
        @create="addNewFile"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import SearchBar from '@/components/Forms/InputField/SearchBar.vue'
import CreateTemplate from '@/components/Feedback/Modals/CreateTemplate.vue'
import SetDisplayTable from '@/components/DataDisplay/Tables/SetDisplayTable.vue'

const router = useRouter()

const searchQuery = ref('')
const loading = ref(false)
const isCreateModalVisible = ref(false)
const files = ref([
  { id: 1, name: 'Examen', createdAt: '02/3/2025' },
  { id: 2, name: 'Documento Legal', createdAt: '10/5/2024' },
  { id: 3, name: 'Normal', createdAt: '30/6/2016' }
])

const tableHeaders = ref({
  name: 'Nombre',
  createdAt: 'Creado el'
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

  // Redirige a CustomizeFile pasando el nombre del archivo
  router.push({ path: '/config/customize-file', query: { name: fileName } })
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

.top-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
