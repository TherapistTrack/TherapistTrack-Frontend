import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUploadStore = defineStore('upload-store', () => {
  const files = ref([]) // Almacena archivos seleccionados
  const recordId = ref('')
  const doctorId = ref('')

  function setDoctor(doctor) {
    doctorId.value = doctor
  }
  function setRecord(record) {
    recordId.value = record
  }
  // Establece los archivos seleccionados
  function setFiles(selectedFiles) {
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
    recordId,
    doctorId,
    setFiles, // Nombre corregido a setFiles
    addFiles,
    clearFiles,
    setDoctor,
    setRecord
  }
})
