<template>
  <FormOverlay
    v-if="editFilterData"
    :sortOrFilter="'filter-specific'"
    :index="filterIndex"
    :fields="fields"
    :filters="filters"
    @closeForm="handleCloseForm"
    @addFilter="updateLocalFilters"
  />
  <div v-else class="edit-overlay" ref="myDiv">
    <div class="edit-container">
      <EditSort
        v-if="sortOrFilter === 'sort'"
        :sorts="sorts"
        :filters="filters"
        :fields="fields"
        @updateSorts="updateLocalSorts"
      />
      <EditFilter v-else :filters="filters" :fields="fields" @onEditSingle="handleEditSingle" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import FormOverlay from './FormOverlay.vue'
import EditFilter from './EditFilter.vue'
import EditSort from './EditSort.vue'

// Emits
const emit = defineEmits(['closeEdit', 'updateSorts', 'updateFilters', 'openEditSpecific'])
// Props
const props = defineProps({
  sortOrFilter: String,
  sorts: Array,
  filters: Array,
  fields: Object
})

// Variables
const myDiv = ref(null)
const editException = ref(true)
const localSorts = ref(props.sorts)
const filterIndex = ref(null)
const localFilters = ref(props.filters)
const editFilterData = ref(false)

// Functions
const handleEditSingle = (index) => {
  editException.value = false
  filterIndex.value = index
  editFilterData.value = true
  setTimeout(() => {
    editException.value = true
  }, 2)
}

const handleCloseForm = () => {
  emit('updateFilters', localFilters.value)
  emit('closeEdit')
}

const handleClickOutside = (event) => {
  if (myDiv.value && !myDiv.value.contains(event.target) && editException.value) {
    if (props.sortOrFilter === 'sort') {
      emit('updateSorts', localSorts.value)
    } else {
      emit('updateFilters', localFilters.value)
    }
    emit('closeEdit')
  }
}
watch(
  localSorts,
  () => {
    if (localSorts.value.length == 0) {
      emit('updateSorts', [])
      emit('closeEdit')
    }
  },
  { deep: true }
)

const updateLocalSorts = (sorts) => {
  localSorts.value = sorts
}

const updateLocalFilters = (filter) => {
  localFilters.value[filterIndex.value] = filter
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

<style>
.edit-overlay {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.edit-container {
  max-width: 500px;
  background-color: white;
  padding: 1rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
}
</style>
