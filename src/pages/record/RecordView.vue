<template>
  <router-view
    :doctorId="doctorId"
    :recordId="selected"
    :viewData="processedData"
    :fields="fieldInfo"
    v-model:shownHeaders="shownHeaders"
    :allHeaders="allHeaders"
    :allData="fetchedData"
    @updateData="fetching_pipeline"
    @openEdit="handleOpenEdit"
    @addToast="addToast"
    @openRecord="handleOpenRecord"
  />
  <div class="page">
    <h1><b>Expedientes</b></h1>
    <div class="actions">
      <FilterTable
        @updateSorts="updateSorts"
        @updateFilters="updateFilters"
        :fields="filterFields"
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
        :fields="fieldInfo"
        v-model:loading="loading"
        v-model:page-limit="pageLimit"
        v-model:current-page="currentPage"
        :recordCount="recordCount"
        :onClick="handleOpenPreview"
        @hideHeader="onHideField"
        :success="true"
        @updatePage="updatePage"
      />
      <ConfigButton :onClick="handleTableSettings" />
    </div>
  </div>
</template>

<script setup>
import DisplayTable from '@/components/DataDisplay/Tables/DisplayTable.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import { ref, onMounted, watch, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import ConfigButton from '@/components/Buttons/ConfigButton.vue'
import FilterTable from '@/components/DataDisplay/Tables/Filter/FilterTable.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useApi } from '@/oauth/useApi'
import { useTabStore } from '@/stores/tabStore'

// Constants
// Api calls
const tabManager = useTabStore()
const { getRequest, postRequest } = useApi()
// Navigation and user info
const auth0 = useAuth0()
const doctorId = ref(null)
const router = useRouter()
const selected = ref(0)
const loading = ref(true)
// Data storage
const fetchedData = ref({})
const processedData = ref({})
const shownHeaders = ref([])
const allHeaders = ref([])
const localSorts = ref([])
const fieldInfo = ref({})
// Page navigation
const recordCount = ref(0)
const currentPage = ref(1)
const pageLimit = ref(6)
const filterFields = ref(null)
const isFirst = ref(true)

// TOAST EMITS
//-------------------------------------------
const emit = defineEmits(['addToast'])
const addToast = (toast) => {
  emit('addToast', toast)
}
//-------------------------------------------

// refining Data, (sort and filters)
const updateSorts = async (sorts) => {
  let format_sort = []
  sorts.forEach((item) => {
    let tem_sort = {
      name: item.name,
      type: item.type,
      mode: 'desc'
    }
    if (item.mode == 'Ascendiente') {
      tem_sort.mode = 'asc'
    }
    format_sort.push(tem_sort)
  })
  localSorts.value = format_sort
  await fetching_pipeline()
}

const updateFilters = async (filters) => {
  console.log('TODO: ', filters)
  // localFitlers.value = filters
  // fetching_pipeline()
}

// Display table
const updatePage = async (pager) => {
  pageLimit.value = Number(pager[0])
  currentPage.value = Number(pager[1])
  await fetching_pipeline()
}
const onHideField = (header) => {
  shownHeaders.value.splice(shownHeaders.value.indexOf(header), 1)
}

// OnMounted and Watch
onMounted(async () => {
  loading.value = true
  await get_doctor_id()
  await get_headers()
  isFirst.value = false
  await fetching_pipeline()
})

watch(
  shownHeaders,
  () => {
    if (!isFirst.value) {
      fetching_pipeline()
    }
  },
  { deep: true }
)

// Fectching and formatting data
const fetching_pipeline = async () => {
  loading.value = true
  await get_records_raw()
  format_records()
  loading.value = false
}

const get_doctor_id = async () => {
  let userId = auth0.user.value.sub.split('|')[1]
  try {
    const response = await postRequest('/users/@me', { id: userId })
    doctorId.value = response.data.roleDependentInfo.id
  } catch {
    addToast({ content: 'Ocurrio un error obteniendo información del doctor', type: 0 })
  }
}

const format_records = () => {
  let raw_data = toRaw(fetchedData.value)
  let fields = toRaw(shownHeaders.value)
  let formatted_data = []

  raw_data.forEach((patient) => {
    let format_patient = {
      recordId: patient.recordId,
      createdAt: patient.createdAt,
      templateId: patient.templateId,
      Nombre: patient.patient.names,
      Apellidos: patient.patient.lastNames
    }
    let found_fields = patient.patient.fields.filter((item) => fields.includes(item.name))
    found_fields.forEach((field) => {
      let tem = {
        [field.name]: field.value
      }
      if (fieldInfo.value[field.name].type == 'DATE') {
        tem = {
          [field.name]: field.value.split('T')[0]
        }
      }
      format_patient = {
        ...format_patient,
        ...tem
      }
    })
    formatted_data.push(format_patient)
  })
  processedData.value = formatted_data
}

const get_records_raw = async () => {
  let fields = shownHeaders.value.filter((item) => item != 'Nombre' && item != 'Apellidos')
  let body = {
    doctorId: doctorId.value,
    limit: pageLimit.value,
    page: currentPage.value,
    fields: [],
    sorts: [],
    filters: []
  }
  if (localSorts.value.length !== 0) {
    body['sorts'] = localSorts.value
  }
  fields.forEach((item) => {
    let field = {
      name: item,
      type: fieldInfo.value[item].type
    }
    body.fields.push(field)
  })
  try {
    const response = await postRequest('/records/search', body)
    fetchedData.value = response.records
    recordCount.value = response.total
  } catch {
    addToast({ content: 'Ocurrio un error obteniendo los registros', type: 0 })
  }
}

const get_headers = async () => {
  try {
    const response = await getRequest(`/records/search?doctorId=${doctorId.value}`, {})
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
      },
      Apellidos: {
        type: 'SHORT_TEXT'
      }
    }
    fieldInfo.value = {
      ...ext,
      ...fdata
    }
    filterFields.value = {
      ...fdata
    }
    let fields = Object.keys(fdata)
    allHeaders.value = [...fields, 'Nombre', 'Apellidos']
    shownHeaders.value = ['Nombre', 'Apellidos', ...fields.slice(0, 2)]
  } catch {
    addToast({ content: 'Ocurrio un error obteniendo los registros', type: 0 })
  }
}

// Navigation

const handleOpenPreview = (key) => {
  selected.value = processedData.value[key].recordId
  router.push(`/doctor/records/view/${selected.value}`)
}

const handleTableSettings = () => {
  router.push('/doctor/records/table-settings')
}

const handleNewRecord = () => {
  router.push('create-record')
}

const handleOpenEdit = () => {
  router.push(`/doctor/records/edit/${selected.value}`)
}

const handleOpenRecord = (name) => {
  let metadata = {
    patientName: name,
    doctorId: doctorId.value,
    recordId: selected.value
  }
  tabManager.changeTab(name, `/doctor/patient/${selected.value}`, metadata)
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
  height: 5rem;
  width: 5rem;
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
