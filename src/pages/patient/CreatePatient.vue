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
                v-model:modelValue="localInfo[item]"
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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/oauth/useApi'
import { useAuth0 } from '@auth0/auth0-vue'
// Constants
const { getRequest } = useApi()
const auth0 = useAuth0()
const router = useRouter()
const templateOptions = ref({})
const loading = ref(false)
const valid = ref(false)

const templateInfo = ref(null)
const selectedTemplate = ref(null)
const templateData = ref(null)
const localInfo = ref({})

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
  let doctorId = auth0.user.value.sub.split('|')[1]
  let templateId = templateInfo.value.filter((item) => item.name == selectedTemplate.value)[0].id
  try {
    const response = await getRequest(
      `/doctor/FileTemplate?doctorId=${doctorId}&templateId=${templateId}`
    )
    templateData.value = [
      {
        name: 'Nombre',
        required: true,
        type: 'SHORT_TEXT',
        options: [],
        description: 'Nombre del archive'
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
  let doctorId = auth0.user.value.sub.split('|')[1]
  try {
    const response = await getRequest(`/doctor/FileTemplate/list?doctorId=${doctorId}`)
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

const resetLocalInfo = () => {
  localInfo.value = templateData.value.map((item) => ({
    name: item.name,
    type: item.type,
    required: item.required,
    value: ''
  }))
}

const createRecord = () => {
  router.push('/patient/123')
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
