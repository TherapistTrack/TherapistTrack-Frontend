<template>
  <div class="patient-template-list">
    <h1>Pacientes</h1>
    <p>
      En esta vista puede administrar a los usuarios que tienen acceso a la aplicación y editar su
      información.
    </p>
    <SearchBar pholder="Buscar por nombre..." v-model="searchQuery" />
    <YourTableComponent :data="filteredPatients" :headers="tableHeaders" @click="handleClick" />
    <button @click="createNewTemplate">Nuevo</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SearchBar from '@/components/Forms/SearchBar.vue'
import YourTableComponent from '@/components/DataDisplay/Tables/YourTableComponent.vue'

const searchQuery = ref('')
const patients = ref([
  { id: '1', name: 'Plantilla Infante', createdAt: '02/3/2025' },
  { id: '2', name: '2024-Adulto-v1', createdAt: '10/5/2024' },
  { id: '3', name: '2016-Adulto-v0', createdAt: '30/6/2016' }
])

const tableHeaders = {
  name: 'Nombre',
  createdAt: 'Creado el'
}

const filteredPatients = computed(() => {
  if (!searchQuery.value) return patients.value
  return patients.value.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function handleClick(key) {
  console.log('Fila seleccionada:', key)
}

function createNewTemplate() {
  console.log('Crear nueva plantilla de paciente')
}
</script>

<style scoped>
.patient-template-list {
  padding: 2rem;
}

button {
  background-color: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}
</style>
