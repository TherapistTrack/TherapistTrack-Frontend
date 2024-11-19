<template>
  <div v-if="ready" class="overlayContainer" @click="handleLeave" :id="start ? 'init' : 'end'">
    <div class="view-record" @click.stop="" :id="start ? 'init' : 'end'">
      <div class="top">
        <h1>
          <b>{{ names[0] }} {{ names[1] }}</b>
        </h1>
        <RiCloseLine
          class-name="icon"
          size="2rem"
          color="var(--gray-2)"
          alt="close"
          @click="handleLeave"
        />
      </div>
      <div class="mid">
        <span v-for="header in recordHeaders" :key="header">
          <span v-if="fieldInfo[header].type == 'CHOICE'">
            <span v-if="fieldInfo[header].required">
              <SelectDropDownRequired
                :id="'select-required' + header"
                :label="header"
                :disabled-value="'Escoga una opción'"
                v-model:model-value="recordData[header]"
                :options="fieldInfo[header].options"
              />
            </span>
            <span v-else>
              <SelectDropDown
                :id="'select-' + header"
                :label="header"
                :disabled-value="'Escoga una opción'"
                v-model:model-value="recordData[header]"
                :options="fieldInfo[header].options"
              />
            </span>
          </span>
          <span v-else>
            <span v-if="fieldInfo[header].required">
              <InputFieldRequired
                :id="'input-required' + header"
                :label="header"
                v-model:model-value="recordData[header]"
                :type="fieldInfo[header].type"
              />
            </span>
            <span v-else>
              <InputField
                :id="'input' + header"
                :label="header"
                v-model:model-value="recordData[header]"
                :type="fieldInfo[header].type"
              />
            </span>
          </span>
        </span>
      </div>
      <div class="bottom">
        <span v-if="!dataIsValid">
          <p v-for="(err, key) in errors" :key="key">
            {{ err }}
          </p>
        </span>
        <ButtonSimple
          :msg="'Guardar'"
          :color="'yellow'"
          :on-click="handleSave"
          :disabled="!dataIsValid"
        />
      </div>
    </div>
  </div>
  <AlertOptionSimple
    v-if="leaveTry"
    msg="Si regresas, tus cambios no serán guardados ¿Deseas continuar?"
    :on-no="
      () => {
        leaveTry = false
      }
    "
    :on-yes="goBack"
  />
</template>

<script setup>
import { RiCloseLine } from '@remixicon/vue'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import InputField from '@/components/Forms/InputField/InputField.vue'
import InputFieldRequired from '@/components/Forms/InputField/InputFieldRequired.vue'
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import SelectDropDownRequired from '@/components/Forms/SelectDropDown/SelectDropDownRequired.vue'
import { useApi } from '@/oauth/useApi'
import { recordSchema } from '@/schemas/recordSchema'
import AlertOptionSimple from '@/components/Feedback/Alerts/AlertOptionSimple.vue'

const emit = defineEmits(['addToast', 'updateData'])
const props = defineProps({
  recordId: String,
  doctorId: String
})

const { getTemplateSchema } = recordSchema()
const { getRequest, putRequest } = useApi()
const start = ref(false)
const router = useRouter()
const ready = ref(false)
const recordHeaders = ref([])
const fieldInfo = ref({})
const recordData = ref({})
const dataIsValid = ref(true)
const errors = ref([])

const initialData = ref(null)
const names = ref([])

const leaveTry = ref(false)

watch(
  recordData,
  () => {
    if (ready.value) {
      verifyData()
    }
  },
  { deep: true }
)

const verifyData = () => {
  const validation = getTemplateSchema(fieldInfo.value)
  validation
    .validate(recordData.value)
    .then(() => (dataIsValid.value = true))
    .catch((err) => {
      dataIsValid.value = false
      errors.value = err.errors
    })
}

onMounted(async () => {
  let raw_fields = await getRecord()
  formatRawFields(raw_fields)
  fieldInfo.value = getHeaders(raw_fields)
  recordHeaders.value = Object.keys(fieldInfo.value)
  initialData.value = JSON.parse(JSON.stringify(recordData.value))
  ready.value = true
  setTimeout(() => {
    start.value = true
  }, 2)
})

const handleLeave = () => {
  let hasChanged = checkChange()
  if (hasChanged) {
    leaveTry.value = true
  } else {
    goBack()
  }
}

const goBack = () => {
  start.value = false
  emit('updateData')
  setTimeout(() => {
    router.back()
    router.back()
  }, 250)
}

const getRecord = async () => {
  let url = `/records/?doctorId=${props.doctorId}&recordId=${props.recordId}`
  let fields = {}
  try {
    const response = await getRequest(url, {})
    let init_data = {
      Nombre: response.patient.names,
      Apellidos: response.patient.lastNames
    }
    if (!ready.value) {
      names.value = [response.patient.names, response.patient.lastNames]
    }
    recordData.value = { ...init_data }
    fields = response.patient.fields
  } catch {
    emit('addToast', { type: 0, content: 'Ocurrio un error obteniendo el expediente' })
  }
  return fields
}

const formatRawFields = (raw_fields) => {
  raw_fields.forEach((field) => {
    if (field.type == 'DATE') {
      recordData.value = { ...recordData.value, [field.name]: field.value.split('T')[0] }
    } else {
      recordData.value = { ...recordData.value, [field.name]: field.value }
    }
  })
}

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

const handleSave = async () => {
  let hasChanged = checkChange()
  if (hasChanged) {
    let body = {
      recordId: props.recordId,
      doctorId: props.doctorId,
      patient: {
        names: recordData.value['Nombres'],
        lastNames: recordData.value['Apellidos'],
        fields: []
      }
    }
    let headers = Object.keys(recordData.value).filter(
      (item) => item !== 'Nombres' && item !== 'Apellidos'
    )
    headers.forEach((item) => {
      body.patient.fields.push({
        name: item,
        value: recordData.value[item]
      })
    })
    try {
      const response = await putRequest('/records/', body)
      if (response.status == 200) {
        emit('addToast', { type: 1, content: 'Expediente guardado exitosamente' })
      } else {
        emit('addToast', { type: 0, content: 'Ocurrio un error guardando el expediente' })
      }
    } catch {
      emit('addToast', { type: 0, content: 'Ocurrio un error guardando el expediente' })
    }
    goBack()
  }
}

const checkChange = () => {
  let init = JSON.stringify(initialData.value)
  let curr = JSON.stringify(recordData.value)
  if (init == curr) {
    return false
  } else {
    return true
  }
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
  padding-bottom: 1rem;
}
.view-record .mid {
  padding: 1rem;
  height: 360px;
  overflow-y: auto;
}

.view-record .bottom {
  border-top: 1px solid var(--gray-3);
  padding-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: end;
  flex-direction: column;
}

.view-record .bottom p {
  font-size: small;
  color: var(--red-1);
  margin-bottom: 1rem;
}

@media (max-aspect-ratio: 1/1) {
  .view-record {
    width: 300px;
  }
}
</style>
