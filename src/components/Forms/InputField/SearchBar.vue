<template>
  <div class="searchBar">
    <input :placeholder="pholder" /><RiSearchLine size="1rem" color="var(--gray-1)" alt="search" />
  </div>
</template>

<script setup>
import { RiSearchLine } from '@remixicon/vue'
defineProps({
  pholder: String
})
</script>

<style scoped>
.searchBar {
  display: flex;
  align-items: center;
  width: fit-content;
  background-color: #e9e9e9;
  border: 0;
  border-radius: 2vh;
  padding: 1vh;
  color: #6e6e6e;
}

.searchBar input {
  border: none;
  background: none;
}

.searchBar img {
  height: 3vh;
}
</style>
