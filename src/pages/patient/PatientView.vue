<template>
  <router-view
    :recordId="selected"
    :viewData="processedData"
    v-model:shownHeaders="shownHeaders"
    :allHeaders="allHeaders"
    :allData="fetchedData"
    :fields="templateFields"
    @updateData="updateData"
    @openEdit="handleOpenEdit"
  />
  <div class="page">
    <h1><b>Juan Pablo Solis</b></h1>
    <div class="actions">
      <FilterTable
        @updateSorts="updateSorts"
        @updateFilters="updateFilters"
        :fields="templateFields"
      />
      <div class="new-container">
        <ButtonSimple :msg="'Nuevo'" :on-click="handleNewRecord" />
      </div>
    </div>
    <div class="established"></div>
    <div class="table-illusion">
      <DisplayTable
        :data="processedData"
        :headers="shownHeaders"
        v-model:loading="loading"
        v-model:page-limit="pageLimit"
        :fields="templateFields"
        v-model:current-page="currentPage"
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
import files from './files.json'
import files_template from './file_template.json'
import { useAuth0 } from '@auth0/auth0-vue'

// Constants
const auth0 = useAuth0()
const router = useRouter()
const fetchedData = ref({})
const processedData = ref({})
const loading = ref(true)
const selected = ref(0)
const localSorts = ref([])
const localFitlers = ref([])

const currentPage = ref(1)
const pageLimit = ref(6)
// TOAST EMITS
//-------------------------------------------
const emit = defineEmits(['addToast'])
const addToast = (toast) => {
  emit('addToast', toast)
}
//-------------------------------------------

// PROPS
defineProps({
  userId: String
})

// refining Data, (sort and filters)
const updateSorts = async (sorts) => {
  localSorts.value = sorts
  updateData()
}

const updateFilters = async (filters) => {
  localFitlers.value = filters
  updateData()
}
// Display table navigation
const updatePage = (page) => {
  currentPage.value = page
  updateData()
}

const updateLimit = (limit) => {
  pageLimit.value = limit
  updateData()
}
// Emissions from children
const updateData = async () => {
  let fields = shownHeaders.value.map((val) => ({
    name: val,
    type: templateFields.value[val].type
  }))
  let body = {
    doctorId: auth0.user.value.sub.split('|')[1],
    limit: pageLimit.value,
    page: currentPage.value,
    fields: fields,
    filters: localFitlers.value || [],
    sorts: localSorts.value || []
  }
  loading.value = true
  setTimeout(() => {
    console.log('API CALL!!!')
    console.log(JSON.stringify(body))
    loading.value = false
  }, 250)
}

const templateFields = ref({})
const shownHeaders = ref([])
const allHeaders = ref([])

watch(
  shownHeaders,
  () => {
    updateData()
  },
  { deep: true }
)

// Table field logic
const onHideField = (header) => {
  shownHeaders.value.splice(shownHeaders.value.indexOf(header), 1)
}
// On Mounted
const getAllHeaders = (template) => {
  let fields = template.reduce((acc, item) => {
    acc = item.fields
    return acc
  }, {})

  let temFields = fields.reduce((acc, item) => {
    if (item.type == 'CHOICE') {
      acc[item.name] = {
        description: item.description,
        required: item.required,
        type: item.type,
        options: item.options
      }
    } else {
      acc[item.name] = {
        description: item.description,
        required: item.required,
        type: item.type
      }
    }
    return acc
  }, {})
  temFields = {
    ...temFields,
    Nombre: {
      description: 'Nombre del archivo',
      required: true,
      type: 'SHORT_TEXT'
    },
    fileId: {
      description: 'Id del archivo',
      required: true,
      type: 'SHORT_TEXT'
    }
  }
  let headers = fields.map((item) => item.name)
  headers = [...headers, 'Nombre']
  templateFields.value = temFields
  allHeaders.value = headers
  shownHeaders.value = allHeaders.value.slice(0, 4)
  return headers
}

const convertToObject = (files) => {
  let step1 = files.map((item) => {
    let file = {
      fileId: item.fileId,
      Nombre: item.data.name
    }
    let fields = item.data.fields.reduce((acc, item) => {
      acc[item.name] = item.value
      return acc
    }, {})
    file = {
      ...file,
      ...fields
    }
    return file
  })
  processedData.value = step1
}

onMounted(async () => {
  loading.value = true
  // simulation time
  await new Promise((resolve) => setTimeout(resolve, 500))
  let successToast = { type: 1, content: 'Toast messages implemented in record view' }
  addToast(successToast)
  // Initial data fetch
  fetchedData.value = files
  console.log(files)

  // Obtaining headers from data fetch
  getAllHeaders(files_template.templates)
  // Convert fetched data into working object
  convertToObject(files)

  loading.value = false
  return fetchedData
})

// Fucntions

const handleOpenPreview = (key) => {
  selected.value = processedData.value[key].fileId
  router.push(`123/view/${selected.value}`)
}

const handleTableSettings = () => {
  router.push('123/table-settings')
}

const handleNewRecord = () => {
  router.push('/doctor/create-file')
}

const handleOpenEdit = () => {
  router.push(`/doctor/patient/123/edit/${selected.value}`)
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
