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
    <h1><b></b>{{ name }}</h1>
    <div class="info-tab">
      <p class="file-date">{{ date }}</p>
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
        <div class="comment-container" @click="onShowComments">
          <RiChat2Fill color="var(--gray-1)" />
          <p>Comentarios</p>
        </div>
        <div class="info-container" @click="onShowInfo">
          <RiFile3Fill color="var(--gray-1)" />
          <p>Info</p>
        </div>
      </div>
    </div>
    <div class="doc-space">
      <FileVisualizer />
    </div>
  </div>
</template>

<script setup>
import FileVisualizer from './FileVisualizer.vue'
import { RiFile3Fill, RiChat2Fill, RiArrowDownSLine, RiArrowUpSLine } from '@remixicon/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import test from './test.pdf'

// Emits
const emit = defineEmits(['disableSpace', 'enableSpace'])

// Variables
const router = useRouter()
const date = ref('3-11-20022')
const name = ref('Consulta_1')

// On mounted
//Funcions
const handlePrevious = () => {
  console.log('Go to PREVIOUS file')
}

const handleNext = () => {
  console.log('Go to NEXT file')
}

const onShowComments = () => {
  emit('enableSpace')
  router.push('/file/view/123/comments')
}
const onHideComments = () => {
  router.push('/file/view/123')
}

const onShowInfo = () => {
  emit('enableSpace')
  router.push('/file/view/123/info')
}
const onHideInfo = () => {
  router.push('/file/view/123')
}

const onDownload = () => {
  const pdfPath = test
  const link = document.createElement('a')
  link.href = pdfPath
  link.download = 'test_test.pdf'
  link.click()
}

const onShowEdit = () => {
  router.push('/file/view/123/editInfo')
}
const onHideEdit = () => {
  console.log('/file/view/123/')
}
const disableSpace = () => {
  emit('disableSpace')
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

/* Other */
.doc-space {
  display: flex;
  justify-content: center;
  margin: 1rem 1rem 0 1rem;
}
</style>
