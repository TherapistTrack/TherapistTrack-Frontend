import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useTabs() {
  const tabs = ref([
    {
      id: Math.floor(Math.random() * 100) + 1,
      name: 'New Tab',
      path: '/doctor/records',
      metadata: {}
    }
  ])
  const activeTab = ref(tabs.value[0].id)
  const router = useRouter()

  function addTab(name, path, metadata) {
    let tab = {
      id: Math.floor(Math.random() * 100) + 1,
      name: name,
      path: path,
      metadata: metadata
    }
    openTab(tab)
  }

  function openTab(tab) {
    router.push(tab.path)
    setActiveTab(tab.id)
  }

  function closeTab(tabId) {
    if (tabs.value.length != 1) {
      tabs.value = tabs.value.filter((t) => t.id !== tabId)
      if (activeTab.value === tabId) {
        activeTab.value = tabs.value.length ? tabs.value[0].id : null
      }
    }
  }

  function setActiveTab(tabId) {
    activeTab.value = tabId
  }

  function getActiveTab() {
    let currentTabValue = tabs.value.filter((item) => (item.id = activeTab.value))
    return currentTabValue
  }
  function changeTab(name, path, metadata) {
    let currentTabValue = tabs.value.filter((item) => (item.id = activeTab.value))
    let index = tabs.value.indexOf(currentTabValue)

    tabs.value[index] = {
      name: name,
      path: path,
      metadata: metadata
    }
  }

  return { tabs, activeTab, getActiveTab, addTab, openTab, closeTab, setActiveTab, changeTab }
}
