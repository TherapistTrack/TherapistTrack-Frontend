<template>
  <div class="searchBar">
    <RiSearchLine size="1rem" color="var(--gray-1)" alt="search" />
    <input :placeholder="pholder" :value="searchValue" @input="updateValue" />

    <div class="container" :id="isEmpty ? '' : 'active'">
      <RiCloseLine v-if="showIcon" size="1rem" color="var(--gray-1)" class="close" @click="empty" />
    </div>
  </div>
</template>

<script setup>
import { RiSearchLine, RiCloseLine } from '@remixicon/vue'
import { ref, watch } from 'vue'
const isEmpty = ref(true)
const showIcon = ref(false)
defineProps({
  pholder: String,
  searchValue: String
})

watch(isEmpty, async () => {
  if (isEmpty.value == false) {
    setTimeout(() => {
      if (isEmpty.value == false) {
        showIcon.value = true
      } else {
        showIcon.value = false
      }
    }, 300)
  } else {
    showIcon.value = false
  }
})

const updateLol = (val) => {
  if (val == '') {
    isEmpty.value = true
  } else {
    isEmpty.value = false
  }
}

const empty = () => {
  emit('update:searchValue', '')
  isEmpty.value = true
}

const emit = defineEmits(['update:searchValue'])

const updateValue = (event) => {
  emit('update:searchValue', event.target.value)
  updateLol(event.target.value)
}
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
  gap: 1rem;
}

.searchBar input {
  border: none;
  background: none;
  max-width: 150px;
}

.searchBar img {
  height: 3vh;
}

.searchBar .container {
  width: 0;
  display: flex;
  position: relative;
  transition: width 0.5s;
}
.searchBar .container#active {
  width: 1rem;
}

.searchBar .close {
  position: absolute;
  top: -0.5rem;
}

.searchBar .close:hover {
  fill: var(--gray-2);
}
</style>
