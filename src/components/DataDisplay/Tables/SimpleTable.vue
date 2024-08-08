<template>
  <div class="simple-table-container">
    <div class="simple-row" v-for="(item, key) in headers" :key="key">
      <div class="simple-item-first">
        {{ item }}
      </div>
      <div v-if="Array.isArray(data[key])">
        <div class="simple-item" v-for="(item, index) in data[key]" :key="index">
          {{ item }}
        </div>
      </div>
      <div v-else class="simple-item">{{ data[key] }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: Object,
  headers: Object
})
</script>

<style>
.-simple-table-container {
  display: grid;
  grid-template-columns: auto;
  font-family: 'MotivaSansLighter';
}

.simple-row {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  padding-bottom: 5vh;
}

.simple-item-first {
  color: var(--gray-1);
}

.simple-item {
  font-weight: 600;
}
</style>
