<template>
  <router-view :userId="props.userId" :data="props.data" />
  <div class="overlayContainer" @click="goBack()">
    <div class="view-user" @click.stop="">
      <span v-if="isSetup">
        <div class="top">
          <h1>{{ props.data[props.userId].name }} {{ props.data[props.userId].lastName }}</h1>
          <RiCloseLine
            class-name="icon"
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
            @click="handleOpenEdit(props.userId)"
          />
          <RiDeleteBin7Fill
            class-name="act-delete"
            size="1.5rem"
            color="var(--gray-1)"
            alt="delete"
            @click="onDelete()"
          />
        </div>
        <div class="tableContainer">
          <SimpleTable :data="props.data[props.userId]" :headers="headers" />
        </div>
      </span>
    </div>
  </div>
  <AlertDelete
    v-if="tryDelete"
    :name="`${props.data[props.userId].name} ${props.data[props.userId].lastName}`"
    :on-no="abortDelete"
    :on-yes="handleDelete(data[props.userId].username)"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RiCloseLine, RiDeleteBin7Fill, RiEditBoxLine } from '@remixicon/vue'
import { useRouter } from 'vue-router'
import SimpleTable from '@/components/DataDisplay/Tables/SimpleTable.vue'
import AlertDelete from '@/components/Feedback/Alerts/AlertDelete.vue'
import { useApi } from '@/oauth/useApi'

const { deleteRequest } = useApi()
const localData = ref(null)
const headers = ref(null)
const router = useRouter()
const selected = ref(0)
const isSetup = ref(false)
const tryDelete = ref(false)

const props = defineProps({
  userId: String,
  data: Object
})

onMounted(() => {
  if (props.data === null || props.data === undefined) {
    router.push('/admin/user/')
  } else {
    isSetup.value = true
  }
})

headers.value = {
  role: 'Rol',
  phones: 'Teléfonos',
  collegiateNumber: 'No. Colegiado',
  mails: 'Correo'
}
localData.value = props.data

const handleOpenEdit = (key) => {
  selected.value = key
  router.push(`/admin/user/edit/${key}`)
}
const onDelete = () => {
  tryDelete.value = true
}
const handleDelete = async (usernameValue) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    await deleteRequest('/users/delete', { username: `${usernameValue}` })
  } catch {
    console.error('Cannot delete')
  }
}
const abortDelete = () => {
  tryDelete.value = false
}
const goBack = () => {
  router.push('/admin/user/')
}
</script>

<style scoped>
.icon,
.act-edit,
.act-delete {
  cursor: pointer;
  max-height: 5vh;
  transition: fill 0.1s;
}

.act-edit:hover {
  fill: var(--yellow-1);
}
.act-delete:hover {
  fill: var(--red-1);
}

.overlayContainer {
  background-color: rgba(0, 0, 0, 0.4);
  height: 100%;
  width: 100%;
  z-index: 300;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.view-user {
  z-index: 400;
  background-color: white;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 2.5vh;
  width: 600px;
  max-height: 80vh;
  padding: 2rem;
  margin: 2vh;
}

.top {
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.75rem;
}

.tableContainer {
  padding: 0.6rem;
}

.overlayContainer .top img:hover {
  background-color: var(--vt-c-light-gray-1);
}

.overlayContainer .grid-row:has(+ .grid-row) {
  border-bottom: 0.2vh solid #ccc;
}

.overlayContainer .grid-row {
  margin-bottom: 2vh;
  overflow-y: hide;
}

.actions {
  display: flex;
  gap: 4vw;
  padding-bottom: 1rem;
}

.actions *:hover {
  background-color: var(--vt-c-light-gray-1);
}

.overlayContainer .grid-row {
  color: var(--vt-c-dark-1);
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
