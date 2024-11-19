<template>
  <router-view
    :doctorId="doctorId"
    :viewData="processedData"
    v-model:shownHeaders="shownHeaders"
    :allHeaders="allHeaders"
    :allData="fetchedData"
    :fields="fieldInfo"
    @updateData="fetchingPipeline"
    @openEdit="handleOpenEdit"
    @openFile="handleOpenFile"
    @addToast="addToast"
  />
  <div class="page">
    <h1>
      <b>{{ patientName }}</b>
    </h1>
    <div class="actions">
      <FilterTable @updateSorts="updateSorts" @updateFilters="updateFilters" :fields="fieldInfo" />
      <div class="new-container">
        <ButtonSimple :msg="'Nuevo'" :on-click="handleNewFile" />
      </div>
    </div>
    <div class="established"></div>
    <div class="table-illusion">
      <DisplayTable
        :data="fileData"
        :headers="shownHeaders"
        v-model:loading="loading"
        v-model:page-limit="pageLimit"
        :fields="fieldInfo"
        v-model:current-page="currentPage"
        :record-count="fileCount"
        :onClick="handleOpenPreview"
        @hideHeader="onHideField"
        :success="true"
        @updateLimit="updateLimit"
        @updatePage="updatePage"
      />
      <ConfigButton :onClick="handleTableSettings" />
    </div>
  </div>
</template>

<script setup>
import DisplayTable from '@/components/DataDisplay/Tables/DisplayTable.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import ConfigButton from '@/components/Buttons/ConfigButton.vue'
import FilterTable from '@/components/DataDisplay/Tables/Filter/FilterTable.vue'
import { useApi } from '@/oauth/useApi'
import { useRoute } from 'vue-router'
import { useTabStore } from '@/stores/tabStore'
import { useUploadStore } from '@/stores/uploadStore'
import { storeToRefs } from 'pinia'
// TOAST EMITS
//-------------------------------------------
const emit = defineEmits(['addToast'])
const addToast = (toast) => {
  emit('addToast', toast)
}
//-------------------------------------------

// PROPS

// Constants
const uploadStore = useUploadStore()
const tabManager = useTabStore()
const { activeTab } = storeToRefs(tabManager)
const router = useRouter()
const loading = ref(true)
const selected = ref(0)
const localSorts = ref([])
const localFitlers = ref([])

const { getRequest, postRequest } = useApi()
const route = useRoute()
const doctorId = ref('')

const patientName = ref('')
const recordId = ref('')

const fetchedData = ref({})
const processedData = ref({})

const shownHeaders = ref([])
const allHeaders = ref([])

const fileData = ref({})
const fieldInfo = ref({})

const pageLimit = ref(6)
const currentPage = ref(1)
const fileCount = ref(0)

const isFirst = ref(true)
// refining Data, (sort and filters)

watch(activeTab, async () => {
  getMetadata()
  if (recordId.value) {
    fetchingPipeline()
  }
})
const updateSorts = async (sorts) => {
  localSorts.value = sorts
}

const updateFilters = async (filters) => {
  localFitlers.value = filters
}
// Display table navigation
const updatePage = (page) => {
  currentPage.value = page
}

const updateLimit = (limit) => {
  pageLimit.value = limit
}

watch(
  shownHeaders,
  () => {
    if (!isFirst.value) {
      fetchingPipeline()
    }
  },
  { deep: true }
)

const onHideField = (header) => {
  shownHeaders.value.splice(shownHeaders.value.indexOf(header), 1)
}

const getMetadata = () => {
  let tab_metadata = tabManager.getActiveTab()
  doctorId.value = tab_metadata.metadata.doctorId
  patientName.value = tab_metadata.name
  recordId.value = tab_metadata.metadata.recordId
  // recordId.value = tab_metadata.recordId
}

onMounted(async () => {
  loading.value = true
  getMetadata()
  await getHeaders()
  isFirst.value = false
  await fetchingPipeline()
  loading.value = false
})

const fetchingPipeline = async () => {
  getMetadata()
  loading.value = true
  let raw_data = await getFilesRaw()
  fileData.value = formatFiles(raw_data)
  loading.value = false
}

const formatFiles = (raw_data) => {
  let formatData = []
  raw_data.forEach((file) => {
    let fields = file.fields.reduce((arr, item) => {
      arr[item.name] = item.value
      return arr
    }, {})
    let current_file = {
      Nombre: file.name,
      fileId: file.fileId,
      ...fields
    }
    formatData.push(current_file)
  })
  return formatData
}

const getFilesRaw = async () => {
  let raw_data = []
  let body = {
    doctorId: doctorId.value,
    recordId: recordId.value,
    limit: pageLimit.value,
    page: currentPage.value,
    category: 'Testing',
    fields: [],
    sorts: [],
    filters: []
  }
  shownHeaders.value.forEach((item) => {
    if (item != 'Nombre') {
      body.fields.push({
        name: item,
        type: fieldInfo.value[item].type
      })
    }
  })
  try {
    const response = await postRequest('/files/search', body)
    raw_data = response.files
    fileCount.value = response.total
  } catch {
    addToast({ content: 'Ocurrio un error obteniendo los registros', type: 0 })
  }
  return raw_data
}

const getHeaders = async () => {
  try {
    const response = await getRequest(`/files/search?doctorId=${doctorId.value}`)
    let data = response.fields
    let fdata = data.reduce((arr, item) => {
      arr[item.name] = {
        type: item.type
      }
      return arr
    }, {})
    let ext = {
      Nombre: {
        type: 'SHORT_TEXT'
      }
    }
    fieldInfo.value = {
      ...ext,
      ...fdata
    }
    let fields = Object.keys(fdata)
    allHeaders.value = ['Nombre', ...fields]
    shownHeaders.value = ['Nombre', ...fields.slice(0, 3)]
  } catch {
    addToast({ content: 'Ocurrio un error obteniendo los archivos', type: 0 })
  }
}
// Fucntions

const handleOpenPreview = (key) => {
  selected.value = fileData.value[key].fileId
  let path = route.fullPath
  router.push(`${path}/view/${selected.value}`)
}

const handleOpenEdit = () => {
  let path = route.fullPath.split('view')[0]
  router.push(`${path}edit/${selected.value}`)
}

const handleTableSettings = () => {
  let path = route.fullPath.split('?')[0]
  router.push(`${path}/table-settings`)
}

const handleNewFile = () => {
  uploadStore.recordId = recordId.value
  uploadStore.doctorId = doctorId.value
  router.push('/upload')
}

const handleOpenFile = () => {
  let name = fileData.value.filter((item) => item.fileId == selected.value)[0]['Nombre']
  console.log(JSON.stringify(name))
  let metadata = {
    doctorId: doctorId.value,
    fileId: selected.value
  }
  tabManager.changeTab(name, `/doctor/file/${selected.value}`, metadata)
}
</script>

<style scoped>
.records {
  display: flex;
}

.page {
  padding: 2rem 3rem 0 3rem;
  width: 100vw;
  height: auto;
}

.page .actions {
  padding-top: 1rem;
  display: flex;
  gap: 1rem;
  padding-bottom: 0.5rem;
  justify-content: space-between;
}

.page .table-illusion {
  display: grid;
  grid-template-columns: 10fr 1fr;
}

/* SideBar Space */
.sideSpace {
  width: 0vw;
  transition: Width 0.5s;
}

.sideSpace#max {
  width: 200px;
}

/* Media tags */
@media (max-aspect-ratio: 1/1) {
  .page {
    padding: 2rem 1.2rem 0 1.2rem;
    width: 100vw;
  }

  .sideSpace#max {
    width: 0vw;
  }
  .page .actions {
    flex-direction: column;
  }
}
</style>
