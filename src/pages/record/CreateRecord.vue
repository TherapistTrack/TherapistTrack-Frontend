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
        <div v-for="(key, item) in templateData" :key="key">
          <span v-if="key.type == 'CHOICE'">
            <span v-if="key.required">
              <SelectDropDownRequired
                :id="'key'"
                :label="key.name"
                :disabledValue="'Seleccione una opción'"
                :options="key.options"
                v-model:modelValue="localInfo[item].value"
                :description="key.description"
              />
            </span>
            <span v-else>
              <SelectDropDown
                :id="'key'"
                :label="key.name"
                :disabledValue="'Seleccione una opción'"
                :options="key.options"
                v-model:modelValue="localInfo[item].value"
              />
            </span>
          </span>
          <span v-else>
            <span v-if="key.required">
              <InputFieldRequired
                :id="'required-field'"
                :label="key.name"
                :type="key.type"
                :description="key.description"
                v-model:modelValue="localInfo[item].value"
              />
            </span>
            <span v-else>
              <InputField
                :id="'normal-field'"
                :label="key.name"
                :type="key.type"
                v-model:modelValue="localInfo[item].value"
              />
            </span>
          </span>
        </div>
      </div>
      <div class="button-space">
        <ButtonSimple :msg="'Crear'" :disabled="!valid" :onClick="createRecord" />
      </div>
    </span>
  </div>
</template>

<script setup>
import InputField from '@/components/Forms/InputField/InputField.vue'
import InputFieldRequired from '@/components/Forms/InputField/InputFieldRequired.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import SelectDropDownRequired from '@/components/Forms/SelectDropDown/SelectDropDownRequired.vue'
import DataLoader from '@/components/Feedback/Spinner/DataLoader.vue'
import { ref, onMounted, watch, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/oauth/useApi'
import { useAuth0 } from '@auth0/auth0-vue'
// Constants
const { getRequest, postRequest } = useApi()
const auth0 = useAuth0()
const router = useRouter()
const templateOptions = ref({})
const loading = ref(false)
const valid = ref(false)
const doctorId = ref(null)

const templateInfo = ref(null)
const selectedTemplate = ref(null)
const templateData = ref(null)
const localInfo = ref({})

// Emits
const emit = defineEmits(['addToast'])
const addToast = (toast) => {
  emit('addToast', toast)
}

// Watching required values
watch(
  localInfo,
  () => {
    let check = localInfo.value.filter((item) => item.required == true && item.value == '')
    if (check.length == 0) {
      valid.value = true
    } else {
      valid.value = false
    }
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
    templateData.value = [
      {
        name: 'Nombres',
        required: true,
        type: 'SHORT_TEXT',
        options: [],
        description: 'Nombres del paciente'
      },
      {
        name: 'Apellidos',
        required: true,
        type: 'SHORT_TEXT',
        options: [],
        description: 'Apellidos del paciente'
      },
      ...response.data.fields
    ]
  } catch {
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
    getTemplateData()
  } catch {
    //Connection error message
  }
  loading.value = false
})

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
  localInfo.value = templateData.value.map((item) => ({
    name: item.name,
    type: item.type,
    required: item.required,
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
.create-record {
  padding: 2rem;
  width: 100vw;
}

.create-record .button-space {
  width: 100%;
  display: flex;
  justify-content: end;
  padding-top: 2rem;
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
