<template>
  <div v-if="ready" class="overlayContainer" @click="goBack()" :id="start ? 'init' : 'end'">
    <div class="view-record" @click.stop="" :id="start ? 'init' : 'end'">
      <div class="top">
        <h1>
          <b>{{ userData['Nombre'] }}<br />{{ userData['Apellido'] }}</b>
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
          @click="handleOpenEdit()"
        />
        <RiDeleteBin7Fill
          class-name="act-delete"
          size="1.5rem"
          color="var(--gray-1)"
          alt="delete"
          @click="handleDelete(props.userId)"
        />
      </div>
      <div class="mid">
        <SimpleTable :data="userData" :headers="userHeaders" :isSet="true" />
      </div>

      <div class="bottom">
        <ButtonSimple :msg="'Abrir'" />
      </div>
    </div>
  </div>
  <div v-else>asdasdasd</div>
  <AlertDelete
    v-if="tryDelete"
    :name="`${userData['Nombre']} ${userData['Apellidos']}`"
    :on-no="abortDelete"
    :on-yes="onDelete"
    :type="'record'"
  />
</template>

<script setup>
import { RiCloseLine, RiEditBoxLine, RiDeleteBin7Fill } from '@remixicon/vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SimpleTable from '@/components/DataDisplay/Tables/SimpleTable.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import AlertDelete from '@/components/Feedback/Alerts/AlertDelete.vue'

const ready = ref(false)
const start = ref(false)
const router = useRouter()
const userData = ref(null)
const userHeaders = ref([])
const tryDelete = ref(false)
const props = defineProps({
  recordId: String,
  viewData: Object
})

const emit = defineEmits(['updateData', 'openEdit'])

onMounted(() => {
  userData.value = props.viewData.filter((item) => item['Record ID'] === props.recordId)[0]
  userHeaders.value = Object.keys(userData.value)

  ready.value = true
  setTimeout(() => {
    start.value = true
  }, 2) // You can adjust the delay if needed
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

const handleOpenEdit = () => {
  start.value = false
  setTimeout(() => {
    emit('openEdit')
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
  height: 385px;
  overflow-y: auto;
}
.view-record .mid * {
  font-size: 0.8rem;
}

.view-record .bottom {
  border-top: 1px solid var(--gray-3);
  padding-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: end;
}

@media (max-aspect-ratio: 1/1) {
  .view-record {
    width: 280px;
  }
  .view-record .mid {
    height: 65vh;
  }
}
</style>
