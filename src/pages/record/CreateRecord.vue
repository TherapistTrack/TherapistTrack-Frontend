<template>
  <div class="create-record">
    <h1><b>Nuevo Expediente</b></h1>
    <DataLoader v-if="loading" />
    <span v-else>
      <div class="actions">
        <SelectDropDown
          :id="'escoger-plantilla'"
          :label="'Plantilla'"
          :disabledValue="'Seleccione una plantilla'"
          :options="templateOptions"
          v-model:modelValue="selectedTemplate"
        />
        <div v-for="(key, item) in Object.keys(templateData)" :key="key">
          <span v-if="templateData[key].type == 'CHOICE'">
            <SelectDropDown
              :id="'key'"
              :label="key"
              :disabledValue="'Seleccione una opción'"
              :options="templateData[key].options"
              v-model:modelValue="localInfo[item].value"
              :show-type-icon="true"
              :required="templateData[key].required"
              :description="templateData[key].description"
            />
          </span>
          <span v-else>
            <InputField
              :id="key"
              :label="key"
              :type="templateData[key].type"
              v-model:modelValue="localInfo[item].value"
              :required="templateData[key].required"
              :description="templateData[key].description"
            />
          </span>
        </div>
      </div>
      <div class="button-space">
        <div class="error-msg" v-if="!dataIsValid">
          <p v-for="(message, key) in errors" :key="key">
            {{ message }}
          </p>
        </div>
        <ButtonSimple :msg="'Crear'" :disabled="!dataIsValid" :onClick="createRecord" />
      </div>
    </span>
  </div>
</template>

<script setup>
import InputField from '@/components/Forms/InputField/InputField.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import DataLoader from '@/components/Feedback/Spinner/DataLoader.vue'
import { ref, onMounted, watch, toRaw, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useRouter } from 'vue-router'
import { useApi } from '@/oauth/useApi'
import { useAuth0 } from '@auth0/auth0-vue'
import { recordSchema } from '@/schemas/recordSchema'

// Constants
const { getRequest, postRequest } = useApi()
const { getTemplateSchema } = recordSchema()
const auth0 = useAuth0()
const router = useRouter()
const templateOptions = ref({})
const loading = ref(false)
const doctorId = ref(null)

const templateInfo = ref(null)
const selectedTemplate = ref(null)
const templateData = ref({})
const localInfo = ref({})

const dataIsValid = ref(false)
const errors = ref([])
const changesSaved = ref(false)

// Emits
const emit = defineEmits(['addToast'])
const addToast = (toast) => {
  emit('addToast', toast)
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

const handleBeforeUnload = (event) => {
  if (!changesSaved.value) {
    event.preventDefault()
    event.returnValue = ''
  }
}

onBeforeRouteLeave((to, from, next) => {
  if (!changesSaved.value) {
    const confirmLeave = window.confirm('Tus cambios no serán guardados ¿Deseas continuar?')
    if (confirmLeave) {
      next()
    } else {
      next(false)
    }
  } else {
    next() // No unsaved changes
  }
})

// Watching required values
watch(
  localInfo,
  () => {
    verifyData()
  },
  { deep: true }
)

watch(selectedTemplate, () => {
  getTemplateData()
})

const getTemplateData = async () => {
  loading.value = true
  let templateId = templateInfo.value.filter((item) => item.name == selectedTemplate.value)[0].id
  try {
    const response = await getRequest(
      `/doctor/PatientTemplate?doctorId=${doctorId.value}&templateId=${templateId}`
    )
    templateData.value = response.data.fields.reduce((arr, item) => {
      arr[item.name] = {
        type: item.type,
        required: item.required,
        options: item.options,
        description: item.description
      }
      return arr
    }, {})
    templateData.value = {
      Nombres: {
        required: true,
        type: 'SHORT_TEXT',
        options: [],
        description: 'Apellidos del paciente'
      },
      Apellidos: {
        required: true,
        type: 'SHORT_TEXT',
        options: [],
        description: 'Apellidos del paciente'
      },
      ...templateData.value
    }
  } catch {
    addToast({ type: 0, content: 'Hubo un error obteniendo las plantillas' })
    // Error message
  }
  resetLocalInfo()
  loading.value = false
}

// On Mounted
onMounted(async () => {
  loading.value = true
  await get_doctor_id()
  try {
    const response = await getRequest(`/doctor/PatientTemplate/list?doctorId=${doctorId.value}`)
    templateInfo.value = response.templates.map((item) => ({
      name: item.name,
      id: item.templateId
    }))
    templateOptions.value = response.templates.map((item) => item.name)
    selectedTemplate.value = templateOptions.value[0]
    await getTemplateData()
  } catch {
    //Connection error message
  }
  loading.value = false
})

const verifyData = () => {
  let recordData = localInfo.value.reduce((arr, item) => {
    arr[item.name] = item.value
    return arr
  }, {})

  const validate = getTemplateSchema(templateData.value)
  validate
    .validate(recordData)
    .then(() => (dataIsValid.value = true))
    .catch((err) => {
      dataIsValid.value = false
      errors.value = err.errors
    })
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

const resetLocalInfo = () => {
  localInfo.value = Object.keys(templateData.value).map((item) => ({
    name: item,
    type: templateData.value[item].type,
    required: templateData.value[item].required,
    value: ''
  }))
}

const format_record = () => {
  let templateId = toRaw(templateInfo.value).filter(
    (item) => item.name == selectedTemplate.value
  )[0].id
  let names = ''
  let lastnames = ''
  let fields = []
  toRaw(localInfo.value).forEach((item) => {
    if (item.name == 'Nombres') {
      names = item.value
    } else if (item.name == 'Apellidos') {
      lastnames = item.value
    } else {
      let tem_field = { name: item.name }
      if (item.type == 'NUMBER' || item.type == 'FLOAT') {
        tem_field['value'] = Number(item.value)
      } else {
        tem_field['value'] = item.value
      }
      fields.push(tem_field)
    }
  })
  let body = {
    doctorId: doctorId.value,
    templateId: templateId,
    patient: {
      names: names,
      lastnames: lastnames,
      fields: fields
    }
  }
  return body
}

const createRecord = async () => {
  changesSaved.value = true
  loading.value = true
  let body = format_record()
  try {
    const response = await postRequest('/records/', body)
    if (response.status == 200) {
      addToast({ content: 'Expediente creado exitosamente', type: 1 })
    } else {
      addToast({ content: 'Ocurrio un error obteniendo creando expediente', type: 0 })
    }
  } catch {
    addToast({ content: 'Ocurrio un error obteniendo  creando expediente', type: 0 })
  }
  loading.value = false
  router.push('/doctor/records')
}
</script>

<style>
.error-msg * {
  color: var(--red-1);
  font-weight: bold;
}

.create-record {
  padding: 2rem;
  width: 100vw;
}

.create-record .button-space {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
}

.create-record .button-space button {
  align-self: end;
}
.button-space {
  align-self: end;
}

.create-record .actions {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  margin-right: 5rem;
  height: 65vh;
  overflow-y: scroll;
}
</style>
