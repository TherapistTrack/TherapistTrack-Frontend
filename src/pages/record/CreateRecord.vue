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
          :options="plantillasOptions"
          v-model:modelValue="selected"
        />
        <div v-for="(key, item) in plantillasData[selected]" :key="key">
          <span v-if="key.type == 'optioned'">
            <span v-if="key.required">
              <SelectDropDownRequired
                :id="'key'"
                :label="key.name"
                :disabledValue="'Seleccione una opción'"
                :options="key.options"
                v-model:modelValue="info[item]"
                :description="key.description"
              />
            </span>
            <span v-else>
              <SelectDropDown
                :id="'key'"
                :label="key.name"
                :disabledValue="'Seleccione una opción'"
                :options="key.options"
                v-model:modelValue="info[item]"
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
                v-model:modelValue="info[item]"
              />
            </span>
            <span v-else>
              <InputField
                :id="'normal-field'"
                :label="key.name"
                :type="key.type"
                v-model:modelValue="info[item]"
              />
            </span>
          </span>
        </div>
      </div>
      <div class="button-space">
        <ButtonSimple :msg="'Crear'" :disabled="!canCreate" :onClick="createRecord" />
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
import plantillasJson from '@/pages/record/plantillas.json'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
// Constants
const router = useRouter()
const plantillasData = ref({})
const plantillasOptions = ref({})
const requiredFields = ref([])
const selected = ref('')
const loading = ref(false)
const canCreate = ref(false)

const info = ref({})

// Watching required values
watch(selected, () => {
  if (selected.value != '') {
    initLocalJson(selected.value)
    setRequiredFields(selected.value)
  }
})

watch(
  info,
  () => {
    canCreate.value = true
    Object.values(requiredFields.value).forEach((item) => {
      if (info.value[item] == '') {
        canCreate.value = false
      }
    })
  },
  { deep: true }
)

// On Mounted
onMounted(async () => {
  loading.value = true
  // simulation time
  await new Promise((resolve) => setTimeout(resolve, 500))

  // fetchData for when the backend gets deployed
  // fetchedData.value = await fetchData();
  plantillasData.value = plantillasJson

  plantillasOptions.value = Object.keys(plantillasData.value)
  selected.value = plantillasOptions.value[0]
  loading.value = false
  initLocalJson(plantillasOptions.value[0])
  setRequiredFields(plantillasOptions.value[0])
  return plantillasData
})

// Fucntions
const initLocalJson = (selectedPlantilla) => {
  info.value = {}
  const jsonKeys = Object.keys(plantillasData.value[selectedPlantilla])
  jsonKeys.forEach((key) => {
    info.value[key] = ''
  })
}

const setRequiredFields = (selectedPlantilla) => {
  requiredFields.value = []
  const jsonKeys = Object.keys(plantillasData.value[selectedPlantilla])
  jsonKeys.forEach((key) => {
    if (plantillasData.value[selectedPlantilla][key].required) {
      requiredFields.value.push(key)
    }
  })
}

const createRecord = () => {
  router.push('/record/main')
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
