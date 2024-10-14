<template>
  <div class="sort-form">
    <div class="sf-container">
      <span class="horizontal">
        <SelectDropDown
          :id="'form-name'"
          v-model:model-value="localSort.name"
          :disabled-value="'Escoga un campo'"
          :options="availableFields"
        />
        <SelectDropDown
          :id="'form-mode'"
          v-model:model-value="localSort.mode"
          :disabled-value="'Escoga una Modalidad'"
          :options="['Ascendiente', 'Descendiente']"
        />
      </span>
      <span v-if="!valid">
        <p v-for="error in errors" :key="error.slice(0, 1)" class="error-mssg">{{ error }}</p>
      </span>
      <div class="sf-bottom">
        <ButtonSimple :msg="'CREAR'" :color="'white'" :onClick="handleSave" :disabled="!valid" />
      </div>
    </div>
  </div>
</template>

<script setup>
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import { ref, watch } from 'vue'
import { sortSchema } from '@/schemas/filterAndSortSchema'

// Emits
const emit = defineEmits(['updateSort', 'closeForm'])
// Props
const props = defineProps({
  sort: Object,
  fields: Object,
  sorts: Array
})

// Variables
// Local value for the form
const localSort = ref(props.sort)

// Defensive programing
const errors = ref([])
const valid = ref(false)

// Selected fields
const selectedFields = ref(props.sorts.map((item) => item.name))

// available fields
const availableFields = ref(
  Object.keys(props.fields).filter((item) => !selectedFields.value.includes(item))
)

// Functions
const handleSave = () => {
  emit('updateSort', localSort.value)
  emit('closeForm')
}

// Deffensive Programing
watch(
  localSort,
  () => {
    sortSchema
      .validate({
        name: localSort.value.name,
        mode: localSort.value.mode
      })
      .then(() => {
        valid.value = true
      })
      .catch((error) => {
        errors.value = error.errors
        valid.value = false
      })
  },
  { deep: true }
)
</script>

<style scoped>
.sf-container .horizontal {
  display: flex;
  gap: 2rem;
}
.sf-container .horizontal * {
  grid-template-columns: 1fr;
  margin: 0;
}
.sf-container .sf-bottom {
  display: flex;
  justify-content: end;
  margin-top: 1rem;
}
.sf-container .error-mssg {
  color: var(--red-1);
  padding-top: 1rem;
  text-align: center;
}
</style>
