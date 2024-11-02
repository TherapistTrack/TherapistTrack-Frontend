<template>
  <div class="doc-view">
    <div class="doc-head" :id="idConfig.viewerHeader">
      <RiAddLine @click="zoomIn" class="icon" size="1.5rem" color="white" :id="idConfig.zoomIn" />

      <select class="zoom" :id="idConfig.zoom" disabled="true">
        <option v-for="n in Array.from({ length: 60 }, (_, i) => i + 1)" :key="n" :value="n / 10">
          {{ n * 10 }}%
        </option>
      </select>
      <RiSubtractLine
        @click="zoomOut"
        class="icon"
        size="1.5rem"
        color="white"
        :id="idConfig.zoomOut"
      />
      <RiExpandDiagonalLine
        class="icon"
        size="1.2rem"
        color="white"
        :id="idConfig.presentationMode"
      />
    </div>
    <div class="doc-body">
      <VuePdfApp
        :pdf="pdfSrc"
        :id-config="idConfig"
        :config="{ toolbar: false }"
        :page-number="1"
        v-model:page-scale="scale"
      />
    </div>
  </div>
</template>

<script setup>
import { RiAddLine, RiSubtractLine, RiExpandDiagonalLine } from '@remixicon/vue'
import { ref, watch } from 'vue'
import test from './test.pdf'
import VuePdfApp from 'vue3-pdf-app'

const scale = ref('60')
watch(
  scale,
  () => {
    console.log(scale)
  },
  { deep: true }
)

const idConfig = {
  zoomIn: 'zoomInId',
  zoomOut: 'zoomOutId',
  viewerHeader: 'vieweHeaderId',
  presentationMode: 'presentationModeId',
  zoom: 'scaleSelect'
}

const pdfSrc = ref(test)
</script>

<style scoped>
.zoom {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 2.3rem;
  border: none;
  background-color: var(--blue-1);
  color: white;
}
.doc-view {
  width: 80%;
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
  height: 65vh;
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
