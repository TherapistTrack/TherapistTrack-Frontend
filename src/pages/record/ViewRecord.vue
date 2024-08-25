<template>
  <div class="overlayContainer" @click="goBack()" :id="start ? 'init' : 'end'">
    <div class="view-record" @click.stop="" :id="start ? 'init' : 'end'">
      <div class="top">
        <h1>
          <b>{{ localData[props.id].nombre }}<br />{{ localData[props.id].apellido }}</b>
        </h1>
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
          @click="handleOpenEdit(props.id)"
        />
        <RiDeleteBin7Fill
          class-name="act-delete"
          size="1.5rem"
          color="var(--gray-1)"
          alt="delete"
          @click="handleDelete(props.id)"
        />
      </div>
      <div class="mid">
        <SimpleTable :data="localData[props.id]" :headers="headers" />
      </div>

      <div class="bottom">
        <ButtonSimple :msg="'Abrir'" />
      </div>
    </div>
  </div>
  <AlertDelete
    v-if="tryDelete"
    :name="`${props.data[props.id].nombre} ${props.data[props.id].apellido}`"
    :on-no="abortDelete"
  />
</template>

<script setup>
import { RiCloseLine, RiEditBoxLine, RiDeleteBin7Fill } from '@remixicon/vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SimpleTable from '@/components/DataDisplay/Tables/SimpleTable.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import AlertDelete from '@/components/Feedback/Alerts/AlertDelete.vue'

const start = ref(false)
const router = useRouter()
const localData = ref(null)
const tryDelete = ref(false)
const props = defineProps({
  id: String,
  data: Object
})
localData.value = props.data

onMounted(() => {
  setTimeout(() => {
    start.value = true
  }, 2) // You can adjust the delay if needed
})

const headers = ref({
  nombre: 'Nombre',
  apellido: 'Apellidos',
  ultimaAct: 'Ultima Actualización',
  nacimiento: 'Nacimiento',
  estadoCivil: 'Estado Civil',
  nombrePareja: 'Nombre de Pareja'
})

const goBack = () => {
  start.value = false
  setTimeout(() => {
    router.back()
  }, 250) // You can adjust the delay if needed
}

const handleDelete = (id) => {
  // Deleting based on the id
  console.log(id)
  tryDelete.value = !tryDelete.value
}
const abortDelete = () => {
  tryDelete.value = false
}
const handleOpenEdit = () => {
  start.value = false
  setTimeout(() => {
    router.push(`/records/edit${props.id}`)
  }, 250) // You can adjust the delay if needed
}
</script>

<style>
.overlayContainer {
  height: 100%;
  width: 100%;
  z-index: 300;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: end;
  align-items: center;
  transition: background-color 0.3s;
}

.overlayContainer#init {
  background-color: rgba(0, 0, 0, 0.4);
}
.overlayContainer#end {
  background-color: none;
}
.view-record {
  position: absolute;
  right: -400px;
  z-index: 400;
  background-color: white;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 2vh 0 0 2vh;
  width: 400px;
  height: 100vh;
  padding: 2rem;
  transition: right 0.3s;
}
.view-record#init {
  right: 0;
}
.view-record#end {
  right: -400px;
}

.view-record .icon,
.view-record .act-edit,
.view-record .act-delete {
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

.view-record .top {
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
}
.view-record .actions {
  display: flex;
  gap: 1.5rem;
  padding-bottom: 1rem;
}
.view-record .mid {
  padding: 1rem;
  height: 360px;
  overflow-y: auto;
}

.view-record .bottom {
  border-top: 1px solid var(--gray-3);
  padding-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: end;
}
</style>
