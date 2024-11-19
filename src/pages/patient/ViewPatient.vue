<template>
  <div v-if="ready" class="overlayContainer" @click="goBack()" :id="start ? 'init' : 'end'">
    <div class="view-record" @click.stop="" :id="start ? 'init' : 'end'">
      <div class="top">
        <h1>
          <b>{{ fileData['Nombre'] }}</b>
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
          @click="handleDelete()"
        />
      </div>
      <div class="mid">
        <SimpleTable
          :data="fileData"
          :headers="fileHeaders"
          :isSet="true"
          :has-type="true"
          :fields="fieldInfo"
        />
      </div>

      <div class="bottom">
        <ButtonSimple :msg="'Abrir'" :onClick="openFile" />
      </div>
    </div>
  </div>

  <AlertDelete
    v-if="tryDelete"
    :name="`${fileData['Nombre']}`"
    :on-no="abortDelete"
    :on-yes="onDelete"
    :type="'file'"
  />
</template>

<script setup>
import { RiCloseLine, RiEditBoxLine, RiDeleteBin7Fill } from '@remixicon/vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SimpleTable from '@/components/DataDisplay/Tables/SimpleTable.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import AlertDelete from '@/components/Feedback/Alerts/AlertDelete.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useApi } from '@/oauth/useApi'

const { getRequest, postRequest, deleteRequest } = useApi()
const auth0 = useAuth0()
const ready = ref(false)
const start = ref(false)
const router = useRouter()

const fileData = ref({})
const fileHeaders = ref([])
const fieldInfo = ref({})

const doctorId = ref('')
const tryDelete = ref(false)
const props = defineProps({
  fileId: String
})

const emit = defineEmits(['updateData', 'openEdit', 'addToast', 'openFile'])

const openFile = () => {
  emit('openFile')
}
onMounted(async () => {
  doctorId.value = await getDoctorId()
  let raw_data = await getFiles()
  fieldInfo.value = getHeaders(raw_data)
  fileHeaders.value = Object.keys(fieldInfo.value)

  let format_files = formatFiles(raw_data)
  fileData.value = {
    ...fileData.value,
    ...format_files
  }
  ready.value = true
  setTimeout(() => {
    start.value = true
  }, 2)
})

const formatFiles = (raw_data) => {
  let ffiles = raw_data.reduce((arr, item) => {
    arr[item.name] = item.value
    return arr
  }, {})
  return ffiles
}

const getHeaders = (raw_data) => {
  let headers = raw_data.reduce((arr, item) => {
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
    ...headers
  }
  return complete_headers
}

const getFiles = async () => {
  let url = `/files?doctorId=${doctorId.value}&fileId=${props.fileId}`
  let fields = {}
  try {
    const response = await getRequest(url, {})
    fileData.value['Nombre'] = response.name
    fileData.value.recordId = response.recordId
    fileData.value.cagegory = response.category
    fields = response.fields
  } catch {
    addToast({ type: 0, content: 'Hubo un error' })
  }
  return fields
}

const getDoctorId = async () => {
  let userId = auth0.user.value.sub.split('|')[1]

  let doctorId = ''
  try {
    const response = await postRequest('/users/@me', { id: userId })
    doctorId = response.data.roleDependentInfo.id
  } catch {
    addToast({ type: 0, content: 'Hubo un error' })
  }
  return doctorId
}

const addToast = (toast) => {
  emit('addToast', toast)
}
const goBack = () => {
  start.value = false
  setTimeout(() => {
    router.push(`/doctor/patient/${fileData.value.recordId}`)
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
    doctorId: doctorId.value,
    fileId: props.fileId
  }
  try {
    const response = await deleteRequest('/files', body)
    if (response.status == 200) {
      addToast({ type: 1, content: 'Eliminado exitosamente' })
    } else {
      addToast({ type: 0, content: 'Algo salio mal' })
    }
  } catch {
    addToast({ type: 0, content: 'Algo salio mal' })
  }
  emit('updateData')
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
