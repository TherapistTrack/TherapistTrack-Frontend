<template>
  <div v-if="ready" class="overlayContainer" @click="goBack()" :id="start ? 'init' : 'end'">
    <div class="view-record" @click.stop="" :id="start ? 'init' : 'end'">
      <div class="top">
        <h1>
          <b>{{ fileName }}</b>
        </h1>
        <RiCloseLine
          class-name="icon"
          size="2rem"
          color="var(--gray-2)"
          alt="close"
          @click="goBack()"
        />
      </div>
      <div class="mid">
        <span v-for="header in fileHeaders" :key="header">
          <span v-if="fieldInfo[header].type == 'CHOICE'">
            <span v-if="fieldInfo[header].required">
              <SelectDropDownRequired
                :label="header"
                :disabled-value="'Escoga una opción'"
                v-model:model-value="fileData[header]"
                :options="fieldInfo[header].options"
              />
            </span>
            <span v-else>
              <SelectDropDown
                :label="header"
                :disabled-value="'Escoga una opción'"
                v-model:model-value="fileData[header]"
                :options="fieldInfo[header].options"
              />
            </span>
          </span>
          <span v-else>
            <span v-if="fieldInfo[header].required">
              <InputFieldRequired
                :label="header"
                v-model:model-value="fileData[header]"
                :type="fieldInfo[header].type"
              />
            </span>
            <span v-else>
              <InputField
                :label="header"
                v-model:model-value="fileData[header]"
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
          :disabled="!dataIsValid"
          :msg="'Guardar'"
          :color="'yellow'"
          :onClick="updateFile"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { RiCloseLine } from '@remixicon/vue'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import InputField from '@/components/Forms/InputField/InputField.vue'
import InputFieldRequired from '@/components/Forms/InputField/InputFieldRequired.vue'
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import { recordSchema } from '@/schemas/recordSchema'
import SelectDropDownRequired from '@/components/Forms/SelectDropDown/SelectDropDownRequired.vue'
import { useApi } from '@/oauth/useApi'
import { useAuth0 } from '@auth0/auth0-vue'
const emit = defineEmits(['addToast', 'updateData'])

const { getTemplateSchema } = recordSchema()
const { postRequest, getRequest, putRequest } = useApi()
const start = ref(false)
const router = useRouter()

const props = defineProps({
  fileId: String
})
const ready = ref(false)

const fileData = ref({})
const fileHeaders = ref([])
const fieldInfo = ref({})
const fileName = ref('')
const doctorId = ref('')
const auth0 = useAuth0()
const dataIsValid = ref(true)
const errors = ref([])

watch(
  fileData,
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
    .validate(fileData.value)
    .then(() => (dataIsValid.value = true))
    .catch((err) => {
      dataIsValid.value = false
      errors.value = err.errors
    })
}

onMounted(async () => {
  doctorId.value = await getDoctorId()
  let raw_data = await getFilesRaw()
  let ffiles = formatData(raw_data)

  fileData.value = {
    ...fileData.value,
    ...ffiles
  }
  fieldInfo.value = getHeaders(raw_data)
  fileHeaders.value = Object.keys(fieldInfo.value)
  ready.value = true
  setTimeout(() => {
    start.value = true
  }, 2) // You can adjust the delay if needed
})

const getHeaders = (raw_data) => {
  let headers = raw_data.reduce((arr, item) => {
    arr[item.name] = {
      type: item.type,
      required: item.required,
      options: item.options
    }
    return arr
  }, {})
  return headers
}

const formatData = (raw_data) => {
  let ffiles = raw_data.reduce((arr, item) => {
    arr[item.name] = item.value
    return arr
  }, {})
  return ffiles
}

const getDoctorId = async () => {
  let userId = auth0.user.value.sub.split('|')[1]
  let doctorId = ''
  try {
    const response = await postRequest('/users/@me', { id: userId })
    doctorId = response.data.roleDependentInfo.id
  } catch {
    emit('addToast', { type: 0, content: 'Hubo un error' })
  }
  return doctorId
}

const getFilesRaw = async () => {
  let url = `/files?doctorId=${doctorId.value}&fileId=${props.fileId}`
  const raw_data = ref([])
  try {
    const response = await getRequest(url, {})
    const raw_fields = response.fields
    raw_data.value = raw_fields
    fileData.value['Nombre'] = response.name
    fileName.value = response.name
    fileData.value.recordId = response.recordId
    fileData.value.category = response.category
    fileData.value.createdAt = response.createdAt.split('T')[0]
  } catch {
    emit('addToast', { type: 0, content: 'Hubo un error' })
  }

  return raw_data.value
}

const updateFile = async () => {
  let body = {
    doctorId: doctorId.value,
    fileId: props.fileId,
    name: fileName.value,
    category: fileData.value.category,
    fields: []
  }
  fileHeaders.value.forEach((item) => {
    let field = {
      name: item,
      value: fileData.value[item]
    }
    if (fieldInfo.value[item].type == 'NUMBER' || fieldInfo.value[item].type == 'FLOAT') {
      field = {
        name: item,
        value: Number(fileData.value[item])
      }
    }
    body.fields.push(field)
  })
  try {
    const response = await putRequest('/files', body)
    console.log(response)
    if (response.status == 200) {
      emit('addToast', { type: 1, content: 'Archivo actualizado exitosamente' })
    }
  } catch {
    emit('addToast', { type: 0, content: 'Hubo un error' })
  }
  emit('updateData')
  goBack()
}

const goBack = () => {
  start.value = false
  setTimeout(() => {
    router.back()
    router.back()
  }, 250)
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
    width: 280px;
  }
  .view-record .mid {
    height: 65vh;
  }
}
</style>
