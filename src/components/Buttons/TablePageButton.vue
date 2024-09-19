<template>
  <div class="ts-component">
    <div class="table-nav">
      <RiArrowLeftSLine
        color="var(--blue-1)"
        class="icon"
        size="1.5rem"
        @click="handleDown"
        :id="currentPage === 1 ? 'disabled' : ''"
      />
      <div v-for="n in pageCount" :key="n">
        <p class="page-num" :id="n === currentPage ? 'selected' : ''" @click="handleClick(n)">
          {{ n }}
        </p>
      </div>
      <RiArrowRightSLine
        class="icon"
        size="1.5rem"
        color="var(--blue-1)"
        @click="handleUp"
        :id="currentPage === pageCount ? 'disabled' : ''"
      />
    </div>
    <span class="rows">
      <p>No. Filas</p>
      <span class="limiter">
        <InputFieldSimple :type="'number'" v-model:model-value="localMaxPage" />
      </span>
    </span>
  </div>
</template>

<script setup>
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/vue'
import InputFieldSimple from '../Forms/InputField/InputFieldSimple.vue'
import { ref, watch } from 'vue'
const emit = defineEmits(['updateCurrentPage', 'updateMax'])

const props = defineProps({
  pageCount: Number,
  currentPage: Number,
  maxPage: Number
})
const localMaxPage = ref(props.maxPage)

watch(localMaxPage, () => {
  try {
    if (parseInt(localMaxPage.value) > 0) {
      emit('updateMax', localMaxPage.value)
    }
  } catch {
    ;() => {}
  }
})

const handleClick = (key) => {
  if (key !== props.currentPage) {
    emit('updateCurrentPage', key)
  }
}

const handleUp = () => {
  if (props.currentPage + 1 <= props.pageCount) {
    let newPage = props.currentPage + 1
    emit('updateCurrentPage', newPage)
  }
}

const handleDown = () => {
  if (props.currentPage - 1 > 0) {
    let newPage = props.currentPage - 1
    emit('updateCurrentPage', newPage)
  }
}
</script>

<style>
.ts-component {
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
  gap: 5rem;
}
.rows {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.limiter * {
  max-width: 4rem;
  padding: 0.5rem;
}
.rows p {
  display: inline-block;
  font-size: 0.8rem;
}
.table-nav {
  display: flex;
  padding: 0.3rem;
  gap: 0.2rem;
  width: fit-content;
}

.table-nav .icon {
  background-color: var(--white);
  border-radius: 0.2rem;
}

.table-nav .page-num {
  display: flex;
  justify-content: center;
  height: 1.5rem;
  width: 1.5rem;
  padding: 0.2em;
  background-color: var(--white);
  border-radius: 0.2rem;
  transition: all 0.2s;
  color: var(--blue-1);
  align-items: center;
  font-size: small;
}
.table-nav .page-num#selected {
  background-color: var(--blue-1);
  color: white;
}

.table-nav .page-num:hover {
  background-color: var(--gray-4);
  color: var(--dark-blue-1);
  cursor: pointer;
}
</style>
