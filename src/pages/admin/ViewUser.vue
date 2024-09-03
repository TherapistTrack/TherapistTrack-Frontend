<template>
  <span>
    <div class="overlayContainer" @click="goBack()">
      <div class="view-user" @click.stop="">
        <div class="top">
          <h1>{{ userData.names }} {{ userData.lastNames }}</h1>
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
          <SimpleTable :data="userData" :headers="headers" />
        </div>
      </div>
    </div>
  </span>

  <AlertDelete
    v-if="tryDelete"
    :name="`${userData.names} ${userData.lastName}`"
    :on-no="abortDelete"
    :on-yes="handleDelete(userData.username)"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RiCloseLine, RiDeleteBin7Fill, RiEditBoxLine } from '@remixicon/vue'
import { useRouter } from 'vue-router'
import SimpleTable from '@/components/DataDisplay/Tables/SimpleTable.vue'
import AlertDelete from '@/components/Feedback/Alerts/AlertDelete.vue'

const headers = ref(null)
const router = useRouter()
const tryDelete = ref(false)
const userData = ref({})

const props = defineProps({
  userId: String,
  openEdit: Boolean,
  data: Object
})

onMounted(() => {
  userData.value = props.data
})

headers.value = {
  rol: 'Rol',
  phones: 'Teléfonos',
  mails: 'Correo',
  id: 'No. ID'
}

const handleOpenEdit = () => {
  updateEdit(true)
}
const onDelete = () => {
  tryDelete.value = true
}
const handleDelete = async (usernameValue) => {
  console.log(usernameValue)
}
const abortDelete = () => {
  tryDelete.value = false
}
const goBack = () => {
  router.push('/admin/user/')
}
const emit = defineEmits(['update:openEdit'])
const updateEdit = (val) => {
  emit('update:openEdit', val)
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
