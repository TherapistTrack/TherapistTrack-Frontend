<template>
  <div class="edit-filter">
    <div
      v-for="(filter, index) in localFilters"
      :key="filter.name + filter.operation"
      class="e-filter-component"
    >
      <span class="e-filter-values">
        <span class="e-filter-logic" v-if="index !== 0">
          <SelectDropDown
            :disabled-value="''"
            :id="'logic-dropdown'"
            v-model:model-value="filter.logic"
            :options="['Y', 'O']"
          />
        </span>
        <p>{{ filter.name }}</p>
        <p>
          <b>{{ filter.operation.toUpperCase() }}</b>
        </p>
        <p>{{ filter.value }}</p>
      </span>
      <span>
        <RiMore2Fill color="var(--gray-1)" class="more" @click="() => activateTooltip(index)" />
        <FilterOptionsTooltip
          v-if="filterTooltip[index]"
          @close-tooltip="clearTooltip()"
          @onDelete="() => handleDelete(index)"
          @onEdit="() => handleEdit(index)"
        />
      </span>
    </div>
  </div>
</template>

<script setup>
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import FilterOptionsTooltip from '../../Tooltip/FilterOptionsTooltip.vue'
import { RiMore2Fill } from '@remixicon/vue'
import { ref } from 'vue'
const emit = defineEmits(['onEditSingle'])
const props = defineProps({
  filters: Array,
  fields: Object
})

const handleEdit = (index) => {
  emit('onEditSingle', index)
}

const handleDelete = (index) => {
  localFilters.value.splice(index, 1)
}
const localFilters = ref(props.filters)
const filterTooltip = ref(Object.keys(props.filters).map(() => false))
const clearTooltip = () => {
  filterTooltip.value = filterTooltip.value.map(() => false)
}

const activateTooltip = (index) => {
  filterTooltip.value = filterTooltip.value.map(() => false)
  filterTooltip.value[index] = true
}
</script>

<style scoped>
.edit-filter {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.9rem;
}
.e-filter-component {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.e-filter-values {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.3rem;
}
.e-filter-component:hover {
  background-color: var(--gray-3);
}
.e-filter-component p,
.e-filter-component b {
  color: var(--gray-1);
}

.e-filter-values * {
  margin: 0;
}

.e-filter-logic {
  max-width: 60px;
}
.more {
  flex-shrink: 0;
  transition: fill 0.2s;
  cursor: pointer;
}
.more:hover {
  fill: var(--gray-2);
}
</style>
