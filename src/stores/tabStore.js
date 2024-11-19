import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useTabStore = defineStore('tab-store', () => {
  // Storing value
  const tabs = ref({
    [Math.floor(Math.random() * 100) + 1]: {
      name: 'New Tab',
      path: '/doctor/records',
      metadata: {}
    }
  })

  const activeTab = ref(Object.keys(tabs.value)[0])
  const router = useRouter()

  // Functions
  function changeTab(name, path, metadata) {
    tabs.value[activeTab.value] = {
      name: name,
      path: path,
      metadata: metadata
    }
    router.push(path)
  }

  function addTab() {
    let id = Math.floor(Math.random() * 100) + 1
    tabs.value[id] = {
      name: `New Tab ${Object.keys(tabs.value).length}`,
      path: '/doctor/records',
      metadata: {}
    }
    openTab(id)
  }

  function getActiveTab() {
    let active = tabs.value[activeTab.value]
    return active
  }

  function openTab(id) {
    activeTab.value = id
    let path = tabs.value[id].path
    router.push(path)
  }

  function closeTab(tabId) {
    let len = Object.keys(tabs.value)
    if (len == 1) {
      ;() => {}
    } else {
      if (tabId == activeTab.value) {
        let new_active = Object.keys(tabs.value).filter((item) => item != tabId)[0]
        activeTab.value = new_active
        delete tabs.value[tabId]
      } else {
        delete tabs.value[tabId]
      }
    }
  }

  function setActiveTab(tabId) {
    activeTab.value = tabId
  }

  return { tabs, activeTab, getActiveTab, addTab, openTab, closeTab, setActiveTab, changeTab }
})
