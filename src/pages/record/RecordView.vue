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
        v-model:loading="loading"
        :onClick="handleOpenPreview"
        @hideHeader="onHideField"
        :success="true"
      />
      <ConfigButton :onClick="handleTableSettings" />
    </div>
  </div>
</template>

<script setup>
import DisplayTable from '@/components/DataDisplay/Tables/DisplayTable.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ConfigButton from '@/components/Buttons/ConfigButton.vue'
import FilterTable from '@/components/DataDisplay/Tables/Filter/FilterTable.vue'
import records from './records.json'
import { filterAndSort } from './filterAndSort'
const refineComposable = filterAndSort()
// Constants
const router = useRouter()
const fetchedData = ref({})
const processedData = ref({})
const loading = ref(true)
const selected = ref(0)
// refining Data, (sort and filters)
const updateSorts = async (sorts) => {
  await refineComposable.updateSorts(sorts)
  refineComposable.refineData(processedData.value)
  updateData()
}

const updateFilters = async (filters) => {
  await refineComposable.updateFilters(filters)
  refineComposable.refineData(processedData.value)
  updateData()
}

// Emissions from children
const updateData = () => {
  // Make get request again
}

const handleOpenEdit = () => {
  router.push(`/record/main/edit/${selected.value}`)
}
const templateFields = ref([])
const shownHeaders = ref([])
const allHeaders = ref([])

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
        tem = { name: record[field].name, type: record[field].type }
        templateFields.value.push(tem)
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
  // Initial data fetch
  fetchedData.value = records
  // Obtaining headers from data fetch
  allHeaders.value = getHeaders(records)
  shownHeaders.value = allHeaders.value.slice(0, 4)
  // Convert fetched data into working object
  processedData.value = convertToObject(records)
  loading.value = false

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
  .sideSpace#max {
    width: 0vw;
  }
}
</style>
