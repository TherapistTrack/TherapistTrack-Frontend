<template>
  <OverlayLoader v-if="loading2" />
  <div class="page">
    <router-view :userId="`${selected}`" v-model:data="currentUser" v-model:openEdit="openEdit" />
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
import OverlayLoader from '@/components/Feedback/Spinner/OverlayLoader.vue'
import { ref, onMounted, watch } from 'vue'
import Button from '@/components/Buttons/ButtonSimple.vue'
import CustomInput from '@/components/Forms/InputField/SearchBar.vue'
import DisplayTable from '@/components/DataDisplay/Tables/DisplayTable.vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/oauth/useApi'
import users from './users.json'
const openEdit = ref(false)
const { getRequest } = useApi()
const selected = ref('')
const fetchedData = ref(null)
const headers = ref(null)
const router = useRouter()
const loading = ref(false)
const currentUser = ref(null)
const loading2 = ref(false)

watch(openEdit, () => {
  console.log(selected.value)
  if (openEdit.value == true) {
    handleOpenEdit(selected.value)
  } else {
    apiCall()
  }
})

headers.value = {
  names: 'Nombre',
  lastNames: 'Apellidos'
}

const getCurrentUser = async () => {
  loading2.value = true
  try {
    const response = await getRequest(`/users/${selected.value}`)
    currentUser.value = response.data
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 500))
    currentUser.value = users
  }
  loading2.value = false
}

const apiCall = async () => {
  loading.value = true
  try {
    const response = await getRequest('/users/list')
    fetchedData.value = response.users
  } catch {
    // Oops ocurrio un error :/
  }
  loading.value = false
  return fetchedData
}

onMounted(async () => {
  apiCall()
})

// Functions

const handleOpenCreate = () => {
  router.push('/admin/user/create')
}
const handleOpenEdit = (key) => {
  router.push(`/admin/user/edit/${key}`)
}
const handleOpenView = async (key) => {
  selected.value = fetchedData.value[key].id
  await getCurrentUser()
  router.push(`/admin/user/view/${fetchedData.value[key].id}`)
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
  padding: 2rem 3rem 0 3rem;
  width: 90%;
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
