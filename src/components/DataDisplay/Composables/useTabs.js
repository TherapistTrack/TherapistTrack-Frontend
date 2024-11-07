import { ref } from 'vue'

export function useTabs() {
  const tabs = ref([])
  const activeTab = ref(null)

  function newTab() {
    let currentNames = tabs.value.map((item) => item.name)
    console.log(currentNames)
    if (!currentNames.includes('Home')) {
      let tab = {
        id: Math.floor(Math.random() * 100) + 1,
        name: 'Home',
        path: '/record/main',
        metadata: {}
      }
      openTab(tab)
    } else {
      let tab = {
        id: Math.floor(Math.random() * 100) + 1,
        name: 'New Tab',
        path: '/record/main',
        metadata: {}
      }
      openTab(tab)
    }
  }
  function openTab(tab) {
    if (!tabs.value.some((t) => t.id === tab.id)) {
      tabs.value.push(tab)
    }
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

  return { tabs, activeTab, newTab, openTab, closeTab, setActiveTab }
}
