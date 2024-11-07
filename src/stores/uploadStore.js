import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUploadStore = defineStore('upload', () => {
  const files = ref([]) // Almacena archivos seleccionados

  // Establece los archivos seleccionados
  function setFiles(selectedFiles) {
    // Nombre corregido a setFiles
    files.value = selectedFiles
  }

  // Agrega más archivos
  function addFiles(newFiles) {
    files.value.push(...newFiles)
  }

  // Limpia la lista de archivos
  function clearFiles() {
    files.value = []
  }

  return {
    files,
    setFiles, // Nombre corregido a setFiles
    addFiles,
    clearFiles
  }
})
