<template>
  <div class="record-template-container" @click="hideContextMenu">
    <h1 class="page-title">{{ templateName }}</h1>
    <p>Aquí se puede editar los campos de información que se debe registrar sobre un paciente.</p>

    <!-- Sección de Categorías -->
    <div class="categories-section">
      <label class="categories-label">Categorías:</label>
      <div class="categories-inputs">
        <div v-for="(category, index) in categories" :key="index" class="category-input-container">
          <input
            type="text"
            v-model="categories[index]"
            @focus="handleCategoryFocus(index)"
            @blur="handleCategoryBlur(index)"
            @keyup.enter="handleCategoryEnter(index)"
            placeholder="Escribe una categoría..."
            class="category-input"
          />
          <RiCloseLine
            v-if="category.trim() !== ''"
            class="delete-btn"
            @click="removeCategory(index)"
            color="red"
          />
        </div>
      </div>
    </div>

    <div class="form-header">
      <span class="header-item">Nombre del Campo</span>
      <span class="header-item">Tipo de Dato</span>
      <span class="header-item">Obligatorio</span>
      <span class="header-item">Opciones</span>
    </div>

    <div class="form-section">
      <div v-for="(field, index) in fields" :key="index" class="form-group">
        <div class="field-name">
          <span class="field-label">{{ field.name }}</span>
        </div>
        <!-- Tipo de Dato -->
        <div class="field-type">
          <DropdownField
            :show-type-icon="false"
            :id="'dropdown-' + index"
            :label="'Seleccione un tipo'"
            :disabledValue="'Seleccionar...'"
            :options="dataTypes"
            v-model="field.type"
            @change="handleFieldTypeChange(index, $event.target.value)"
            :disabled="!isEditing.value"
          />
        </div>
        <div class="field-required">
          <Checkbox
            :id="'required-' + index"
            label=""
            v-model="field.required"
            @change="handleFieldRequiredChange(index, $event.target.checked)"
          />
        </div>
        <div class="field-options">
          <RiMoreFill class="more-options-btn" @click="handleContextMenu($event, field)" />
        </div>
        <div class="choice-container">
          <DynamicList
            v-if="field.type == 'CHOICE'"
            title="Opciones"
            v-model:model-array="field.options"
            @change="handleChoiceChange(index)"
          />
        </div>
      </div>
      <div class="form-bottom">
        <ButtonSimple
          msg="Agregar Campo"
          class="action-button button-component"
          @click="showCreateFieldModal"
        />
        <ButtonSimple
          v-if="!isEditing"
          msg="Guardar"
          class="action-button button-component"
          @click="saveTemplate"
        />
        <ButtonSimple
          v-else
          msg="Regresar"
          class="action-button button-component"
          @click="goBackToPatients"
        />
      </div>
    </div>

    <ContextMenu
      :position="contextMenuPosition"
      :visible="contextMenuVisible"
      @remove="showRemoveModal"
      @rename="showRenameModal"
    />

    <RemoveTemplate
      v-if="isRemoveModalVisible"
      :currentName="selectedField.name"
      @close="isRemoveModalVisible = false"
      @remove="removeField"
    />

    <CreateTemplate
      v-if="isCreateFieldModalVisible"
      type="field"
      @close="isCreateFieldModalVisible = false"
      @create="addNewField"
    />

    <RenameTemplate
      v-if="isRenameModalVisible"
      :currentName="selectedField.name"
      type="field"
      @close="isRenameModalVisible = false"
      @rename="renameField"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Checkbox from '@/components/Forms/CheckBox/CheckBox.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import DropdownField from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import ContextMenu from '@/components/Feedback/Modals/ContextMenu.vue'
import RemoveTemplate from '@/components/Feedback/Modals/RemoveTemplate.vue'
import CreateTemplate from '@/components/Feedback/Modals/CreateTemplate.vue'
import RenameTemplate from '@/components/Feedback/Modals/RenameTemplate.vue'
import DynamicList from '@/components/Forms/DynamicList/DynamicList.vue'
import { useContextMenu } from '@/components/DataDisplay/Composables/useContextMenu.js'
import { useApi } from '@/oauth/useApi'
import { useAuth0 } from '@auth0/auth0-vue'
import { RiMoreFill, RiCloseLine } from '@remixicon/vue'

const emit = defineEmits('addToast')

const router = useRouter()
const route = useRoute()
const { getRequest, postRequest, putRequest, deleteRequest } = useApi()
const auth0 = useAuth0()

const isEditing = ref(false)

const templateId = ref(route.params.templateId || null)
const templateName = ref(route.query.name || 'Nueva Plantilla')

const dataTypes = ['SHORT_TEXT', 'TEXT', 'NUMBER', 'FLOAT', 'DATE', 'CHOICE']

const fields = ref([
  { name: 'Primer Nombre', type: '', value: '', required: true, isConfigured: false },
  { name: 'Apellido Familiar', type: '', value: '', required: true, isConfigured: false },
  { name: 'Hijos', type: '', value: '', required: false, isConfigured: false },
  { name: 'Estado Civil', type: '', value: '', required: false, isConfigured: false }
])

const selectedField = ref({})
const isRemoveModalVisible = ref(false)
const isCreateFieldModalVisible = ref(false)
const isRenameModalVisible = ref(false)
const categories = ref([''])

const getDoctorId = async () => {
  let userId = auth0.user.value.sub.split('|')[1]
  let doctorId = ''
  try {
    const response = await postRequest('/users/@me', { id: userId })
    doctorId = response.data.roleDependentInfo.id
  } catch {
    emit('addToast', { content: 'Ocurrio un error obteniendo información del doctor', type: 0 })
  }
  return doctorId
}

// CHOICE OPTION LOGIC

// CATEGORY LOGIC
function handleCategoryFocus(index) {
  if (index === categories.value.length - 1 && categories.value[index].trim() !== '') {
    categories.value.push('')
  }
}

function handleCategoryBlur(index) {
  const currentCategory = categories.value[index].trim()

  if (currentCategory === '' && categories.value.length > 1) {
    categories.value.splice(index, 1)
  }

  if (index === categories.value.length - 1 && currentCategory !== '') {
    categories.value.push('')
  }
}

function handleCategoryEnter(index) {
  const currentCategory = categories.value[index].trim()

  event.preventDefault()

  if (index === categories.value.length - 1 && currentCategory !== '') {
    categories.value.push('')
  }

  nextTick(() => {
    const inputs = document.querySelectorAll('.category-input')
    if (inputs.length > index + 1) {
      inputs[index + 1].focus()
    }
  })
}

function removeCategory(index) {
  categories.value.splice(index, 1)
  if (categories.value.length === 0) {
    categories.value.push('')
  }
}

const handleChoiceChange = (index) => {
  const options = fields.value[index].options
  if (!isEditing.value) {
    return
  }
  if (options.length == 0 || options == undefined || options == null) {
    return
  }
  const field = fields.value[index]
  const oldFieldName = field.name
  const updatedFieldData = {
    ...field,
    options: options
  }
  editFieldInTemplate(oldFieldName, updatedFieldData)
}

const {
  position: contextMenuPosition,
  visible: contextMenuVisible,
  showContextMenu,
  hideContextMenu
} = useContextMenu()

function showCreateFieldModal() {
  isCreateFieldModalVisible.value = true
}

function showRenameModal() {
  isRenameModalVisible.value = true
}

function goBackToPatients() {
  emit('addToast', { type: 1, content: 'Plantilla editada exitosamente' })
  router.push('/config/patients')
}

function addNewField({ name, type, required = false }) {
  const newField = {
    name,
    type,
    required
  }

  // Llamar a la función de agregar campo al servidor
  addFieldToTemplate(newField)
  isCreateFieldModalVisible.value = false
}

function renameField(newName) {
  const field = selectedField.value
  const oldFieldName = field.name
  field.name = newName
  isRenameModalVisible.value = false

  if (!isEditing.value) {
    // Modo creación: el cambio se guarda localmente y se enviará al guardar
    return
  }

  const updatedFieldData = {
    ...field,
    name: newName
  }

  // Llamar a la función para editar el campo en el backend
  editFieldInTemplate(oldFieldName, updatedFieldData)
}

async function saveTemplate() {
  if (!templateName.value.trim()) {
    alert('El nombre de la plantilla es requerido')
    return
  }

  const validCategories = categories.value
    .map((category) => category.trim())
    .filter((category) => category !== '')

  if (validCategories.length === 0) {
    alert('Debe agregar al menos una categoría.')
    return
  }
  let doctorId = await getDoctorId()
  const requestBody = {
    doctorId: doctorId,
    name: templateName.value,
    categories: validCategories,
    fields: fields.value.map((field) => ({
      name: field.name,
      type: field.type,
      required: field.required === true,
      options: field.options || [],
      description: field.description || 'Descripción predeterminada'
    }))
  }

  try {
    if (isEditing.value) {
      // Modo edición: actualizar la plantilla existente
      requestBody.templateId = templateId.value
      const response = await putRequest('/doctor/PatientTemplate', requestBody)
      console.log('Plantilla actualizada exitosamente:', response)
      alert('Plantilla actualizada exitosamente')
    } else {
      // Modo creación: crear una nueva plantilla
      const response = await postRequest('/doctor/PatientTemplate', requestBody)
      console.log('Plantilla creada exitosamente:', response)
      templateId.value = response.data.patientTemplateId
      isEditing.value = true
      alert('Plantilla creada exitosamente')
    }
    emit('addToast', { type: 1, content: 'Plantilla creada exitosamente' })
    // Redirigir o actualizar la vista
    router.push('/config/patients')
  } catch (error) {
    emit('addToast', { type: 0, content: 'Hubo un error guardando la plantilla' })
    console.error('Error al guardar la plantilla:', error)
    if (error.response && error.response.data) {
      console.error('Detalles del error:', error.response.data)
      alert(`Error al guardar la plantilla: ${error.response.data.message}`)
    } else {
      console.error('No se recibió respuesta del servidor')
      alert('Error al guardar la plantilla')
    }
  }
}

// Load the template if we're editing an existing one
async function loadTemplateData(templateId) {
  try {
    const doctorId = await getDoctorId()
    const response = await getRequest(
      `/doctor/PatientTemplate?doctorId=${doctorId}&templateId=${templateId}`
    )

    if (response.status === 200 && response.data) {
      templateName.value = response.data.name
      categories.value = response.data.categories || ['']

      if (
        categories.value.length === 0 ||
        categories.value[categories.value.length - 1].trim() !== ''
      ) {
        categories.value.push('')
      }

      fields.value = response.data.fields.map((field) => ({
        ...field,
        isConfigured: true
      }))
      console.log('Datos de la plantilla cargados:', response.data)
    } else {
      console.error('No se encontraron datos de la plantilla en la respuesta:', response)
    }
  } catch (error) {
    console.error('Error al cargar los datos de la plantilla:', error)
  }
}

onMounted(() => {
  if (templateId.value) {
    isEditing.value = true
    loadTemplateData(templateId.value)
  } else {
    console.log('Esta es una nueva plantilla sin un ID en el backend aún.')
  }
})

function handleContextMenu(event, field) {
  event.stopPropagation()
  selectedField.value = field
  showContextMenu(event)
}

function showRemoveModal() {
  isRemoveModalVisible.value = true
}

// Agregar un log para verificar el token al inicio (debugging)
auth0
  .getAccessTokenSilently()
  .then((token) => {
    console.log('Access Token obtenido:', token)
  })
  .catch((error) => {
    console.error('Error obteniendo el Access Token:', error)
  })

async function addFieldToTemplate(newField) {
  if (!isEditing.value) {
    // Modo creación: agregar el campo localmente
    fields.value.push({ ...newField, isConfigured: true })
    return
  }

  // Modo edición: enviar solicitud al backend
  if (!templateId.value) {
    console.error('El templateId no está definido')
    return
  }
  let doctorId = await getDoctorId()
  const requestBody = {
    doctorId: doctorId,
    templateId: templateId.value,
    field: {
      name: newField.name,
      type: newField.type,
      required: newField.required === true,
      options: newField.options || [],
      description: newField.description || 'Descripción predeterminada'
    }
  }

  console.log('Datos para enviar a la API:', JSON.stringify(requestBody, null, 2))

  try {
    const response = await postRequest('/doctor/PatientTemplate/fields', requestBody)
    console.log('Campo añadido exitosamente:', response.message)
    fields.value.push({ ...newField, isConfigured: true })
  } catch (error) {
    console.error('Error al añadir el campo:', error)
    alert(`Error al añadir el campo: ${error.response?.data?.message || error.message}`)
  }
}

// Función para editar un campo de la plantilla
async function editFieldInTemplate(oldFieldName, updatedFieldData) {
  if (!templateId.value || !oldFieldName) {
    alert('Información insuficiente para editar el campo')
    return
  }

  let doctorId = await getDoctorId()
  const requestBody = {
    doctorId: doctorId,
    templateId: templateId.value,
    oldFieldName,
    fieldData: {
      name: updatedFieldData.name,
      type: updatedFieldData.type,
      required: updatedFieldData.required === true,
      options: updatedFieldData.options || [],
      description: updatedFieldData.description || 'Descripción predeterminada'
    }
  }

  try {
    const response = await putRequest('/doctor/PatientTemplate/fields', requestBody)
    console.log('Campo editado exitosamente:', response.message)
    // Actualiza el campo en el estado local
    const index = fields.value.findIndex((field) => field.name === oldFieldName)
    if (index !== -1) {
      fields.value[index] = { ...updatedFieldData, isConfigured: true }
    }
  } catch (error) {
    console.error('Error al editar el campo:', error)
    alert(`Error al editar el campo: ${error.response?.data?.message || error.message}`)
  }
}

function handleFieldTypeChange(index, newType) {
  if (!isEditing.value) {
    fields.value[index].type = newType
    return
  }

  const field = fields.value[index]
  const oldFieldName = field.name

  const updatedFieldData = {
    ...field,
    type: newType
  }

  editFieldInTemplate(oldFieldName, updatedFieldData)
}

function handleFieldRequiredChange(index, isRequired) {
  if (!isEditing.value) {
    fields.value[index].required = isRequired
    return
  }

  const field = fields.value[index]
  const oldFieldName = field.name

  const updatedFieldData = {
    ...field,
    required: isRequired
  }

  editFieldInTemplate(oldFieldName, updatedFieldData)
}

async function deleteFieldFromTemplate(fieldName) {
  if (!fieldName) {
    alert('Información insuficiente para eliminar el campo.')
    return
  }

  if (!isEditing.value) {
    // Modo creación: eliminar el campo localmente
    fields.value = fields.value.filter((field) => field.name !== fieldName)
    isRemoveModalVisible.value = false
    hideContextMenu()
    return
  }

  // Modo edición: enviar solicitud al backend
  if (!templateId.value) {
    console.error('El templateId no está definido')
    return
  }
  let doctorId = await getDoctorId()
  const requestBody = {
    doctorId: doctorId,
    templateId: templateId.value,
    name: fieldName
  }

  try {
    const response = await deleteRequest('/doctor/PatientTemplate/fields', requestBody)
    console.log('Campo eliminado exitosamente:', response.message)
    // Actualizar el estado local
    fields.value = fields.value.filter((field) => field.name !== fieldName)
  } catch (error) {
    console.error('Error al eliminar el campo:', error)
    alert(`Error al eliminar el campo: ${error.response?.data?.message || error.message}`)
  } finally {
    isRemoveModalVisible.value = false
    hideContextMenu()
  }
}

async function removeField() {
  const field = selectedField.value
  if (!field || !field.name) {
    alert('Campo inválido para eliminar.')
    return
  }

  await deleteFieldFromTemplate(field.name)
}
</script>

<style scoped>
.record-template-container {
  padding: 2rem 4rem;
  width: 100vw;
  background-color: white;
  height: 100vh;
}

.page-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 2rem;
}

.form-header {
  display: grid;
  grid-template-columns: 3fr 2fr 1fr auto;
  align-items: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
  gap: 20px;
  text-align: center;
  padding: 1rem 1.5rem 1rem 1.5rem;
}

.form-header .header-item:first-child {
  text-align: left;
  padding-left: 10px;
  color: var(--gray-1);
}

.form-header .header-item {
  color: var(--gray-1);
  font-size: 0.9rem;
}
.form-section {
  padding: 0 1.5rem 0 1.5rem;
}

.form-group {
  display: grid;
  grid-template-columns: 3fr 2fr 1fr auto;
  align-items: center;
  margin-bottom: 1rem;
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  gap: 1rem;
}

.form-group:hover {
  background-color: #eaeaea;
}
.form-group * {
  align-items: center;
}

.field-name {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 10px;
}

.field-type,
.field-required,
.field-options {
  display: flex;
  justify-content: center;
  align-items: center;
}
.field-type .select-group {
  margin: 0;
}

.more-options-btn {
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 0.4rem;
  transition: background-color 0.2s ease;
  margin-right: 1.5rem;
}

.more-options-btn:hover {
  background-color: var(--gray-4);
}

.add-field-btn,
.save-button {
  background-color: var(--green-1);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.add-field-btn:hover,
.save-button:hover {
  background-color: var(--green-2);
}

.button-component {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
}

.reconfigure-button-container {
  margin-top: 10px;
}

.reconfigure-button {
  background-color: #ffcc00;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.reconfigure-button:hover {
  background-color: #ff9900;
}

.form-bottom {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

/* Sección de Categorías */
.categories-section {
  display: flex;
  align-items: flex-start;
  margin-top: 20px;
}

.categories-label {
  font-size: 1rem;
  font-weight: bold;
  margin-right: 2rem;
  margin-top: 1rem;
}

.categories-inputs {
  flex-grow: 1;
}

.category-input-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.category-input {
  flex-grow: 1;
  max-width: 18.75rem;
  padding: 1.3rem 0 0.3rem 0; /* padding-top: 0.5rem; padding-right: 0; padding-bottom: 0rem; padding-left: 0 */
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  background-color: transparent;
}

.category-input::placeholder {
  color: #aaa;
}

.category-input:focus {
  border-bottom: 1px solid #000;
}

.delete-btn {
  margin-left: 1rem;
  margin-top: 0.7rem;
  cursor: pointer;
  font-size: 1.2rem;
}

.delete-btn:hover {
  color: darkred;
}

.categories-inputs {
  max-width: 16rem;
}

.category-input-container {
  position: relative;
}

.delete-btn {
  position: absolute;
  right: 0;
}

.category-input {
  padding-right: 25px;
}

.choice-container {
  width: 100%;
  padding-left: 1rem;
}
</style>
