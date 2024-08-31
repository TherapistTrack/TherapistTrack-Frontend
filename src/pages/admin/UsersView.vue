<template>
  <div class="page">
    <router-view :userId="`${selected}`" :data="fetchedData" />
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
import { useApi } from '@/oauth/useApi'
import users from './users.json'

const { getRequest } = useApi()
const selected = ref(0)
const fetchedData = ref(null)
const headers = ref(null)
const router = useRouter()
const loading = ref(false)

headers.value = {
  name: 'Nombre',
  role: 'Rol'
}

onMounted(async () => {
  loading.value = true
  try {
    fetchedData.value = await getRequest('/users/list')
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 500))
    fetchedData.value = users
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
  router.push(`/admin/user/view/${key}`)
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
