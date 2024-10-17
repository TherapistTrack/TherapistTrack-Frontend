<template>
  <div class="view-file">
    <h1>Consulta 1</h1>
    <div class="info-tab">
      <p>3/11/202</p>
      <div>anterior | Siguiente</div>
      <div>Comentarios</div>
      <div>info</div>
    </div>
    <div class="doc-space">
      <FileVisualizer />
    </div>
  </div>
</template>

<script setup>
import FileVisualizer from './FileVisualizer.vue'
</script>

<style scoped>
.view_file {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.info-tab {
  padding: 1rem;
  width: 100vw;
  display: flex;
  justify-content: space-between;
}

.doc-space {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 1rem;
}
</style>
