<template>
  <div class="page">
    <router-view :id="selected" />
    <h1><b>Usuarios</b></h1>
    <p>
      En esta vista puede administrar a los usuarios que tienen acceso a la aplicación y editar su
      información.
    </p>

    <div class="options">
      <CustomInput :pholder="'Buscar por nombre'" />
      <Button :msg="'Nuevo'" :onClick="handleOpenCreate" />
    </div>

    <DisplayTable
      :data="fetchedData"
      :headers="headers"
      :loading="loading"
      :onClick="handleOpenView"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Button from '@/components/Buttons/ButtonSimple.vue'
import CustomInput from '@/components/Forms/InputField/SearchBar.vue'
import DisplayTable from '@/components/DataDisplay/Tables/DisplayTable.vue'
import { useRouter } from 'vue-router'

const selected = ref(0)
const fetchedData = ref(null)
const loading = ref(false)
const headers = ref(null)
const router = useRouter()
headers.value = {
  nombre: 'Nombre',
  rol: 'Rol'
}

onMounted(async () => {
  loading.value = true
  // simulation time
  await new Promise((resolve) => setTimeout(resolve, 500))

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

// Functions

const handleOpenCreate = () => {
  router.push('/admin/user/create')
}

const handleOpenView = (key) => {
  selected.value = key
  router.push(`/admin/user/view${key}`)
}
</script>

<style>
#app {
  display: flex;
  flex-direction: row;
  background-color: white;
  font-family: 'MotivaSansMedium';
}

.page {
  padding: 5vw;
  padding-top: 8vh;
  width: 80vw;
}

.options {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 5vh 0 3vh 0;
}

p {
  font-weight: lighter;
  font-size: small;
}
@media (max-aspect-ratio: 4/7) {
  .options {
    flex-direction: column;
    align-items: start;
    gap: 2vh;
  }
}
</style>
