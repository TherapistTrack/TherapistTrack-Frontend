<template>
  <router-view
    :doctorId="doctorId"
    :recordId="recordId"
    @goToSelect="goToSelect"
    @goToForm="goToForm"
    @goToFiles="goToFiles"
    @goToDoing="goToDoing"
    @goToFinish="goToFinish"
    @goToStart="returnToStart"
  />
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUploadStore } from '@/stores/uploadStore'

const uploadStore = useUploadStore()
const router = useRouter()

onMounted(() => {
  uploadStore.files = []
  goToFiles()
  console.log(uploadStore.recordId, uploadStore.doctorId)
})

const goToFiles = () => {
  router.push(`/upload/files`)
}

const goToSelect = () => {
  router.push(`/upload/select`)
}
const goToForm = () => {
  router.push(`/upload/form`)
}

const goToDoing = () => {
  router.push(`/upload/doing`)
}

const goToFinish = () => {
  router.push(`/upload/finish`)
}

const returnToStart = () => {
  router.push('/doctor')
}
</script>

<style scoped></style>
