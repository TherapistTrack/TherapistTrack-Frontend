<template>
  <div class="overlayContainer">
    <div class="view-user">
      <div class="top">
        <h1>{{ data[props.id].nombre }}</h1>
        <RiCloseLine
          class-name="icon"
          size="2rem"
          color="var(--gray-2)"
          alt="close"
          @click="goBack()"
        />
      </div>
      <div class="actions">
        <RiDeleteBin7Fill class-name="act-icon" size="1.5rem" color="var(--gray-1)" alt="delete" />
        <RiEditBoxLine class-name="act-icon" size="1.5rem" color="var(--gray-1)" alt="edit" />
      </div>
      <div class="tableContainer">
        <SimpleTable :data="data[props.id]" :headers="headers" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RiCloseLine, RiDeleteBin7Fill, RiEditBoxLine } from '@remixicon/vue'
import { useRouter } from 'vue-router'
import SimpleTable from '@/components/DataDisplay/Tables/SimpleTable.vue'
const data = ref(null)
const headers = ref(null)
const router = useRouter()

headers.value = {
  rol: 'Rol',
  telefonos: 'Teléfonos',
  numColegiado: 'No. Colegiado',
  correos: 'Correo'
}
data.value = {
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

const props = defineProps({
  id: String
})

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.icon,
.act-icon {
  cursor: pointer;
  max-height: 5vh;
}

.overlayContainer {
  background-color: rgba(0, 0, 0, 0.4);
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.view-user {
  background-color: white;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 2.5vh;
  width: 600px;
  max-height: 80vh;
  padding: 2rem;
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
