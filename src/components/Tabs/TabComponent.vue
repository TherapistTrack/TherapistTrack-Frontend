<template>
  <div class="tab-container">
    <div class="tab-actions">
      <RiArrowLeftLine color="var(--gray-1)" />
      <RiArrowRightLine color="var(--gray-1)" />
    </div>

    <div
      class="tab-component"
      :id="activeTab == tab.id ? 'active' : ''"
      v-for="(tab, key) in tabs"
      :key="key"
      @click="() => selectTab(tab.id)"
    >
      <p>
        <b>{{ tab.name }}</b>
      </p>
      <span class="close-container" @click.stop>
        <RiCloseLine
          class="close-tab"
          size="1.5rem"
          color="var(--gray-1)"
          @click="() => closeTab(tab.id)"
        />
      </span>
    </div>
    <RiAddLine color="var(--gray-1)" class="add-tab" @click="onAddTab" />
  </div>
</template>

<script setup>
import { onBeforeMount, ref, toRaw, watch } from 'vue'
import { RiCloseLine, RiArrowLeftLine, RiArrowRightLine, RiAddLine } from '@remixicon/vue'

import { inject } from 'vue'
const tabManager = inject('tabManager')

watch(
  tabManager.tabs,
  () => {
    tabs.value = toRaw(tabManager.tabs.value)
  },
  { deep: true }
)
watch(
  tabManager.activeTab,
  () => {
    activeTab.value = toRaw(tabManager.activeTab.value)
  },
  { deep: true }
)

const activeTab = ref(null)
const tabs = ref([])

onBeforeMount(() => {
  let _tabs = toRaw(tabManager.tabs.value)
  if (_tabs.length == 0) {
    tabManager.newTab()
  }
  tabs.value = tabManager.tabs.value
  activeTab.value = tabManager.activeTab.value
})

const onAddTab = () => {
  tabManager.newTab()
}

const selectTab = (id) => {
  console.log(id)
  tabManager.setActiveTab(id)
  activeTab.value = id
}

const closeTab = (id) => {
  tabManager.closeTab(id)
}
</script>

<style scoped>
.tab-container {
  width: 100%;
  height: 2.5rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.tab-actions {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  border-right: 1px solid var(--gray-4);
  height: 100%;
}
.tab-actions * {
  border-radius: 0.2rem;
  cursor: pointer;
}
.tab-component {
  border-radius: 0.4rem 0.4rem 0 0;
  display: flex;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  height: 100%;
  gap: 0.6rem;
}

.tab-component#active {
  background-color: white;
}

.close-container {
  display: flex;
  align-items: center;
}

.tab-component b {
  font-size: smaller;
  color: var(--gray-1);
  overflow: hidden;
  text-overflow: ellipsis;
}

.close-tab,
.add-tab {
  cursor: pointer;
}
</style>
