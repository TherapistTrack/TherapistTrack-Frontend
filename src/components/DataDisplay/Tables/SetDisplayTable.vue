<template>
  <div class="table-container">
    <div class="header-row">
      <span class="header-item" v-for="(item, key) in headers" :key="key">
        <p>
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
        <p>Oops... algo salio mal</p>
      </div>

      <div
        v-else
        class="table-row"
        v-for="(item, index) in data"
        :key="index"
        @click="handleClick(index)"
        @contextmenu.prevent="handleContextMenu($event, item)"
      >
        <p class="table-item" v-for="(elem, key) in headers" :key="key">
          {{ item[key] }}
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

const emit = defineEmits(['rowClick', 'contextmenu'])

function handleClick(key) {
  emit('rowClick', props.data[key])
}

function handleContextMenu(event, patient) {
  event.preventDefault() // Evita el menú contextual predeterminado
  emit('contextmenu', event, patient) // Emitir el evento hacia el componente padre
}
</script>

<style scoped>
.table-container {
  display: flex;
  flex-direction: column;
  font-family: 'MotivaSansLighter';
  font-size: 2vh;
}

.table-container .header-row,
.table-container .table-row {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
}

.table-container .header-row {
  /* border-top: 0.2vh solid #ccc; */
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
  border-top: 0.2vh solid #ccc;
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
</style>
