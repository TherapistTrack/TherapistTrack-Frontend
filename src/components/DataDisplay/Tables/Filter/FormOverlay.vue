<template>
  <div class="create-overlay" ref="myDiv">
    <div class="create-container" v-if="ready">
      <SortForm
        v-if="sortOrFilter === 'sort'"
        :fields="fields"
        :sorts="sorts"
        v-model:sort="localSort"
        @update-sort="handleSortUpdate"
        @closeForm="closeForm"
      />
      <FilterForm
        v-else
        v-model:filter="localFilter"
        :fields="fields"
        :edit-or-create="sortOrFilter === 'filter-specific' ? 'GUARDAR' : 'CREAR'"
        @update-filter="handleFilterUpdate"
        @closeForm="closeForm"
      />
    </div>
  </div>
</template>

<script setup>
import SortForm from './SortForm.vue'
import FilterForm from './FilterForm.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
// Emits/Props
const emit = defineEmits(['closeForm', 'addSort', 'addFilter'])
const props = defineProps({
  sortOrFilter: String,
  fields: Object,
  sorts: Array,
  filters: Object,
  index: Number
})

// Variables
const myDiv = ref(null)
const localSort = ref({
  name: '',
  mode: ''
})
const localFilter = ref(null)
const ready = ref(false)
// Functions
const handleSortUpdate = (sort) => {
  emit('addSort', sort)
}
const handleFilterUpdate = (filter) => {
  emit('addFilter', filter)
}
const closeForm = () => {
  emit('closeForm')
}
// Navigation
const handleClickOutside = (event) => {
  // Closing event
  if (myDiv.value && !myDiv.value.contains(event.target)) {
    closeForm()
  }
}
onMounted(() => {
  if (props.sortOrFilter === 'filter-specific') {
    localFilter.value = props.filters[props.index]
  } else {
    localFilter.value = {
      name: '',
      operation: '',
      value: '',
      startDate: '',
      endDate: ''
    }
  }
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside)
  }, 1)
  ready.value = true
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside) // Step 4: Remove event listener on unmount
})
</script>

<style scoped>
.create-overlay {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}
.create-container {
  max-width: 500px;
  background-color: white;
  padding: 1rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
}
</style>
