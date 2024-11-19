<template>
  <div class="tab-container">
    <div class="tab-actions">
      <RiArrowLeftLine color="var(--gray-1)" />
      <RiArrowRightLine color="var(--gray-1)" />
    </div>

    <div
      class="tab-component"
      :id="activeTab == id ? 'active' : ''"
      v-for="(id, key) in Object.keys(tabs)"
      :key="key"
      @click="() => selectTab(id)"
    >
      <p>
        <b>{{ tabs[id].name }}</b>
      </p>
      <span class="close-container" @click.stop>
        <RiCloseLine
          class="close-tab"
          size="1.5rem"
          color="var(--gray-1)"
          @click="() => closeTab(id)"
        />
      </span>
    </div>
    <RiAddLine color="var(--gray-1)" class="add-tab" @click="onAddTab" />
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import { RiCloseLine, RiArrowLeftLine, RiArrowRightLine, RiAddLine } from '@remixicon/vue'
import { useTabStore } from '@/stores/tabStore'

const tabManager = useTabStore()

const activeTab = ref(0)
const tabs = ref({})

onBeforeMount(() => {
  activeTab.value = tabManager.activeTab
  tabs.value = tabManager.tabs
})

const onAddTab = () => {
  tabManager.addTab()
  activeTab.value = tabManager.activeTab
}

const selectTab = (id) => {
  activeTab.value = id
  tabManager.openTab(id)
}

const closeTab = (id) => {
  tabManager.closeTab(id)
  activeTab.value = tabManager.activeTab
  tabs.value = tabManager.tabs
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
  overflow: hidden;
  text-overflow: ellipsis;
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
