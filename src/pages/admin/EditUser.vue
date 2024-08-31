<template>
  <div class="overlayContainer" @click="handleReturn">
    <div class="edit-user-form" @click.stop="">
      <div class="top">
        <h1>Editar Usuario</h1>
        <RiCloseLine
          class-name="icon"
          size="2rem"
          color="var(--gray-2)"
          alt="close"
          @click="handleReturn"
        />
      </div>
      <div class="mid">
        <form @submit.prevent="updateUser">
          <InputField
            :label="'Nombres'"
            v-model="user.name"
            :placeholder="'Escribe tu nombre...'"
          />
          <InputField
            :label="'Apellidos'"
            :placeholder="'Escribe tus apellidos...'"
            v-model="user.lastName"
          />
          <SelectDropDown
            :disabled-value="'Seleccione una opción'"
            :label="'Rol'"
            :id="'role'"
            v-model="user.role"
            :options="['Doctor', 'Asistente', 'Admin']"
          />
          <template v-if="user.role === 'Doctor'">
            <DynamicList :title="'Teléfonos: '" v-model:model-array="user.phones" />
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
            <DynamicList :title="'Correos: '" v-model:model-array="user.mails" />
          </template>
          <template v-else-if="user.role === 'Asistente'">
            <DynamicList :title="'Teléfonos: '" v-model:model-array="user.phones" />
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
            <DynamicList :title="'Correos: '" v-model:model-array="user.mails" />
          </template>
          <template v-else>
            <DynamicList :title="'Teléfonos: '" v-model:model-array="user.phones" />
          </template>
          <div class="button-container">
            <ButtonSimple :msg="'Guardar'" :disabled="!isFormValid" @click="updateUser" />
          </div>
        </form>
      </div>
    </div>
  </div>
  <AlertOptionSimple
    v-if="tryReturn"
    :msg="'¿Deseas Continuar? tus cambios no serán guardados'"
    :on-no="abortReturn"
    :on-yes="goBack"
  />
  <OverlayLoader v-if="loading" />
</template>

<script setup>
import { ref, computed, onMounted, defineProps } from 'vue'
import { RiCloseLine } from '@remixicon/vue'
import { useRouter } from 'vue-router'
import InputField from '@/components/Forms/InputField/InputField.vue'
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import AlertOptionSimple from '@/components/Feedback/Alerts/AlertOptionSimple.vue'
import OverlayLoader from '@/components/Feedback/Spinner/OverlayLoader.vue'
import DynamicList from '@/components/Forms/DynamicList/DynamicList.vue'
import { useApi } from '@/oauth/useApi'
const router = useRouter()
const { putRequest } = useApi()
const startData = ref(null)
const tryReturn = ref(false)
const loading = ref(false)
const user = ref({
  name: '',
  lastName: '',
  phones: [],
  role: '',
  collegiateNumber: '',
  specialty: '',
  mails: [],
  startDate: '',
  endDate: ''
})

onMounted(() => {
  if (props.data === null || props.data === undefined) {
    router.push('/admin/user/')
  }

  user.value = {
    name: props.data[props.userId].name || '',
    lastName: props.data[props.userId].lastName || '',
    phones: props.data[props.userId].phones || [],
    role: props.data[props.userId].role || '',
    collegiateNumber: props.data[props.userId].collegiateNumber || '',
    specialty: props.data[props.userId].specialty || '',
    mails: props.data[props.userId].mails || [],
    startDate: props.data[props.userId].startDate || '',
    endDate: props.data[props.userId].endDate || ''
  }
  startData.value = {
    name: props.data[props.userId].name || '',
    lastName: props.data[props.userId].lastName || '',
    phones: props.data[props.userId].phones || [],
    role: props.data[props.userId].role || '',
    collegiateNumber: props.data[props.userId].collegiateNumber || '',
    specialty: props.data[props.userId].specialty || '',
    mails: props.data[props.userId].mails || [],
    startDate: props.data[props.userId].startDate || '',
    endDate: props.data[props.userId].endDate || ''
  }
})

const props = defineProps({
  userId: String,
  data: Object
})

const handleReturn = () => {
  if (!hasChanged()) {
    tryReturn.value = true
  } else {
    goBack()
  }
}

const abortReturn = () => {
  tryReturn.value = false
}
const goBack = () => {
  tryReturn.value = false
  router.back()
  router.push('/admin/user/')
}

const hasChanged = () => {
  const change =
    user.value.name === startData.value.name &&
    user.value.lastName === startData.value.lastName &&
    user.value.phones === startData.value.phones &&
    user.value.role === startData.value.role &&
    user.value.collegiateNumber === startData.value.collegiateNumber &&
    user.value.specialty === startData.value.specialty &&
    user.value.mails === startData.value.mails &&
    user.value.startDate === startData.value.startDate &&
    user.value.endDate === startData.value.endDate
  return change
}

const isFormValid = computed(() => {
  const basicInfoValid = user.value.name && user.value.name && user.value.phones && user.value.role
  let roleSpecificValid = true
  if (user.value.role === 'Doctor') {
    roleSpecificValid = user.value.collegiateNumber && user.value.specialty && user.value.mails
  } else if (user.value.role === 'Asistente') {
    roleSpecificValid = user.value.mails && user.value.startDate && user.value.endDate
  }
  return basicInfoValid && roleSpecificValid
})

const updateUser = async () => {
  loading.value = true
  if (hasChanged()) {
    if (isFormValid.value) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const response = await putRequest('/users/update', user.value)
        if (response.ok) {
          console.log('updated succesfully')
        } else {
          console.log('Error Updating user:', props.data[props.userId].username)
        }
      } catch {
        console.log('Error Updating user:', props.data[props.userId].username)
      }
    } else {
      console.log('Form is invalid')
    }
  }
  loading.value = false
}
</script>

<style scoped>
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

.edit-user-form {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin: 2vh;
}

.edit-user-form .icon {
  cursor: pointer;
}

.edit-user-form .top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.edit-user-form .mid {
  padding: 1rem;
}
.edit-user-form .button-container {
  display: flex;
  justify-content: end;
  padding: 0.5rem;
}
</style>
