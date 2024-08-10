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
            :label="'Nombres'"
            :placeholder="'Escribe tu nombre...'"
            v-model="user.firstName"
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

          <!-- Campos condicionales para "Doctor" -->
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

          <!-- Campos condicionales para "Asistente" -->
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
            <ButtonSimple :msg="'Crear'" :disabled="!isFormValid" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RiCloseLine } from '@remixicon/vue'
import { useRouter } from 'vue-router'
import InputField from '@/components/Forms/InputField/InputField.vue'
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
const router = useRouter()
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

const createUser = () => {
  if (isFormValid.value) {
    console.log('Creating user:', user.value)
    // Aquí implementarías la lógica para enviar los datos al API
  } else {
    console.error('Form is invalid')
  }
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
</style>
