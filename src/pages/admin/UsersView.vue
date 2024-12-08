<template>
  <OverlayLoader v-if="loading2" />
  <div class="page">
    <router-view
      :userId="`${selected}`"
      v-model:data="currentUser"
      @updateData="updateData"
      @openEdit="handleOpenEdit"
      @triggerToast="triggerToast"
    />
    <h1><b>Usuarios</b></h1>
    <p>
      En esta vista puede administrar a los usuarios que tienen acceso a la aplicación y editar su
      información.
    </p>

    <div class="options">
      <CustomInput :pholder="'Buscar por nombre'" v-model:search-value="search" />
      <Button :msg="'Nuevo'" :onClick="handleOpenCreate" :color="'green'" />
    </div>

    <DisplayTable
      :data="processedData"
      :headers="headers"
      :loading="loading"
      :success="success"
      @rowClick="handleOpenView"
    />
  </div>
</template>

<script setup>
import OverlayLoader from '@/components/Feedback/Spinner/OverlayLoader.vue'
import { ref, onMounted, watch } from 'vue'
import Button from '@/components/Buttons/ButtonSimple.vue'
import CustomInput from '@/components/Forms/InputField/SearchBar.vue'
import DisplayTable from '@/components/DataDisplay/Tables/SetDisplayTable.vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/oauth/useApi'
const { getRequest } = useApi()
const selected = ref('')
const fetchedData = ref(null)
const processedData = ref(null)
const headers = ref(null)
const router = useRouter()
const loading = ref(false)
const currentUser = ref(null)
const loading2 = ref(false)
const success = ref(false)
const search = ref('')

const emit = defineEmits(['addToast'])
const triggerToast = (type, mssg) => {
  let toast = { type: type, content: mssg }
  emit('addToast', toast)
}

const updateData = async () => {
  apiCall()
}
const handleOpenEdit = () => {
  router.push(`/admin/user/edit/${selected.value}`)
}
watch(search, () => {
  if (search.value === '' || search.value === undefined) {
    processedData.value = fetchedData.value
  } else {
    // Apply search
    processedData.value = applySearch(fetchedData.value, search.value)
  }
})
headers.value = {
  names: 'Nombre',
  role: 'Rol'
}

const getCurrentUser = async () => {
  loading2.value = true
  try {
    const response = await getRequest(`/users/${selected.value}`)
    currentUser.value = response.data
  } catch {
    triggerToast(0, `No se pudo obtener el usuario con id ${selected.value}`)
  }
  loading2.value = false
}

const apiCall = async () => {
  loading.value = true
  try {
    const response = await getRequest('/users/list')
    fetchedData.value = response.users
    processedData.value = response.users
    success.value = true
    search.value = ''
    triggerToast(1, 'Usuarios fueron exitosamente obtenidos')
  } catch {
    triggerToast(0, 'No se pudieron obtener los usuarios disponibles')
  }
  loading.value = false
}

onMounted(async () => {
  apiCall()
})

const handleOpenCreate = () => {
  router.push('/admin/user/create')
}

const handleOpenView = async (key) => {
  selected.value = key.id
  await getCurrentUser()
  router.push(`/admin/user/view/${selected.value}`)
}

const applySearch = (originalData, value) => {
  const processed = ref(null)
  processed.value = originalData.filter(
    (item) => item.names !== undefined && item.names.toLowerCase().includes(value.toLowerCase())
  )
  return processed.value
}
</script>

<style>
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
