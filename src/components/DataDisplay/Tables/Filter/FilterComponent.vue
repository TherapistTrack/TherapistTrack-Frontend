<template>
  <div class="filter-component">
    <span v-if="type">
      <div class="text">
        <p>
          <b>{{ field }}</b> {{ operation }} <b>{{ value }}</b>
        </p>
      </div>
    </span>
    <span class="sort-component" v-else>
      <RiSortAsc v-if="mode" color="var(--green-1)" size="1.2rem" class="sort-icon" />
      <RiSortDesc v-else size="1.2rem" color="var(--red-1)" class="sort-icon" />
      <p class="text">
        <b>{{ field }}</b>
      </p>
    </span>

    <RiCloseLine class="icon" size="1.2rem" color="var(--gray-1)" @click="onClose" />
  </div>
</template>

<script setup>
import { RiCloseLine, RiSortAsc, RiSortDesc } from '@remixicon/vue'
defineProps({
  field: String,
  operation: String,
  value: String,
  onClose: Function,
  mode: Boolean,
  type: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.filter-component {
  border: 1px solid var(--gray-2);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
}
.filter-component .text {
  margin-left: 1rem;
  font-size: 0.7rem;
}
.filter-component .text * {
  color: var(--gray-1);
}

.filter-component .icon {
  margin-right: 0.2rem;
  transition: fill 0.2s;
  margin-left: 1rem;
}
.filter-component .icon:hover {
  fill: var(--gray-2);
}

.filter-component .sort-component {
  display: flex;
  align-items: center;
}
.filter-component .sort-component .sort-icon {
  margin-left: 1rem;
}
</style>
