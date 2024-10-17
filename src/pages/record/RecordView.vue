<template>
  <router-view
    :recordId="selected"
    :viewData="processedData"
    v-model:shownHeaders="shownHeaders"
    :allHeaders="allHeaders"
    :allData="fetchedData"
    @updateData="updateData"
    @openEdit="handleOpenEdit"
  />
  <div class="page">
    <h1><b>Expedientes</b></h1>
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
        :fields="templateFields"
        v-model:loading="loading"
        v-model:page-limit="pageLimit"
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
  <object :data="shortText" class="icon" />
</template>

<script setup>
import DisplayTable from '@/components/DataDisplay/Tables/DisplayTable.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import ConfigButton from '@/components/Buttons/ConfigButton.vue'
import FilterTable from '@/components/DataDisplay/Tables/Filter/FilterTable.vue'
import records from './records.json'
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

const handleOpenEdit = () => {
  router.push(`/record/main/edit/${selected.value}`)
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
const getHeaders = (json) => {
  let fieldArray = Object.entries(json)
  let headers = []
  let tem = {}
  for (let key in fieldArray) {
    let record = fieldArray[key][1].fields
    for (let field in record) {
      if (!headers.includes(record[field].name)) {
        headers.push(record[field].name)
        tem = { type: record[field].type }
        if (record[field].type === 'choice') {
          tem['options'] = record[field].options
        }
        templateFields.value[record[field].name] = tem
      }
      tem = {}
    }
  }
  return headers
}

const convertToObject = (json) => {
  let fieldArray = Object.entries(json)
  let object = []
  let temElement = {}
  for (let key in fieldArray) {
    let record = fieldArray[key][1].fields
    for (let field in record) {
      temElement[record[field].name] = record[field].value
    }
    object.push(temElement)
    temElement = {}
  }
  return object
}
onMounted(async () => {
  loading.value = true
  // simulation time
  await new Promise((resolve) => setTimeout(resolve, 500))
  let successToast = { type: 1, content: 'Toast messages implemented in record view' }
  addToast(successToast)
  // Initial data fetch
  fetchedData.value = records
  // Obtaining headers from data fetch
  allHeaders.value = getHeaders(records)
  shownHeaders.value = allHeaders.value.slice(0, 4)
  // Convert fetched data into working object
  processedData.value = convertToObject(records)
  loading.value = false
  console.log(templateFields.value)
  return fetchedData
})

// Fucntions

const handleOpenPreview = (key) => {
  selected.value = processedData.value[key]['Record ID']
  router.push(`/record/main/view/${selected.value}`)
}

const handleTableSettings = () => {
  router.push('/record/main/table-settings')
}

const handleNewRecord = () => {
  router.push('/record/create')
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

.icon {
  height: 1rem;
  width: 1rem;
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
