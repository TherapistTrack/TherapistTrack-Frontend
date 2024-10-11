<template>
  <div class="overlayContainer" @click="goBack()">
    <div class="create-user-form" @click.stop="">
      <div class="top">
        <h1>Nuevo Usuario</h1>
        <RiCloseLine
          class-name="icon"
          size="2rem"
          color="var(--gray-2)"
          alt="close"
          @click="goBack()"
        />
      </div>
      <div class="mid">
        <form @submit.prevent="createUser">
          <InputField
            :id="'ids'"
            :label="'ID'"
            v-model="user.id"
            :placeholder="'Escribe tu ID...'"
          />
          <InputField
            :id="'nombres'"
            :label="'Nombres'"
            v-model="user.names"
            :placeholder="'Escribe tu nombre...'"
          />
          <InputField
            :id="'nombres'"
            :label="'Apellidos'"
            :placeholder="'Escribe tus apellidos...'"
            v-model="user.lastNames"
          />
          <DynamicList :title="'Teléfonos: '" v-model:model-array="user.phones" />
          <DynamicList :title="'Correos: '" v-model:model-array="user.mails" />
          <SelectDropDown
            :disabled-value="'Seleccione una opción'"
            :label="'Rol'"
            :id="'role'"
            v-model="user.rol"
            :options="['Doctor', 'Assistant', 'Admin']"
          />
          <!-- Campos condicionales para "Doctor" -->
          <span v-if="user.rol === 'Doctor'">
            <InputField
              :id="'col-num'"
              :label="'No. Colegiado'"
              :placeholder="'Escribe tu No. de Colegiado'"
              v-model="user.collegiateNumber"
            />

            <InputField
              :id="'speciality'"
              :label="'Especialidad'"
              :placeholder="'Escribe tu especialidad'"
              v-model="user.specialty"
            />
          </span>

          <!-- Campos condicionales para "Asistente" -->
          <span v-else-if="user.rol === 'Assistant'">
            <InputField
              :id="'DPI'"
              :label="'DPI'"
              :placeholder="'Escribe tu DPI'"
              v-model="user.DPI"
            />
            <InputField
              :id="'start-date'"
              :label="'Fecha inicio'"
              :type="'date'"
              v-model="user.startDate"
            />
            <InputField
              :id="'end-date'"
              :label="'Fecha Final'"
              :type="'date'"
              v-model="user.endDate"
            />
          </span>
          <div v-if="!valid" class="error-container">
            <span class="error-msg" v-for="error in errors" :key="error">
              {{ error }}
            </span>
          </div>
          <div class="button-container">
            <ButtonSimple :msg="'Crear'" :disabled="!valid" @click="() => createUser" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { RiCloseLine } from '@remixicon/vue'
import { useRouter } from 'vue-router'
import InputField from '@/components/Forms/InputField/InputField.vue'
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import DynamicList from '@/components/Forms/DynamicList/DynamicList.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import { createUserSchema } from '@/schemas/createUserSchema'
import { useApi } from '@/oauth/useApi'
const { postRequest } = useApi()
const router = useRouter()
const user = ref({
  id: '',
  names: '',
  lastNames: '',
  phones: [],
  rol: '',
  mails: [],
  collegiateNumber: '',
  specialty: '',
  DPI: '',
  startDate: '',
  endDate: ''
})

const formatedUser = ref(null)
const errors = ref(null)
const valid = ref(false)

watch(
  user,
  () => {
    if (user.value != null) {
      createUserSchema
        .validate(user.value)
        .then(() => {
          valid.value = true
        })
        .catch((error) => {
          valid.value = false
          errors.value = error.errors
        })
    }
  },
  { deep: true }
)

const goBack = () => {
  router.back()
}

const createUser = async () => {
  if (valid.value) {
    formatedUser.value = {
      id: user.value.id,
      names: user.value.names,
      lastNames: user.value.lastNames,
      phones: [...user.value.phones],
      rol: user.value.rol,
      mails: [...user.value.mails]
    }
    if (user.value.rol == 'Doctor') {
      formatedUser.value['rolDependentInfo'] = {
        collegiateNumber: user.value.collegiateNumber,
        specialty: user.value.specialty
      }
    } else {
      formatedUser.value['rolDependentInfo'] = {
        startDate: user.value.startDate,
        endDate: user.value.endDate,
        DPI: user.value.DPI
      }
    }
    try {
      await postRequest('/users/register', formatedUser.value)

      emit('triggerToast', 1, 'El usuario fue creado exitosamente')
      emitUpdate()
      goBack()
    } catch {
      emit('triggerToast', 0, 'Hubo un error creando el usuario')
    }
  }
}

const emit = defineEmits(['updateData', 'triggerToast'])
const emitUpdate = () => {
  emit('updateData')
}
</script>

<style>
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
  z-index: 400;
}

.create-user-form .top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.create-user-form .icon {
  cursor: pointer;
}

.create-user-form .mid {
  padding: 1rem;
}

.create-user-form {
  background: #fff;
  padding: 2rem;
  border-radius: 2.5vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin: 2vh;
}

.create-user-form .button-container {
  display: flex;
  justify-content: end;
  padding: 0.5rem;
}

.create-user-form .error-container {
  padding: 1rem;
}
.create-user-form .error-msg {
  color: var(--red-1);
  font-weight: bold;
  display: flex;
  justify-content: center;
}
</style>
