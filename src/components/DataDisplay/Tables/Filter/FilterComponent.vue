<template>
  <div class="filter-component" @click="handleClick">
    <span v-if="type">
      <div class="text">
        <p>
          <span v-if="operation != 'Entre'">
            <b>{{ field }}</b> {{ operation }} <b>{{ value }}</b>
          </span>
          <span v-else>
            <b>{{ field }}</b> {{ operation }} <b>{{ startDate }} Y {{ endDate }}</b>
          </span>
        </p>
      </div>
    </span>
    <span class="sort-component" v-else>
      <RiSortAsc v-if="mode" color="var(--green-1)" size="1rem" class="sort-icon" />
      <RiSortDesc v-else size="1rem" color="var(--red-1)" class="sort-icon" />
      <p class="text">
        <b>{{ field }}</b>
      </p>
    </span>
    <span class="icon-container" @click.stop>
      <RiCloseLine class="icon" size="1rem" color="var(--gray-1)" @click="onClose" />
    </span>
  </div>
</template>

<script setup>
import { RiCloseLine, RiSortAsc, RiSortDesc } from '@remixicon/vue'
const props = defineProps({
  field: String,
  operation: String,
  value: String,
  onClose: Function,
  onClick: Function,
  mode: Boolean,
  startDate: String,
  endDate: String,
  type: {
    type: Boolean,
    default: false
  }
})

const handleClick = () => {
  props.onClick()
}
</script>

<style scoped>
.filter-component {
  border: 1px solid var(--gray-2);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
  transition: all 0.2s;
  cursor: pointer;
}

.filter-component:hover {
  border: 1px solid var(--blue-1);
  background-color: var(--light-blue-3);
}
.filter-component:hover .text * {
  color: var(--blue-1);
}
.filter-component .text {
  margin-left: 1rem;
  font-size: 0.7rem;
}
.filter-component .text * {
  color: var(--gray-1);
}
.filter-component .icon-container {
  display: flex;
  height: fit-content;
  margin-right: 0.2rem;
  margin-left: 1rem;
}
.filter-component .icon,
.filter-component .sort-icon {
  flex-shrink: 0;
}
.filter-component .icon:hover {
  fill: var(--red-1);
}

.filter-component .sort-component {
  display: flex;
  align-items: center;
}
.filter-component .sort-component .sort-icon {
  margin-left: 1rem;
}
</style>
