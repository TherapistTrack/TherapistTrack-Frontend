<template>
  <router-view
    @hideInfo="onHideInfo"
    @hideComments="onHideComments"
    @showEdit="onShowEdit"
    @hideEdit="onHideEdit"
    @disableSpace="disableSpace"
    @downloadFile="onDownload"
  />
  <div class="page">
    <h1><b></b>{{ fileName }}</h1>
    <div class="info-tab">
      <p class="file-date">{{ createdAt }}</p>
      <div class="file-options">
        <div class="change-file" @click="handlePrevious">
          <RiArrowUpSLine color="var(--gray-1)" />
          <p>Anterior</p>
        </div>
        <div class="option-divider"></div>
        <div class="change-file" @click="handleNext">
          <p>Siguiente</p>
          <RiArrowDownSLine color="var(--gray-1)" />
        </div>
      </div>
      <div class="file-info">
        <div class="info-container" @click="onShowInfo">
          <RiFile3Fill color="var(--gray-1)" />
          <p>Info</p>
        </div>
      </div>
    </div>
    <div class="doc-space">
      <FileVisualizer v-if="ready" :pdf-src="pdfSrc" />
    </div>
  </div>
  <div class="overlay-space" v-if="spaceOverlay"></div>
</template>

<script setup>
import FileVisualizer from './FileVisualizer.vue'
import { RiFile3Fill, RiArrowDownSLine, RiArrowUpSLine } from '@remixicon/vue'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTabStore } from '@/stores/tabStore'
import { useApi } from '@/oauth/useApi'
import { storeToRefs } from 'pinia'
// Emits
// Variables

const { getRequest } = useApi()
const tabManager = useTabStore()
const { activeTab } = storeToRefs(tabManager)
const router = useRouter()
const doctorId = ref('')
const fileId = ref('')
const fileName = ref('')
const createdAt = ref('')
const pdfSrc = ref('')
const ready = ref(false)
const spaceOverlay = ref(false)
// const fileData = ref({})

// On mounted
watch(activeTab, () => {
  getMetada()
  if (fileId.value) {
    getFile()
  }
})

onMounted(async () => {
  let currentTab = tabManager.getActiveTab()
  doctorId.value = currentTab.metadata.doctorId
  fileId.value = currentTab.metadata.fileId
  await getFile()
})
const getMetada = () => {
  let currentTab = tabManager.getActiveTab()
  doctorId.value = currentTab.metadata.doctorId
  fileId.value = currentTab.metadata.fileId
}

const getFile = async () => {
  try {
    let url = `/files?doctorId=${doctorId.value}&fileId=${fileId.value}`
    const response = await getRequest(url, {})
    fileName.value = response.name
    createdAt.value = response.createdAt.split('T')[0]
    pdfSrc.value = response.fileURL
    ready.value = true
  } catch {
    console.log('something went wrong')
  }
}

//Funcions
const handlePrevious = () => {
  console.log('Go to PREVIOUS file')
}

const handleNext = () => {
  console.log('Go to NEXT file')
}
const onShowInfo = () => {
  spaceOverlay.value = true
  router.push(`/doctor/file/${fileId.value}/info`)
}
const onHideInfo = () => {
  spaceOverlay.value = false
  router.push(`/doctor/file/${fileId.value}`)
}

const onDownload = () => {
  const pdfPath = pdfSrc.value
  const newTab = window.open(pdfPath, '_blank')
  const link = document.createElement('a')
  link.href = pdfPath
  link.download = `${fileName.value}.pdf`
  newTab.onload = () => {
    link.click()
  }
}
</script>

<style scoped>
.page {
  width: 100vw;
  height: 100vh;
  height: auto;
  padding: 1rem 3rem 0 3rem;
}
.info-tab {
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.info-tab p {
  color: var(--gray-1);
}

/* date */
.file-date {
  text-align: start;
}
/* Comments */
.file-info {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.comment-container,
.info-container {
  padding: 0.3rem;
  border-radius: 0.4rem;
  display: flex;
  gap: 0.5rem;
  cursor: pointer;
}
.comment-container:hover,
.info-container:hover {
  background-color: var(--gray-3);
}

/* Options Anterior y Siguiente */
.file-options {
  display: flex;
  gap: 0.4rem;
  justify-content: center;
}

.change-file {
  display: flex;
  gap: 0.5rem;
  border-radius: 0.4rem;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.change-file:hover {
  background-color: var(--gray-3);
}

.file-options .change-file:first-child {
  padding-left: 0;
  padding-right: 0.5rem;
}
.file-options .change-file:not(first-child) {
  padding-left: 0.5rem;
}

.option-divider {
  width: 1px;
  height: auto;
  background-color: var(--gray-2);
}

.overlay-space {
  width: 30vw;
  transition: width 0.2s;
}

/* Other */
.doc-space {
  display: flex;
  justify-content: center;
  margin: 1rem 1rem 0 1rem;
}
</style>
