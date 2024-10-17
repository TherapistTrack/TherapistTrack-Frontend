<template>
  <div class="doc-view">
    <div class="doc-head" :id="idConfig.viewerHeader">
      <RiAddLine class="icon" size="1.5rem" color="white" @click="zoomIn" :id="idConfig.zoomIn" />
      <p>{{ scale }}%</p>
      <RiSubtractLine
        class="icon"
        size="1.5rem"
        color="white"
        @click="zoomOut"
        :id="idConfig.zoomOut"
      />
      <RiExpandDiagonalLine size="1.2rem" color="white" />
    </div>
    <div class="doc-body">
      <VuePdfApp
        :pdf="pdfSrc"
        :id-config="idConfig"
        :config="{ toolbar: true }"
        :page-scale="page - width"
        :page-number="1"
      />
    </div>
  </div>
</template>

<script setup>
import { RiAddLine, RiSubtractLine, RiExpandDiagonalLine } from '@remixicon/vue'
import { ref } from 'vue'
import test from './test.pdf'
import VuePdfApp from 'vue3-pdf-app'

const idConfig = {
  zoomIn: 'zoomInId',
  zoomOut: 'zoomOutId',
  viewerHeader: 'vieweHeaderId'
}

const scale = ref(100)
const pdfSrc = ref(test)
const zoomIn = () => {
  scale.value += 5
}
const zoomOut = () => {
  scale.value -= 5
}
</script>

<style scoped>
.doc-view {
  width: 70%;
  justify-content: center;
}

.doc-head {
  background-color: var(--blue-1);
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 1rem 1rem 0 0;
}
.doc-head p {
  color: white;
}

.doc-body {
  background-color: var(--white);
  padding: 1rem;
  height: 70vh;
  overflow-x: scroll;
}

.icon {
  cursor: pointer;
}

.pdf-app.dark,
.pdf-app.light {
  --pdf-app-background-color: var(--white);
}
</style>
