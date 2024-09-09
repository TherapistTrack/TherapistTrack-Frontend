<template>
  <div class="table-container">
    <div class="header-row">
      <span
        class="header-item"
        :class="item === '...' ? 'special-header' : 'header-item'"
        v-for="(item, key) in headers"
        :key="key"
      >
        <p v-if="item == '...'" @click="handleClick()">
          {{ item }}
        </p>
        <p v-else>
          {{ item }}
        </p>
      </span>
    </div>
    <div class="table-scrollable">
      <div v-if="loading">
        <DataLoader />
      </div>
      <div v-else-if="!success" class="failed">
        <RiAlertFill color="var(--gray-2)" size="1.5rem" />
        <p>Oops... ocurrio un error</p>
      </div>

      <div
        v-else
        class="table-row"
        v-for="(item, key) in data"
        :key="key"
        @click="handleClick(key)"
      >
        <p
          :class="elem === 'moreSettings' ? 'special' : 'table-item'"
          v-for="(elem, key) in Object.keys(headers)"
          :key="key"
        >
          {{ item[elem] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import DataLoader from '@/components/Feedback/Spinner/DataLoader.vue'
import { RiAlertFill } from '@remixicon/vue'
const props = defineProps({
  loading: Boolean,
  onClick: Function,
  data: Object,
  headers: Object,
  success: Boolean
})
function handleClick(key) {
  props.onClick(key)
}
</script>

<style>
.table-container {
  display: flex;
  flex-direction: column;
  font-family: 'MotivaSansLighter';
  /* Two columns */
  font-size: 2vh;
}

.table-container .header-row,
.table-container .table-row {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
}

.table-container .header-row {
  border-top: 0.2vh solid #ccc;
  color: var(--gray-1);
}

.table-container .table-scrollable {
  max-height: 50vh;
  overflow: auto;
}
.table-container .table-row {
  color: var(--black);
  font-weight: bold;
}

.table-container .header-item,
.table-container .table-item {
  padding: 0.5rem;
  border-bottom: 0.2vh solid #ccc;
}

.table-container .header-item {
  color: var(--gray-1);
}

.table-container .table-item {
  color: var(--black);
  font-weight: bold;
  transition: background-color 0.1s;
}

.table-item + .table-item {
  border-left: 1px solid #ccc;
}

.table-container .special {
  border-left: 1px solid #ccc;
}
.table-container .failed {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 2rem;
  justify-content: center;
}

.table-container .table-row:hover .table-item {
  background-color: var(--yellow-2);
  cursor: pointer;
}

.special-header {
  transition: background-color 0.1s;
}

.special:hover,
.special-header:hover {
  background-color: var(--light-blue-1);
  cursor: pointer;
}
</style>
