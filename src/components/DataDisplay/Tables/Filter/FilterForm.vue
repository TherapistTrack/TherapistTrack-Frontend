<template>
  <div class="filter-form">
    <div class="ff-container">
      <span class="horizontal">
        <SelectDropDown
          :id="'field'"
          :options="Object.keys(fields)"
          :disabled-value="'Escoga un campo'"
          v-model:model-value="localFilter.name"
        />
        <SelectDropDown
          :id="'ope'"
          :disabled-value="'Escoga una operacion'"
          :options="filterOptions"
          v-model:model-value="localFilter.operation"
        />
      </span>
      <div class="ff-input">
        <div v-if="localFilter.operation == 'Entre'" class="between">
          <InputFieldSimple
            :id="'value'"
            :placeholder="'Escriba el valor a comparar'"
            :type="'date'"
            v-model:model-value="localFilter.values[0]"
          />
          Y
          <InputFieldSimple
            :id="'value'"
            :placeholder="'Escriba el valor a comparar'"
            :type="'date'"
            v-model:model-value="localFilter.values[1]"
          />
        </div>
        <span v-else>
          <InputFieldSimple
            v-if="lastType != 'choice'"
            :id="'value'"
            :placeholder="'Escriba el valor a comparar'"
            :type="lastType"
            v-model:model-value="localFilter.values[0]"
          />
          <span v-else-if="localFilter.operation != 'No es vacío'" class="ff-input-choice">
            <SelectDropDown
              :id="'value'"
              :disabled-value="'Escoga un valor'"
              :options="choiceFieldArray"
              v-model:model-value="localFilter.values[0]"
            />
          </span>
        </span>
      </div>
      <span v-if="!valid">
        <p v-for="error in errors" :key="error.slice(0, 1)" class="error-mssg">{{ error }}</p>
      </span>

      <div class="ff-bottom">
        <ButtonSimple
          :msg="editOrCreate"
          :color="'white'"
          :onClick="handleSave"
          :disabled="!valid"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import InputFieldSimple from '@/components/Forms/InputField/InputFieldSimple.vue'
import { ref, watch, onMounted } from 'vue'
import { filterSchema, betweenSchema } from '@/schemas/filterAndSortSchema'

// Emits
const emit = defineEmits(['updateFilter', 'closeForm'])
// Props
const props = defineProps({
  editOrCreate: String,
  fields: Object,
  filter: Object
})
// Variables
const filterOptions = ref([])
const choiceFieldArray = ref([])
const valid = ref(false)
const lastType = ref('')
const errors = ref([])
const localFilter = ref(props.filter)

// Functions
// Saving the form
const handleSave = () => {
  emit('updateFilter', localFilter.value)
  emit('closeForm')
}

// Refreshing pipeline, based on a watch of localFilter
// Initial refresh
onMounted(() => {
  filterRefresh()
})
// Responsive refresh
watch(
  localFilter,
  () => {
    filterRefresh()
  },
  { deep: true }
)

// Gents type of current field and resets operation options
const filterRefresh = () => {
  let type = ''
  if (localFilter.value.name !== undefined && localFilter.value.name !== '') {
    type = props.fields[localFilter.value.name].type
  }
  if (lastType.value !== type && lastType.value !== '') {
    localFilter.value.operation = ''
  }
  lastType.value = type
  updateFilterOptions(type)
  checkIfValid()
}

// Validation with custom yup schema
const checkIfValid = () => {
  if (localFilter.value.operation == 'Entre') {
    betweenSchema
      .validate({
        dateBefore: localFilter.value.values[0],
        dateAfter: localFilter.value.values[1]
      })
      .then(() => {
        valid.value = true
      })
      .catch((error) => {
        errors.value = error.errors
        valid.value = false
      })
  } else {
    let filterSch = filterSchema(
      lastType.value,
      choiceFieldArray.value,
      localFilter.value.operation
    )
    filterSch
      .validate({
        name: localFilter.value.name,
        operation: localFilter.value.operation,
        value: localFilter.value.values[0]
      })
      .then(() => {
        valid.value = true
      })
      .catch((error) => {
        errors.value = error.errors
        valid.value = false
      })
  }
}
// This updates the operation options of the filter based on the type of its content
const updateFilterOptions = (type) => {
  if (['short_text', 'text'].includes(type)) {
    filterOptions.value = ['Contiene', 'Comienza con', 'Termina con']
  } else if (type === 'date') {
    filterOptions.value = ['Antes de', 'Entre', 'Despues de']
  } else if (['number', 'float'].includes(type)) {
    filterOptions.value = ['Menor que', 'Igual a', 'Mayor que']
  } else if (type === 'choice') {
    filterOptions.value = ['Es', 'No es', 'No es vacío']
    let temOptions = props.fields[localFilter.value.name].options
    choiceFieldArray.value = temOptions
  }
}
</script>

<style scoped>
.ff-container .horizontal {
  display: flex;
  gap: 2rem;
}

.between {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ff-container .horizontal * {
  grid-template-columns: 1fr;
  margin: 0;
}

.ff-container .ff-bottom {
  display: flex;
  justify-content: end;
  margin-top: 1rem;
}

.ff-container .error-mssg {
  color: var(--red-1);
  padding-top: 1rem;
  text-align: center;
}

.ff-input * {
  grid-template-columns: 1fr;
  width: 100%;
}

.ff-input {
  padding-top: 1rem;
}
</style>
