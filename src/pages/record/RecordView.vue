<template>
  <router-view
    :recordId="selected"
    :viewData="processedData"
    :fields="fieldInfo"
    v-model:shownHeaders="shownHeaders"
    :allHeaders="allHeaders"
    :allData="fetchedData"
    @updateData="fetching_pipeline"
    @openEdit="handleOpenEdit"
  />
  <div class="page">
    <h1><b>Expedientes</b></h1>
    <div class="actions">
      <FilterTable @updateSorts="updateSorts" @updateFilters="updateFilters" :fields="fieldInfo" />
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
import { ref, onMounted, watch, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import ConfigButton from '@/components/Buttons/ConfigButton.vue'
import FilterTable from '@/components/DataDisplay/Tables/Filter/FilterTable.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useApi } from '@/oauth/useApi'

// Constants
const { getRequest, postRequest } = useApi()
const auth0 = useAuth0()
const doctorId = ref(null)
const router = useRouter()
const fetchedData = ref({})
const processedData = ref({})
const loading = ref(true)
const selected = ref(0)
const localSorts = ref([])
const localFitlers = ref([])

const recordCount = ref(0)
const currentPage = ref(1)
const pageLimit = ref(6)

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
  localSorts.value = sorts
  fetching_pipeline()
}

const updateFilters = async (filters) => {
  localFitlers.value = filters
  fetching_pipeline()
}
// Display table navigation
const updatePage = async (page) => {
  currentPage.value = Number(page)
  await fetching_pipeline()
}

const updateLimit = async (limit) => {
  pageLimit.value = Number(limit)
  await fetching_pipeline()
}
// Emissions from children

const handleOpenEdit = () => {
  router.push(`/doctor/records/edit/${selected.value}`)
}
const fieldInfo = ref({})
const shownHeaders = ref([])
const allHeaders = ref([])

watch(
  shownHeaders,
  () => {
    if (!isFirst.value) {
      fetching_pipeline()
    }
  },
  { deep: true }
)

// Table field logic
const onHideField = (header) => {
  shownHeaders.value.splice(shownHeaders.value.indexOf(header), 1)
}

onMounted(async () => {
  loading.value = true
  await get_doctor_id()
  await get_headers()
  isFirst.value = false
  await fetching_pipeline()
})

const fetching_pipeline = async () => {
  loading.value = true
  await get_records_raw()
  await format_records()
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

// Fucntions
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
  console.log('----------------------------')
  let fields = shownHeaders.value.filter((item) => item != 'Nombre' && item != 'Apellidos')
  let body = {
    doctorId: doctorId.value,
    limit: pageLimit.value,
    page: currentPage.value,
    fields: [],
    sorts: [{}],
    filters: [{}]
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
    let fields = Object.keys(fdata)
    allHeaders.value = [...fields, 'Nombre', 'Apellidos']
    shownHeaders.value = ['Nombre', 'Apellidos', ...fields.slice(0, 2)]
  } catch {
    addToast({ content: 'Ocurrio un error obteniendo los registros', type: 0 })
  }
}

const handleOpenPreview = (key) => {
  selected.value = processedData.value[key]['Record ID']
  router.push(`/doctor/records/view/${selected.value}`)
}

const handleTableSettings = () => {
  router.push('/doctor/records/table-settings')
}

const handleNewRecord = () => {
  router.push('create-record')
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
