<template>
  <div class="page">
    <h1>Usuarios</h1>
    <p>
      En esta vista puede administrar a los usuarios que tienen acceso a la aplicación y editar su
      información.
    </p>
    <br />
    <div class="options">
      <CustomInput :pholder="'Buscar por nombre'" />
      <Button :mssg="'Nuevo'" :onClick="clork" />
    </div>
    <div class="grid-container">
      <div class="grid-row">
        <p class="grid-header">Nombre</p>
        <p class="grid-header">Rol</p>
      </div>
      <div v-if="loading">
        <DataLoader />
      </div>

      <div
        class="grid-row"
        v-for="(item, key) in fetchedData"
        :key="key"
        @click="handleOpenView(key)"
      >
        <div class="grid-item">{{ item.nombre }}</div>
        <div class="grid-item">{{ item.rol }}</div>
      </div>
    </div>
  </div>
  <div v-if="modalOpen">
    <ViewUser :data="fetchedData[selected] || { nombre: 'Rayo' }" @closeView="handleCloseView" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import '@/assets/arrow-left-double-fill.svg'
import Button from '@/components/Buttons/ButtonSimple.vue'
import CustomInput from '@/components/Forms/InputField/CustomInput.vue'
import DataLoader from '@/components/Feedback/Spinner/DataLoader.vue'
import ViewUser from '@/pages/admin/ViewUser.vue'

const modalOpen = ref(false)
const selected = ref(0)
const fetchedData = ref(null)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  // simulation time
  await new Promise((resolve) => setTimeout(resolve, 5000))

  // fetchData for when the backend gets deployed
  // fetchedData.value = await fetchData();
  fetchedData.value = {
    1: {
      nombre: 'Daniel Rayo',
      rol: 'Doctor',
      telefonos: ['555 555', '222 222'],
      numColegiado: 32115,
      correos: ['aaa@gmail.com', 'bbb@gmail.com']
    },
    2: {
      nombre: 'Sofia de la Rosa',
      rol: 'Doctor',
      telefonos: ['444 444', '333 333'],
      numColegiado: 53515,
      correos: ['ccc@gmail.com', 'ddd@gmail.com']
    },
    3: {
      nombre: 'Ricardo Morales Sagastume',
      rol: 'Asistente',
      telefonos: ['111 111', '777 777'],
      numColegiado: null,
      correos: ['eee@gmail.com']
    }
  }
  loading.value = false
  return fetchedData
})

const clork = () => {
  console.log('Button pressed')
}

const handleCloseView = () => {
  modalOpen.value = false
}

const handleOpenView = (key) => {
  selected.value = key
  modalOpen.value = true
}
</script>

<style>
#app {
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  background-color: white;
  font-family: 'MotivaSansMedium';
}

.page {
  padding: 2rem;
  padding-top: 3rem;
}

.options {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

h1,
p,
h2,
ul {
  color: black;
}

.page p {
  font-weight: lighter;
  font-size: small;
  color: var(--vt-c-dark-gray-1);
}

.grid-container {
  display: grid;
  grid-template-columns: auto;
  /* Two columns */
  color: var(--vt-c-dark-1);
  padding: 1rem;
}

.grid-row {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.page .grid-header,
.page .grid-item {
  padding: 0.5rem;
  border-bottom: 0.2vh solid #ccc;
}

.page .grid-header {
  font-family: 'MotivaSansLighter';
  border-top: 0.2vh solid #ccc;
  font-weight: bold;
}

.page .grid-item + .grid-item {
  border-left: 1px solid #ccc;
}

.page .grid-row:hover {
  background-color: var(--accent-light);
  cursor: pointer;
}
</style>
