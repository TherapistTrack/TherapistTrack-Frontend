<template>
  <div class="field-table">
    <div class="add-overlay" v-if="showEditSpecific"></div>
    <div v-if="showForm" class="add-overlay">
      <FormOverlay
        :sortOrFilter="sortOrFilter"
        :fields="fields"
        :sorts="sorts"
        :filters="filters"
        @closeForm="handleCloseForm"
        @addSort="addSort"
        @addFilter="addFilter"
      />
    </div>
    <div v-if="showEdit">
      <EditOverlay
        :sort-or-filter="editType"
        :sorts="sorts"
        :filters="filters"
        :fields="fields"
        @closeEdit="closeEdit"
        @updateSorts="updateSortsFromChilden"
        @updateFilters="updateFiltersFromChilden"
        @openEditSpecific="openEditSpecific"
      />
    </div>
    <div class="fns-grid">
      <div class="s-table">
        <div class="header">
          <IconButton
            msg="Ordenar"
            :onClick="handleOpenSortForm"
            :first-icon="RiArrowUpDownLine"
            :second-icon="RiAddLine"
          />
        </div>

        <div class="field-body">
          <div class="sort-grid">
            <div class="sort">
              <span v-for="(sort, key) in sorts" :key="key">
                <FilterComponent
                  :field="sort.name"
                  :mode="sort.mode === 'Descendiente' ? false : true"
                  :onClose="() => removeComponent('sort', key)"
                  :onClick="() => openEdit('sort')"
                />
              </span>
            </div>
            <RiDeleteBin7Fill
              class="close"
              color="var(--gray-1)"
              size="1.2rem"
              @click="cleanSort"
            />
          </div>
        </div>
      </div>
      <div clas="f-table">
        <div class="header">
          <IconButton
            msg="Nuevo Filtro"
            :onClick="handleOpenFilterForm"
            :first-icon="RiFilterFill"
            :second-icon="RiAddLine"
          />
        </div>
        <div class="field-body">
          <div class="filter-grid">
            <div class="filter">
              <div v-for="(filter, key) in filters" :key="key">
                <FilterComponent
                  :field="filter.name"
                  :operation="filter.operation"
                  :values="filter.values"
                  :type="true"
                  :onClose="() => removeComponent('', key)"
                  :onClick="() => openEdit('filter')"
                />
              </div>
            </div>
            <RiDeleteBin7Fill
              class="close"
              color="var(--gray-1)"
              size="1.2rem"
              @click="cleanFilter"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import FormOverlay from './FormOverlay.vue'
import IconButton from '@/components/Buttons/IconButton.vue'
import FilterComponent from './FilterComponent.vue'
import { ref } from 'vue'
import { RiDeleteBin7Fill, RiArrowUpDownLine, RiFilterFill, RiAddLine } from '@remixicon/vue'
import EditOverlay from './EditOverlay.vue'

const emit = defineEmits(['updateFilters', 'updateSorts'])
defineProps({
  fields: Object
})

const showForm = ref(false)
const sortOrFilter = ref('')
const sortFields = ref([])
const showEdit = ref(false)
const editType = ref('')
const showEditSpecific = ref(false)
const sorts = ref([])
const filters = ref([])

const updateFiltersFromChilden = (tem_filters) => {
  filters.value = tem_filters
  emit('updateFilters', filters.value)
}

const updateSortsFromChilden = (tem_sorts) => {
  sorts.value = tem_sorts
  emit('updateSorts', sorts.value)
}
const openEditSpecific = () => {
  showEditSpecific.value = true
}

const openEdit = (type) => {
  editType.value = type
  showEdit.value = true
}

const closeEdit = () => {
  showEdit.value = false
}
const handleCloseForm = () => {
  showForm.value = false
}
const handleOpenSortForm = () => {
  sortOrFilter.value = 'sort'
  showForm.value = true
}
const handleOpenFilterForm = () => {
  sortOrFilter.value = 'filter'
  showForm.value = true
}

const addSort = (sort) => {
  sorts.value.push({
    name: sort.name,
    mode: sort.mode
  })
  emit('updateSorts', sorts.value)
}

const addFilter = (filter) => {
  if (filter.values[1] == '') {
    filter.values.splice(1, 1)
  }
  filters.value.push({
    name: filter.name,
    operation: filter.operation,
    values: [...filter.values],
    logic: 'Y'
  })
  emit('updateFilters', filters.value)
}

const removeComponent = (type, index) => {
  if (type == 'sort') {
    sortFields.value.splice(sortFields.value.indexOf(sorts.value[index].name), 1)
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
.fns-grid {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
.header {
  border-bottom: 1px solid var(--gray-3);
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
}

.field-table {
  padding-bottom: 1rem;
  z-index: 1;
}

.field-body {
  display: flex;
}

.field-body .filter {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
  max-width: 570px;
}

.field-body .filter-grid {
  display: flex;
  width: 100%;
  flex-shrink: 0;
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
  gap: 0.5rem;

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
  flex-shrink: 0;
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
