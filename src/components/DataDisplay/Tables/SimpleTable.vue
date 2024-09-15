<template>
  <div class="simple-table-container">
    <div class="simple-row" v-for="(item, key) in headers" :key="key">
      <div class="simple-item-first">
        <p>{{ item }}</p>
      </div>
      <span v-if="isSet">
        <p class="simple-item">
          {{ data[item] }}
        </p>
      </span>
      <span v-else>
        <div v-if="Array.isArray(data[key])">
          <p class="simple-item" v-for="(item, index) in data[key]" :key="index">
            {{ item }}
          </p>
        </div>
        <p v-else class="simple-item">{{ data[key] }}</p>
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: Object,
  headers: Object,
  isSet: {
    type: Boolean,
    default: false
  }
})
</script>

<style>
.simple-table-container {
  display: grid;
  grid-template-columns: auto;
  font-family: 'MotivaSansLighter';
}
.simple-row {
  width: 100%;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 2fr;
  padding-bottom: 4vh;
}

.simple-item-first {
  color: var(--gray-1);
}

.simple-item {
  font-weight: 600;
  display: inline-block;
  overflow-x: hidden;
  text-overflow: ellipsis;
}
</style>
