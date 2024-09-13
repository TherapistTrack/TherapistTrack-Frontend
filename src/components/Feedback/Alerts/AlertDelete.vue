<template>
  <div class="overlay-container">
    <div class="alert-container">
      <div class="alert-text">
        <span v-if="type == 'record'">
          <h3>
            <b>¿Desea eliminar el expediente de {{ name }}?</b>
          </h3>
          <br />
          <p>
            Esta acción es irreversible, los archivos de este paciente serán eliminados totalmente.
          </p>
          <br />
          <p>
            Escribe <b>{{ name }}</b> para confirmar la eliminación.
          </p>
        </span>
        <span v-else>
          <h3>
            <b>¿Desea eliminar el usuario con nombre {{ name }}?</b>
          </h3>
          <br />
          <p>
            Esta acción es irreversible, la información asociada a este usuario será eliminada
            totalmente.
          </p>
          <br />
          <p>
            Escribe <b>{{ name }}</b> para confirmar la eliminación.
          </p>
        </span>
      </div>
      <InputFieldSimple :id="'input-name'" v-model:model-value="localName" />
      <div class="alert-options">
        <ButtonSimple
          :msg="'SI'"
          :color="'white'"
          :disabled="!confirmDelete"
          :on-click="handleClickYes"
        />
        <ButtonSimple :msg="'NO'" :color="'red'" :on-click="handleClickNo" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import InputFieldSimple from '@/components/Forms/InputField/InputFieldSimple.vue'
import { ref, watch } from 'vue'
const localName = ref('')
const confirmDelete = ref(false)
const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  onYes: Function,
  onNo: Function,
  type: String
})

watch(localName, () => {
  if (localName.value == props.name) {
    confirmDelete.value = true
  } else {
    confirmDelete.value = false
  }
})

const handleClickYes = () => {
  props.onYes()
}

const handleClickNo = () => {
  props.onNo()
}
</script>

<style>
.overlay-container {
  height: 100%;
  width: 100%;
  z-index: 500;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
}

.alert-container {
  background-color: var(--white);
  padding: 2rem;
  border-radius: 1rem;
  width: 60vw;
  max-width: 500px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.alert-container .alert-options {
  width: 70%;
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  margin: 0 2rem 0 2rem;
}
.alert-container .alert-text {
  padding-bottom: 2rem;
}
</style>
