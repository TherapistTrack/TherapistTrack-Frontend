<template>
  <OverlayLoader v-if="loading" />
  <div v-if="done" class="overlayContainer" @click="handleReturn">
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
          <SelectDropDown
            :disabled-value="'Seleccione una opción'"
            :label="'Rol'"
            :id="'role'"
            v-model="user.rol"
            :options="['Doctor', 'Assistant']"
          />
          <DynamicList :title="'Teléfonos: '" v-model:model-array="user.phones" />
          <DynamicList :title="'Correos: '" v-model:model-array="user.mails" />
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
          <span v-else>
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
            <InputField :id="'DPI'" :label="'DPI'" v-model="user.DPI" />
          </span>
          <span v-if="!valid" class="error-container">
            <span class="error-msg" v-for="error in errors" :key="error">
              {{ error }}
            </span>
          </span>
          <div class="button-container">
            <ButtonSimple :msg="'Guardar'" :disabled="!valid" @click="() => updateUser" />
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
</template>

<script setup>
import { ref, onMounted, defineProps, watch } from 'vue'
import OverlayLoader from '@/components/Feedback/Spinner/OverlayLoader.vue'
import { RiCloseLine } from '@remixicon/vue'
import { useRouter } from 'vue-router'
import InputField from '@/components/Forms/InputField/InputField.vue'
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import AlertOptionSimple from '@/components/Feedback/Alerts/AlertOptionSimple.vue'
import DynamicList from '@/components/Forms/DynamicList/DynamicList.vue'
import { useApi } from '@/oauth/useApi'
import * as yup from 'yup'

const router = useRouter()
const { putRequest } = useApi()
const startData = ref(null)
const tryReturn = ref(false)
const localData = ref(null)
const done = ref(false)
const user = ref(null)
const errors = ref(null)
const valid = ref(true)
const formatedUser = ref(null)
const loading = ref(false)

const userSchema = yup.object().shape({
  names: yup.string().required('Names are required').trim().min(1, 'Names cannot be empty'),
  lastNames: yup
    .string()
    .required('Last names are required')
    .trim()
    .min(1, 'Last names cannot be empty'),
  phones: yup
    .array()
    .of(yup.string().matches(/^[0-9]+$/, 'Phone numbers must contain only numbers'))
    .required('At least one phone number is required')
    .min(1, 'At least one phone number is required'),
  rol: yup
    .string()
    .oneOf(['Assistant', 'Doctor'], 'Role must be either "Assistant" or "Doctor"')
    .required('Role is required'),
  mails: yup
    .array()
    .of(
      yup
        .string()
        .email('Each email must be a valid email address')
        .required('There cannot be empty emails')
    )
    .required('At least one email is required')
    .min(1, 'At least one email is required'),

  startDate: yup
    .date()
    .nullable()
    .test(
      'is-valid-date',
      'Start date must be a valid date',
      (value) => value === null || value === '' || !isNaN(new Date(value).getTime())
    )
    .when('rol', (rol) =>
      rol == 'Assistant'
        ? yup
            .date()
            .required('Start date is required for Assistants')
            .typeError('Start date must be in the format yyyy-mm-dd')
        : yup.string().nullable()
    ),

  endDate: yup
    .date()
    .nullable()
    .test(
      'is-valid-date',
      'End date must be a valid date',
      (value) => value === null || value === '' || !isNaN(new Date(value).getTime())
    )

    .when('rol', (rol) =>
      rol == 'Assistant'
        ? yup
            .date()
            .required('End date is required for Assistants')
            .typeError('End date must be in the format yyyy-mm-dd')
            .min(yup.ref('startDate'), 'End date must be after start date')
        : yup.string().nullable()
    ),

  DPI: yup
    .string()
    .nullable()
    .when('rol', (rol) =>
      rol == 'Assistant'
        ? yup
            .string()
            .matches(/^[0-9]+$/, 'DPI must contain only numbers')
            .required('DPI is required for Assistants')
        : yup.string().nullable()
    ),
  collegiateNumber: yup
    .string()
    .nullable()
    .when('rol', (rol) =>
      rol == 'Doctor'
        ? yup.string().trim().required('Collegiate number is required for Doctors')
        : yup.string().nullable()
    ),
  specialty: yup
    .string()
    .nullable()
    .when('rol', (rol) =>
      rol == 'Doctor'
        ? yup.string().trim().required('Specialty is required for Doctors')
        : yup.string().nullable()
    )
})

const props = defineProps({
  userId: String,
  openEdit: Boolean,
  data: Object
})

watch(
  user,
  () => {
    if (user.value != null) {
      userSchema
        .validate(user.value)
        .then(() => {
          console.log('Validation passed!')
          valid.value = true
        })
        .catch((error) => {
          console.error('Validation failed:', error.errors)
          valid.value = false
          errors.value = error.errors
        })
    }
    done.value = true
  },
  { deep: true }
)

onMounted(async () => {
  try {
    localData.value = props.data
  } catch {
    router.back()
  }
  user.value = {
    id: props.userId,
    names: localData.value.names || '',
    lastNames: localData.value.lastNames || '',
    phones: localData.value.phones || [],
    rol: localData.value.rol || '',
    collegiateNumber: localData.value.rolDependentInfo[0].collegiateNumber || '',
    specialty: localData.value.rolDependentInfo[0].specialty || '',
    mails: localData.value.mails || [],
    DPI: localData.value.rolDependentInfo[0].DPI || '',
    startDate: '',
    endDate: ''
  }
  startData.value = {
    names: localData.value.names || '',
    lastNames: localData.value.lastNames || '',
    phones: JSON.parse(JSON.stringify(localData.value.phones)) || [],
    rol: localData.value.rol || '',
    collegiateNumber: localData.value.rolDependentInfo[0].collegiateNumber || '',
    specialty: localData.value.rolDependentInfo[0].specialty || '',
    mails: JSON.parse(JSON.stringify(localData.value.mails)) || [],
    DPI: localData.value.rolDependentInfo[0].DPI || '',
    startDate: '',
    endDate: ''
  }
  try {
    user.value.startDate = localData.value.rolDependentInfo[0].startDate.slice(0, 10)
    user.value.endDate = localData.value.rolDependentInfo[0].endDate.slice(0, 10)
    startData.value.startDate = localData.value.rolDependentInfo[0].startDate.slice(0, 10)
    startData.value.endDate = localData.value.rolDependentInfo[0].endDate.slice(0, 10)
  } catch {
    user.value.startDate = ''
    user.value.endDate = ''
    startData.value.startDate = ''
    startData.value.endDate = ''
  }
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
  updateEdit(false)
  tryReturn.value = false
  router.back()
  router.push('/admin/user/')
}

const hasChanged = () => {
  const change =
    user.value.names === startData.value.names &&
    user.value.lastNames === startData.value.lastNames &&
    JSON.stringify(user.value.phones) == JSON.stringify(startData.value.phones) &&
    user.value.rol === startData.value.rol &&
    user.value.collegiateNumber === startData.value.collegiateNumber &&
    user.value.specialty === startData.value.specialty &&
    JSON.stringify(user.value.mails) == JSON.stringify(startData.value.mails) &&
    user.value.startDate === startData.value.startDate &&
    user.value.endDate === startData.value.endDate &&
    user.value.DPI === startData.value.DPI
  console.log(JSON.stringify(user.value.mails) == JSON.stringify(startData.value.mails))
  return change
}

const updateUser = async () => {
  if (!hasChanged()) {
    if (valid.value) {
      formatedUser.value = {
        id: user.value.id,
        names: user.value.names,
        lastNames: user.value.lastNames,
        phones: [...user.value.phones],
        rol: user.value.rol,
        mails: [...user.value.mails]
      }
      if (user.value.role == 'Doctor') {
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
      loading.value = true
      try {
        await putRequest('/users/update', formatedUser.value)
        goBack()
      } catch {
        console.log('something went bad with the request')
      }
      loading.value = false
    } else {
      console.log('Form is invalid')
    }
  }
  loading.value = false
}

const emit = defineEmits(['update:openEdit'])
const updateEdit = (val) => {
  emit('update:openEdit', val)
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

.edit-user-form .error-msg {
  color: var(--red-1);
  font-weight: bold;
  display: flex;
  justify-content: center;
}
</style>
