<template>
  <div class="filter-overlay" @click="handleClose">
    <div class="filter-container" @click.stop="">
      <div class="filter-field">
        <div class="close">
          <h2 v-if="type == 'sort'">Agregar Orden</h2>
          <h2 v-else>Agregar Filtro</h2>
          <RiCloseLine @click="handleClose" />
        </div>

        <SelectDropDown
          :label="'Campo'"
          :options="fieldArray"
          :disabled-value="'Escoga un campo'"
          v-model:model-value="localValue.name"
        />
        <SelectDropDown
          v-if="type == 'sort'"
          :label="'Modalidad'"
          :disabled-value="'Escoga una modalidad'"
          :options="['Ascendiente', 'Descendiente']"
          v-model:model-value="localValue.mode"
        />
        <span v-else>
          <SelectDropDown
            :label="'Operación'"
            :disabled-value="'Escoga una operacion'"
            :options="filterOptions"
            v-model:model-value="localValue.operation"
          />
          <InputField
            :label="'Valor'"
            :placeholder="'Escriba el valor a comparar'"
            v-model:model-value="localValue.value"
          />
        </span>
      </div>
      <div class="filter-bottom">
        <ButtonSimple :msg="'Agregar'" :color="'yellow'" :onClick="handleSave" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import { ref, watch } from 'vue'
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import InputField from '@/components/Forms/InputField/InputField.vue'
import { RiCloseLine } from '@remixicon/vue'
const emit = defineEmits(['addComponent', 'closeAdd'])

const filterOptions = ref(['Mayor a', 'es', 'Menor a'])
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
    if (getType(localValue.value.name) != 'String') {
      filterOptions.value = ['Mayor a', 'es', 'Menor a']
    } else {
      filterOptions.value = ['Contiene', 'es']
    }
  },
  { deep: true }
)
const fieldArray = ref([])
const getNames = () => {
  Object.keys(props.fields).map((item) => {
    fieldArray.value.push(props.fields[item].name)
  })
}
const handleClose = () => {
  emit('closeAdd')
}
const handleSave = () => {
  if (localValue.value.mode == 'Ascendiente') {
    localValue.value.mode = 'asc'
  } else if (localValue.value.mode == 'Descendiente') {
    localValue.value.mode = 'desc'
  }
  let comp = localValue.value
  emit('addComponent', comp)
  emit('closeAdd')
}
getNames()
</script>

<style scoped>
.filter-overlay {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.filter-container {
  max-width: 400px;
  background-color: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
}

.filter-container .filter-bottom {
  display: flex;
  justify-content: center;
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
