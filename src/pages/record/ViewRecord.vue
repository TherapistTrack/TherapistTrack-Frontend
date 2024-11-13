<template>
  <div v-if="ready" class="overlayContainer" @click="goBack()" :id="start ? 'init' : 'end'">
    <div class="view-record" @click.stop="" :id="start ? 'init' : 'end'">
      <div class="top">
        <h1>
          <b>{{ recordData['Nombre'] }}<br />{{ recordData['Apellidos'] }}</b>
        </h1>
        <RiCloseLine
          class-name="icon"
          size="2rem"
          color="var(--gray-2)"
          alt="close"
          @click="goBack()"
        />
      </div>
      <div class="actions">
        <RiEditBoxLine
          class-name="act-edit"
          size="1.5rem"
          color="var(--gray-1)"
          alt="edit"
          @click="handleOpenEdit()"
        />
        <RiDeleteBin7Fill
          class-name="act-delete"
          size="1.5rem"
          color="var(--gray-1)"
          alt="delete"
          @click="handleDelete(props.userId)"
        />
      </div>
      <div class="mid">
        <SimpleTable
          :data="recordData"
          :headers="recordHeaders"
          :isSet="true"
          :has-type="true"
          :fields="fieldInfo"
        />
      </div>

      <div class="bottom">
        <ButtonSimple :msg="'Abrir'" />
      </div>
    </div>
  </div>

  <AlertDelete
    v-if="tryDelete"
    :name="`${recordData['Nombre']} ${recordData['Apellidos']}`"
    :on-no="abortDelete"
    :on-yes="onDelete"
    :type="'record'"
  />
</template>

<script setup>
import { RiCloseLine, RiEditBoxLine, RiDeleteBin7Fill } from '@remixicon/vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SimpleTable from '@/components/DataDisplay/Tables/SimpleTable.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import AlertDelete from '@/components/Feedback/Alerts/AlertDelete.vue'
import { useApi } from '@/oauth/useApi'

const { getRequest, deleteRequest } = useApi()
const templateId = ref(null)
const createdAt = ref(null)
const ready = ref(false)
const start = ref(false)
const router = useRouter()
const recordHeaders = ref([])
const fieldInfo = ref({})

const tryDelete = ref(false)
const props = defineProps({
  doctorId: String,
  recordId: String
})

const recordData = ref({})

const emit = defineEmits(['updateData', 'openEdit', 'addToast'])

onMounted(async () => {
  let raw_fields = await getRecord()
  let format_fields = formatRawFields(raw_fields)
  recordData.value = { ...recordData.value, ...format_fields }
  fieldInfo.value = getHeaders(raw_fields)
  recordHeaders.value = Object.keys(fieldInfo.value)
  ready.value = true
  setTimeout(() => {
    start.value = true
  }, 2)
})

const getHeaders = (raw_fields) => {
  let headers = raw_fields.reduce((arr, item) => {
    arr[item.name] = {
      type: item.type,
      required: item.required,
      options: item.options
    }
    return arr
  }, {})
  let complete_headers = {
    Nombre: {
      type: 'SHORT_TEXT',
      required: true,
      options: []
    },
    Apellidos: {
      type: 'SHORT_TEXT',
      required: true,
      options: []
    },
    ...headers
  }
  return complete_headers
}
const getRecord = async () => {
  let url = `/records/?doctorId=${props.doctorId}&recordId=${props.recordId}`
  let fields = {}
  try {
    const response = await getRequest(url, {})
    templateId.value = response.tempalteId
    createdAt.value = response.createdAt
    recordData.value['Nombre'] = response.patient.names
    recordData.value['Apellidos'] = response.patient.lastNames
    fields = response.patient.fields
  } catch {
    emit('addToast', { type: 0, content: 'Ocurrio un error obteniendo el expediente' })
  }
  return fields
}

const formatRawFields = (raw_fields) => {
  let format_fields = raw_fields.reduce((arr, item) => {
    arr[item.name] = item.value
    return arr
  }, {})
  return format_fields
}

const goBack = () => {
  start.value = false
  setTimeout(() => {
    emit('updateData')
    router.push('/doctor/records')
  }, 250) // You can adjust the delay if needed
}

const handleDelete = () => {
  tryDelete.value = true
}

const abortDelete = () => {
  tryDelete.value = false
}

const onDelete = async () => {
  let body = {
    doctorId: props.doctorId,
    recordId: props.recordId
  }
  try {
    const response = await deleteRequest('/records/', body)
    if (response.status == 200) {
      emit('addToast', { type: 1, content: 'Expediente fue borrado exitosamente' })
    } else {
      emit('addToast', { type: 0, content: 'Ocurrio un error eliminando el expediente' })
    }
  } catch {
    emit('addToast', { type: 0, content: 'Ocurrio un error eliminando el expediente' })
  }
  tryDelete.value = false
  goBack()
}

const handleOpenEdit = () => {
  start.value = false
  setTimeout(() => {
    emit('openEdit')
  }, 250) // You can adjust the delay if needed
}
</script>

<style>
.overlayContainer {
  height: 100%;
  width: 100%;
  z-index: 300;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: end;
  align-items: center;
  transition: background-color 0.3s;
}

.overlayContainer#init {
  background-color: rgba(0, 0, 0, 0.4);
}
.overlayContainer#end {
  background-color: none;
}
.view-record {
  position: absolute;
  right: -400px;
  z-index: 400;
  background-color: white;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 2vh 0 0 2vh;
  width: 400px;
  height: 100vh;
  padding: 2rem;
  transition: right 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.view-record#init {
  right: 0;
}
.view-record#end {
  right: -400px;
}

.view-record .icon,
.view-record .act-edit,
.view-record .act-delete {
  cursor: pointer;
  max-height: 5vh;
  transition: fill 0.1s;
}

.act-edit:hover {
  fill: var(--yellow-1);
}
.act-delete:hover {
  fill: var(--red-1);
}

.view-record .top {
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.3rem;
}
.view-record .actions {
  display: flex;
  gap: 1.5rem;
  padding-bottom: 1rem;
}
.view-record .mid {
  padding: 1rem;
  height: 385px;
  overflow-y: auto;
}
.view-record .mid * {
  font-size: 0.8rem;
}

.view-record .bottom {
  border-top: 1px solid var(--gray-3);
  padding-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: end;
}

@media (max-aspect-ratio: 1/1) {
  .view-record {
    width: 280px;
  }
  .view-record .mid {
    height: 65vh;
  }
}
</style>
