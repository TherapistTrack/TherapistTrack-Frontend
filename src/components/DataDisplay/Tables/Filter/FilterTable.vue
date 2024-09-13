<template>
  <div class="field-table">
    <div v-if="showAdd" class="add-overlay">
      <AddFilter
        :fields="fields"
        :type="sortOrFilter"
        @closeAdd="handleCloseAdd"
        @addComponent="addComponent"
      />
    </div>
    <div class="field-header">
      <span class="filter-options">
        <IconButton :type="'sort'" :onClick="addSort" />
        <IconButton :type="'filtro'" :onClick="addFilter" />
      </span>
    </div>
    <div class="field-body">
      <div class="sort-grid">
        <div class="sort">
          <span v-for="(sort, key) in sorts" :key="key">
            <FilterComponent
              :field="sort.name"
              :mode="sort.mode === 'desc' ? false : true"
              :onClose="() => removeComponent('sort', key)"
            />
          </span>
        </div>
        <RiDeleteBin7Fill class="close" color="var(--gray-1)" size="1.2rem" @click="cleanSort" />
      </div>
      <div class="filter-grid">
        <div class="filter">
          <div v-for="(filter, key) in filters" :key="key">
            <FilterComponent
              :field="filter.name"
              :operation="filter.operation"
              :value="filter.value"
              :type="true"
              :onClose="() => removeComponent('', key)"
            />
          </div>
        </div>
        <RiDeleteBin7Fill class="close" color="var(--gray-1)" size="1.2rem" @click="cleanFilter" />
      </div>
    </div>
  </div>
</template>

<script setup>
import IconButton from '@/components/Buttons/IconButton.vue'
import FilterComponent from './FilterComponent.vue'
import AddFilter from './AddFilter.vue'
import { ref } from 'vue'
import { RiDeleteBin7Fill } from '@remixicon/vue'
const showAdd = ref(false)
const sortOrFilter = ref('')
const emit = defineEmits(['updateFilter'], ['updateSorts'])
defineProps({
  fields: Array
})

const handleCloseAdd = () => {
  showAdd.value = false
}
const addSort = () => {
  sortOrFilter.value = 'sort'
  showAdd.value = true
}
const addFilter = () => {
  sortOrFilter.value = ''
  showAdd.value = true
}
const sorts = ref([])
const filters = ref([])

const addComponent = (comp) => {
  if (comp.type == 'sort') {
    sorts.value.push({
      name: comp.name,
      mode: comp.mode
    })
    emit('updateSorts', sorts.value)
  } else {
    filters.value.push({
      name: comp.name,
      operation: comp.operation,
      value: comp.value
    })
    emit('updateFilters', filters.value)
  }
}

const removeComponent = (type, index) => {
  if (type == 'sort') {
    sorts.value.splice(index, 1)
    emit('updateSorts', sorts.value)
  } else {
    filters.value.splice(index, 1)
    emit('updateFilters', filters.value)
  }
}

const cleanSort = () => {
  sorts.value = []
  emit('updateSorts', sorts.value)
}

const cleanFilter = () => {
  filters.value = []
  emit('updateFilters', filters.value)
}
</script>

<style>
.field-table {
  padding-bottom: 1rem;
  z-index: 1;
}
.field-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--gray-3);
  gap: 1rem;
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
}

.field-body {
  display: flex;
}
.field-body .filter {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  min-width: 90%;
}

.field-body .filter-grid {
  display: flex;
  width: 100%;
}
.field-body .filter-grid .close {
  margin-top: 1rem;
  margin-left: 1rem;
  transition: fill 0.2s;
}
.field-body .filter-grid .close:hover {
  fill: var(--gray-2);
  cursor: pointer;
}

.field-body .sort {
  margin-top: 1rem;
  min-width: 170px;
  max-width: 170px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  margin-right: 1rem;
  padding-right: 1rem;
  max-height: 75px;
  overflow-y: scroll;
}

.field-body .sort-grid {
  display: flex;
  border-right: 1px solid var(--gray-3);
  margin-right: 1rem;
}

.field-body .sort-grid .close {
  margin-top: 1rem;
  margin-right: 1rem;
  transition: fill 0.2s;
}
.field-body .sort-grid .close:hover {
  fill: var(--gray-2);
  cursor: pointer;
}
.field-body .add-overlay {
  position: relative;
}

.filter-options {
  display: flex;
  gap: 5rem;
  min-width: 600px;
}
</style>
