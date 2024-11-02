<template>
  <div class="file-overlay-container" :id="anim ? 'init' : ''">
    <div class="file-info" ref="myDiv">
      <div class="top">
        <h2>Información</h2>
        <RiCloseLine
          class-name="close"
          size="2rem"
          color="var(--gray-2)"
          alt="close"
          @click="goBack()"
        />
      </div>
      <div class="actions">
        <RiEditBoxLine
          class-name="act-edit"
          size="1.5rem"
          color="var(--gray-1)"
          alt="edit"
          @click="handleOpenEdit()"
        />
        <RiDeleteBin7Fill
          class-name="act-delete"
          size="1.5rem"
          color="var(--gray-1)"
          alt="delete"
          @click="handleDelete()"
        />
        <RiDownload2Fill
          class-name="act-download"
          size="1.5rem"
          color="var(--gray-1)"
          alt="delete"
          @click="handleDownload()"
        />
      </div>
      <div class="mid">
        <SimpleTable :data="fileData" :headers="Object.keys(fileData)" :isSet="true" />
      </div>
    </div>
  </div>
  <AlertDelete
    v-if="tryDelete"
    :name="`${fileData['Nombre']}`"
    :on-no="abortDelete"
    :on-yes="onDelete"
    :type="'file'"
  />
</template>

<script setup>
import { RiCloseLine, RiEditBoxLine, RiDeleteBin7Fill, RiDownload2Fill } from '@remixicon/vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import SimpleTable from '@/components/DataDisplay/Tables/SimpleTable.vue'
import AlertDelete from '@/components/Feedback/Alerts/AlertDelete.vue'

// Emits
const emit = defineEmits(['hideInfo', 'showEdit', 'disableSpace', 'downloadFile'])

// Variables
const myDiv = ref(null)
const anim = ref(false)
const fileData = ref({})
const tryDelete = ref(false)

//  FUNCTIONS
// On Mounted
onMounted(() => {
  setTimeout(() => {
    anim.value = true
    document.addEventListener('click', handleClickOutside)
  }, 2)
  setTimeout(() => {
    fileData.value = {
      fileId: '6612a3f50ba023',
      Nombre: 'Consulta_1',
      Páginas: '2',
      Categoría: 'Prueba Psicometrica'
    }
  }, 250)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside) // Step 4: Remove event listener on unmount
})

// Open Edit
const handleOpenEdit = () => {
  emit('showEdit')
}
const handleDownload = () => {
  emit('downloadFile')
}

// Navigation
const goBack = () => {
  anim.value = false
  emit('disableSpace')
  setTimeout(() => {
    emit('hideInfo')
  }, 250)
}
const handleClickOutside = (event) => {
  // Closing event
  if (myDiv.value && !myDiv.value.contains(event.target)) {
    goBack()
  }
}

// Delete Operations
const handleDelete = () => {
  tryDelete.value = true
}
const abortDelete = () => {
  tryDelete.value = false
}
const onDelete = () => {
  console.log('SE ELIMINA')
  tryDelete.value = false
  goBack()
}
</script>

<style scoped>
.file-overlay-container {
  position: absolute;
  height: 100%;
  display: flex;
  right: -320px;
  top: 0;
  align-items: center;
  transition: right 0.2s;
}

.file-overlay-container#init {
  right: 0;
}
.file-info {
  height: 95%;
  width: 300px;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem 0 0 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.file-info .top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.file-info .actions {
  padding-top: 1rem;
  display: flex;
  gap: 1.2rem;
  padding-bottom: 1rem;
}

.close,
.act-edit,
.act-delete,
.act-download {
  cursor: pointer;
}
.act-edit:hover {
  fill: var(--yellow-1);
}
.act-delete:hover {
  fill: var(--red-1);
}
.act-download:hover {
  fill: var(--blue-1);
}

.mid {
  padding: 1rem;
}
</style>
