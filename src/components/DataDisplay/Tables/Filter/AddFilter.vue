<template>
  <div class="filter-overlay" ref="myDiv">
    <div class="filter-container">
      <div class="filter-field">
        <div class="sort-settings" v-if="type == 'sort'">
          <span class="horizontal">
            <SelectDropDown
              :id="'field'"
              :options="fieldArray"
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
          <InputFieldSimple
            :id="'value'"
            :placeholder="'Escriba el valor a comparar'"
            v-model:model-value="localValue.value"
          />
        </div>
      </div>
      <div class="filter-bottom">
        <ButtonSimple :msg="'CREAR'" :color="'white'" :onClick="handleSave" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import InputFieldSimple from '@/components/Forms/InputField/InputFieldSimple.vue'
const emit = defineEmits(['addComponent', 'closeAdd'])
const myDiv = ref(null)
const filterOptions = ref(['Is', 'Is Not', 'Is Not Empty'])

const props = defineProps({
  fields: Array,
  type: String
})
const getType = (name) => {
  let tem = ''
  Object.keys(props.fields).map((item) => {
    if (name === props.fields[item].name) {
      tem = props.fields[item].type
    }
  })
  return tem
}

const localValue = ref({
  type: props.type,
  name: '',
  mode: '',
  operation: '',
  value: ''
})
watch(
  localValue,
  () => {
    let type = getType(localValue.value.name)
    if (['short_text', 'text'].includes(type)) {
      filterOptions.value = ['Contains', 'Starts with', 'Ends with']
    } else if (type === 'date') {
      filterOptions.value = ['Before', 'Between', 'After']
    } else if (['number', 'float'].includes(type)) {
      filterOptions.value = ['Less Than', 'Equals', 'Greater Than']
    } else {
      filterOptions.value = ['Is', 'Is Not', 'Is Not Empty']
    }
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
  Object.keys(props.fields).map((item) => {
    fieldArray.value.push(props.fields[item].name)
  })
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
getNames()

const handleClickOutside = (event) => {
  if (myDiv.value && !myDiv.value.contains(event.target)) {
    emit('closeAdd')
  }
}
onMounted(() => {
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside)
  }, 1)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside) // Step 4: Remove event listener on unmount
})
</script>

<style scoped>
.filter-settings .horizontal,
.sort-settings .horizontal {
  display: flex;
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
