<template>
  <div class="overlayContainer" @click="goBack()">
    <div class="edit-user-form" @click.stop="">
      <div class="top">
        <h1>Editar Usuario</h1>
        <RiCloseLine
          class-name="icon"
          size="2rem"
          color="var(--gray-2)"
          alt="close"
          @click="goBack()"
        />
      </div>
      <div class="mid">
        <form @submit.prevent="updateUser">
          <InputField
            :label="'Nombres'"
            v-model="user.firstName"
            :placeholder="'Escribe tu nombre...'"
          />
          <InputField
            :label="'Apellidos'"
            :placeholder="'Escribe tus apellidos...'"
            v-model="user.lastName"
          />
          <InputField
            :label="'Teléfonos'"
            :placeholder="'Escribe tu número de teléfono'"
            v-model="user.phone"
          />
          <SelectDropDown
            :disabled-value="'Seleccione una opción'"
            :label="'Rol'"
            :id="'role'"
            v-model="user.role"
            :options="['Doctor', 'Asistente', 'Admin']"
          />

          <template v-if="user.role === 'Doctor'">
            <InputField
              :id="'col-num'"
              :label="'No. Colegiado'"
              :placeholder="'Escribe tu No. de Colegiado'"
              v-model="user.membershipNumber"
            />

            <InputField
              :id="'speciality'"
              :label="'Especialidad'"
              :placeholder="'Escribe tu especialidad'"
              v-model="user.specialty"
            />
            <InputField
              :id="'email'"
              :label="'Correo'"
              :placeholder="'correo@ejemplo.com'"
              v-model="user.email"
            />
          </template>
          <template v-if="user.role === 'Asistente'">
            <InputField
              :id="'email'"
              :label="'Correo'"
              :placeholder="'correo@ejemplo.com'"
              v-model="user.email"
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
          </template>
          <div class="button-container">
            <ButtonSimple :msg="'Guardar'" :disabled="!isFormValid" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps } from 'vue'
import { RiCloseLine } from '@remixicon/vue'
import { useRouter } from 'vue-router'
import InputField from '@/components/Forms/InputField/InputField.vue'
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
const router = useRouter()
const data = ref(null)
const user = ref({
  firstName: '',
  lastName: '',
  phone: '',
  role: '',
  membershipNumber: '',
  specialty: '',
  email: '',
  startDate: '',
  endDate: ''
})

onMounted(() => {
  data.value = {
    1: {
      firstName: 'Daniel',
      lastName: 'Rayo',
      role: 'Doctor',
      phone: ['555 555', '222 222'],
      membershipNumber: 32115,
      email: ['aaa@gmail.com', 'bbb@gmail.com']
    },
    2: {
      firstName: 'Sofia',
      lastName: 'de la Rosa',
      role: 'Doctor',
      phone: ['444 444', '333 333'],
      membershipNumber: 53515,
      email: ['ccc@gmail.com', 'ddd@gmail.com']
    },
    3: {
      firstName: 'Ricardo',
      lastName: 'Morales Sagastume',
      role: 'Asistente',
      phone: ['111 111', '777 777'],
      membershipNumber: null,
      email: ['eee@gmail.com']
    }
  }

  console.log(data.value[props.id].firstName)

  user.value = {
    firstName: data.value[props.id].firstName || '',
    lastName: data.value[props.id].lastName || '',
    phone: data.value[props.id].phone || '',
    role: data.value[props.id].role || '',
    membershipNumber: data.value[props.id].membershipNumber || '',
    specialty: data.value[props.id].specialty || '',
    email: data.value[props.id].email || '',
    startDate: data.value[props.id].startDate || '',
    endDate: data.value[props.id].endDate || ''
  }
})

const props = defineProps({
  id: String
})

const goBack = () => {
  router.back()
}

const isFormValid = computed(() => {
  const basicInfoValid =
    user.value.firstName && user.value.lastName && user.value.phone && user.value.role
  let roleSpecificValid = true
  if (user.value.role === 'Doctor') {
    roleSpecificValid = user.value.membershipNumber && user.value.specialty && user.value.email
  } else if (user.value.role === 'Asistente') {
    roleSpecificValid = user.value.email && user.value.startDate && user.value.endDate
  }
  return basicInfoValid && roleSpecificValid
})

const updateUser = () => {
  if (isFormValid.value) {
    console.log('Updating user:', user.value)
  } else {
    console.error('Form is invalid')
  }
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
