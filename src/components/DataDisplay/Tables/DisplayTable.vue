<template>
  <div class="table-component">
    <div class="table-container">
      <div class="header-row">
        <span
          class="header-item"
          @contextmenu.prevent="handleRightClick(item)"
          v-for="(item, key) in headers"
          :key="key"
        >
          <HideButton
            v-if="headerHide[item]"
            :on-click-outside="hideAll"
            :on-click="() => handleHide(item)"
          />
          <TypeIconLoader :icon-type="fields[item].type" />
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
          v-for="(item, key) in localData"
          :key="key"
          @click="handleClick(key)"
        >
          <p class="table-item" v-for="(elem, key) in headers" :key="key">
            {{ item[elem] }}
          </p>
        </div>
      </div>
    </div>
    <TablePageButton
      :page-count="pageCount"
      v-model:current-page="currentPage"
      v-model:max-page="maxPage"
      @update-pager="updatePager"
    />
  </div>
</template>

<script setup>
import DataLoader from '@/components/Feedback/Spinner/DataLoader.vue'
import { RiAlertFill } from '@remixicon/vue'
import HideButton from '@/components/Buttons/HideButton.vue'
import { ref, watchEffect } from 'vue'
import TablePageButton from '@/components/Buttons/TablePageButton.vue'
import TypeIconLoader from '@/assets/TypeIcons/TypeIconLoader.vue'
const emit = defineEmits(['hideHeader', 'updatePage'])
const props = defineProps({
  loading: Boolean,
  onClick: Function,
  data: Object,
  headers: Array,
  success: Boolean,
  currentPage: Number,
  pageLimit: Number,
  recordCount: Number,
  fields: Object
})

const localData = ref(null)
const headerHide = ref({})
const pageCount = ref(0)
const currentPage = ref(props.currentPage)
const maxPage = ref(props.pageLimit)
props.headers.map((value) => {
  headerHide.value[value] = false
})
watchEffect(() => {
  if (!props.loading) {
    localData.value = [...props.data]
    pageCount.value = Math.ceil(props.recordCount / maxPage.value)
  }
})

const updatePager = (pager) => {
  maxPage.value = pager[0]
  currentPage.value = pager[1]
  emit('updatePage', [maxPage.value, currentPage.value])
}

function handleClick(key) {
  props.onClick(key)
}
const handleHide = (key) => {
  hideAll()
  emit('hideHeader', key)
}

const hideAll = () => {
  for (let head in headerHide.value) {
    headerHide.value[head] = false
  }
}

const handleRightClick = (key) => {
  if (Object.values(headerHide.value).includes(true)) {
    hideAll()
    headerHide.value[key] = !headerHide.value[key]
  } else {
    headerHide.value[key] = !headerHide.value[key]
  }
}
</script>

<style scoped>
.table-component {
  display: grid;
}
.table-container {
  display: flex;
  flex-direction: column;
  font-family: 'MotivaSansLighter';
  /* Two columns */
  font-size: 2vh;
  overflow-x: scroll;
  max-height: 315px;
}

.table-container .header-row,
.table-container .table-row {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  grid-auto-flow: column;
}

.table-container .header-row {
  /* border-top: 0.2vh solid #ccc; */
  color: var(--gray-1);
}

.table-container .table-scrollable {
  max-height: 50vh;
}
.table-container .table-row {
  color: var(--black);
  font-weight: bold;
}

.table-container .header-item,
.table-container .table-item {
  min-width: 120px;
  padding: 0.5rem;
  border-bottom: 0.2vh solid #ccc;
}

.table-container .header-item {
  color: var(--gray-1);
  position: relative;
  display: flex;
  gap: 0.5rem;
}

.table-container .table-item {
  color: var(--black);
  font-weight: bold;
  transition: background-color 0.1s;
  overflow-x: hidden;
  overflow-y: initial;
  text-overflow: ellipsis;
  max-height: 40px;
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
