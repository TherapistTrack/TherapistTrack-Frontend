<template>
  <div class="filter-overlay" ref="myDiv">
    <div class="filter-container">
      <div class="filter-field">
        <div class="sort-settings" v-if="type == 'sort'">
          <span class="horizontal">
            <SelectDropDown
              :id="'field'"
              :options="validSortFields"
              :disabled-value="'Escoga un campo'"
              v-model:model-value="localValue.name"
            />
            <SelectDropDown
              :id="'mode'"
              :disabled-value="'Escoga una modalidad'"
              :options="['Ascendiente', 'Descendiente']"
              v-model:model-value="localValue.mode"
            />
          </span>
        </div>
        <div class="filter-settings" v-else>
          <span class="horizontal">
            <SelectDropDown
              :id="'field'"
              :options="fieldArray"
              :disabled-value="'Escoga un campo'"
              v-model:model-value="localValue.name"
            />
            <SelectDropDown
              :id="'ope'"
              :disabled-value="'Escoga una operacion'"
              :options="filterOptions"
              v-model:model-value="localValue.operation"
            />
          </span>
          <span class="filter-input">
            <InputFieldSimple
              v-if="lastType != 'choice'"
              :id="'value'"
              :placeholder="'Escriba el valor a comparar'"
              :type="lastType"
              v-model:model-value="localValue.value"
            />
            <span v-else class="filter-input-choice">
              <SelectDropDown
                :id="'value'"
                :disabled-value="'Escoga un valor'"
                :options="choiceFieldArray"
                v-model:model-value="localValue.value"
              />
            </span>
          </span>
        </div>
      </div>
      <span v-if="!valid">
        <p v-for="error in errors" :key="error.slice(0, 1)" class="error-mssg">{{ error }}</p>
      </span>

      <div class="filter-bottom">
        <ButtonSimple :msg="'CREAR'" :color="'white'" :onClick="handleSave" :disabled="!valid" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import InputFieldSimple from '@/components/Forms/InputField/InputFieldSimple.vue'
import { filterSchema, sortSchema } from '@/schemas/filterAndSortSchema'

const emit = defineEmits(['addComponent', 'closeAdd'])
const myDiv = ref(null)
const filterOptions = ref([])
const choiceFieldArray = ref([])
const valid = ref(false)
const lastType = ref('')
const validSortFields = ref([])
const errors = ref([])
const props = defineProps({
  fields: Object,
  type: String,
  sortFields: Array
})

const localValue = ref({
  type: props.type,
  name: '',
  mode: '',
  operation: '',
  value: ''
})
const updateFilterOptions = (type) => {
  if (['short_text', 'text'].includes(type)) {
    filterOptions.value = ['Contains', 'Starts with', 'Ends with']
  } else if (type === 'date') {
    filterOptions.value = ['Before', 'Between', 'After']
  } else if (['number', 'float'].includes(type)) {
    filterOptions.value = ['Less Than', 'Equals', 'Greater Than']
  } else if (type === 'choice') {
    filterOptions.value = ['Is', 'Is Not', 'Is Not Empty']
    let temOptions = props.fields[localValue.value.name].options
    choiceFieldArray.value = temOptions
  }
}

const checkIfValid = () => {
  if (props.type === 'sort') {
    sortSchema
      .validate({
        name: localValue.value.name,
        mode: localValue.value.mode
      })
      .then(() => {
        valid.value = true
      })
      .catch((error) => {
        errors.value = error.errors
        valid.value = false
      })
  } else {
    let filterSch = filterSchema(lastType.value, choiceFieldArray.value)
    filterSch
      .validate({
        name: localValue.value.name,
        operation: localValue.value.operation,
        value: localValue.value.value
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
watch(
  localValue,
  () => {
    let type = ''
    if (localValue.value.name !== undefined && localValue.value.name !== '') {
      type = props.fields[localValue.value.name].type
    }
    if (lastType.value !== type && lastType.value !== '') {
      localValue.value.operation = ''
    }
    lastType.value = type

    updateFilterOptions(type)
    checkIfValid()
  },
  { deep: true }
)

const translate = ref({
  Is: 'is',
  'Is Not': 'is_not',
  'Is Not Empty': 'is_not_empty',
  Contains: 'contains',
  'Starts with': 'starts_with',
  'Ends with': 'ends_with',
  Before: 'before',
  Between: 'between',
  After: 'after',
  'Less Than': 'less_than',
  Equals: 'equals',
  'Greater Than': 'greater_than'
})
const fieldArray = ref([])
const getNames = () => {
  fieldArray.value = Object.keys(props.fields)
}
const getValidSortFields = () => {
  for (let i in fieldArray.value) {
    if (!props.sortFields.includes(fieldArray.value[i])) {
      validSortFields.value.push(fieldArray.value[i])
    }
  }
}

const handleSave = () => {
  if (localValue.value.mode == 'Ascendiente') {
    localValue.value.mode = 'asc'
  } else if (localValue.value.mode == 'Descendiente') {
    localValue.value.mode = 'desc'
  }
  let trans = translate.value[localValue.value.operation]
  localValue.value.operation = trans
  let comp = localValue.value
  emit('addComponent', comp)
  emit('closeAdd')
}

const handleClickOutside = (event) => {
  if (myDiv.value && !myDiv.value.contains(event.target)) {
    emit('closeAdd')
  }
}
onMounted(() => {
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside)
    getNames()
    getValidSortFields()
  }, 1)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside) // Step 4: Remove event listener on unmount
})
</script>

<style scoped>
.error-mssg {
  color: var(--red-1);
  padding-top: 1rem;
  text-align: center;
}
.filter-input * {
  width: 100%;
}
.filter-input-choice * {
  width: 410px;
}
.filter-settings .horizontal,
.sort-settings .horizontal {
  display: flex;
  gap: 2rem;
}

.sort-settings .horizontal * {
  grid-template-columns: 1fr;
  margin: 0;
}

.filter-overlay {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.filter-container {
  max-width: 450px;
  background-color: white;
  padding: 1rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
}

.filter-container .filter-bottom {
  display: flex;
  justify-content: end;
  padding-top: 1rem;
}

.filter-container .close {
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
}

.filter-container .close * {
  transition: fill 0.2s;
}

.filter-container .close *:hover {
  fill: var(--gray-1);
}
</style>
