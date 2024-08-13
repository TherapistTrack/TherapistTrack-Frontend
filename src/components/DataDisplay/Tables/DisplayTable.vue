<template>
  <div class="table-container">
    <div class="header-row">
      <p class="header-item" v-for="(item, key) in headers" :key="key">
        {{ item }}
      </p>
    </div>
    <div v-if="loading">
      <DataLoader />
    </div>

    <div v-else class="table-row" v-for="(item, key) in data" :key="key" @click="handleClick(key)">
      <p class="table-item" v-for="(elem, key) in Object.keys(headers)" :key="key">
        {{ item[elem] }}
      </p>
    </div>
  </div>
</template>

<script setup>
import DataLoader from '@/components/Feedback/Spinner/DataLoader.vue'
const props = defineProps({
  loading: Boolean,
  onClick: Function,
  data: Object,
  headers: Object
})
function handleClick(key) {
  props.onClick(key)
}
</script>

<style>
.table-container {
  display: grid;
  grid-template-columns: auto;
  font-family: 'MotivaSansLighter';
  /* Two columns */
  font-size: 2vh;
}

.header-row,
.table-row {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}
.header-row {
  border-top: 0.2vh solid #ccc;
  color: var(--gray-1);
}
.table-row {
  color: var(--black);
  font-weight: bold;
}

.header-item,
.table-item {
  padding: 0.5rem;
  border-bottom: 0.2vh solid #ccc;
}

.header-item {
  color: var(--gray-1);
}

.table-item {
  color: var(--black);
  font-weight: bold;
}

.table-item + .table-item {
  border-left: 1px solid #ccc;
}

.table-row:hover {
  background-color: var(--yellow-2);
  cursor: pointer;
}
</style>
