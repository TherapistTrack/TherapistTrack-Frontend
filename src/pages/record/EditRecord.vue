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
        <RiDeleteBin7Fill
          class-name="act-delete"
          size="1.5rem"
          color="var(--gray-1)"
          alt="delete"
        />
      </div>
      <div class="mid">
        <InputField
          :label="'Nombres'"
          :id="'nombres'"
          v-model:model-value="localData[props.id].nombre"
        />
        <InputField
          :label="'Apellidos'"
          :id="'apellidos'"
          v-model:model-value="localData[props.id].apellido"
        />
        <InputField
          :label="'Ultima Actualización'"
          :id="'ultimaAct'"
          v-model:model-value="localData[props.id].ultimaAct"
          :type="'date'"
        />
        <InputField
          :label="'Fecha de Nacimiento'"
          :id="'nacimiento'"
          v-model:model-value="localData[props.id].nacimiento"
          :type="'date'"
        />
        <InputField
          :label="'Estado Civil'"
          :id="'estadoCivil'"
          v-model:model-value="localData[props.id].estadoCivil"
        />
      </div>

      <div class="bottom">
        <ButtonSimple :msg="'Guardar'" :color="'yellow'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { RiCloseLine, RiDeleteBin7Fill } from '@remixicon/vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import InputField from '@/components/Forms/InputField/InputField.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'

const start = ref(false)
const router = useRouter()
const localData = ref(null)
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

const goBack = () => {
  start.value = false
  setTimeout(() => {
    router.push('/records')
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
