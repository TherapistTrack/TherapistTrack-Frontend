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
            @keyup.enter="handleCategoryEnter(index, $event)"
            placeholder="Escribe una categoría..."
            class="category-input"
          />
          <RiCloseLine
            v-if="category.trim() !== ''"
            class="delete-btn"
            @click.stop="removeCategory(index)"
            color="red"
          />
        </div>
      </div>
    </div>

    <!-- Encabezado de la tabla de campos -->
    <div class="form-header">
      <span class="header-item">Nombre del Campo</span>
      <span class="header-item">Tipo de Dato</span>
      <span class="header-item">Obligatorio</span>
      <span class="header-item">Opciones</span>
    </div>

    <!-- Lista de campos -->
    <div class="form-section">
      <div v-for="(field, index) in fields" :key="index" class="form-group">
        <!-- Nombre del campo -->
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

        <!-- Campo Obligatorio -->
        <div class="field-required">
          <Checkbox
            :id="'required-' + index"
            label=""
            v-model="field.required"
            @change="handleFieldRequiredChange(index, $event.target.checked)"
          />
        </div>

        <!-- Opciones (Context Menu) -->
        <div class="field-options">
          <RiMoreFill class="more-options-btn" @click="handleContextMenu($event, field)" />
        </div>

        <!-- Opciones adicionales si es CHOICE -->
        <div class="choice-container">
          <DynamicList
            v-if="field.type === 'CHOICE'"
            title="Opciones"
            v-model:model-array="field.options"
            @change="handleChoiceChange(index)"
          />
        </div>
      </div>

      <!-- Botones inferiores -->
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

    <!-- Menú contextual -->
    <ContextMenu
      :position="contextMenuPosition"
      :visible="contextMenuVisible"
      @remove="showRemoveModal"
      @rename="showRenameModal"
    />

    <!-- Modales -->
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
/**
 * Este componente permite crear o editar una plantilla de paciente.
 * Se pueden:
 *  - Agregar / renombrar / eliminar campos.
 *  - Definir categorías.
 *  - Guardar o actualizar la plantilla en el backend.
 */

import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Componentes internos
import Checkbox from '@/components/Forms/CheckBox/CheckBox.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import DropdownField from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import ContextMenu from '@/components/Feedback/Modals/ContextMenu.vue'
import RemoveTemplate from '@/components/Feedback/Modals/RemoveTemplate.vue'
import CreateTemplate from '@/components/Feedback/Modals/CreateTemplate.vue'
import RenameTemplate from '@/components/Feedback/Modals/RenameTemplate.vue'
import DynamicList from '@/components/Forms/DynamicList/DynamicList.vue'

// Iconos
import { RiMoreFill, RiCloseLine } from '@remixicon/vue'

// Composables
import { useContextMenu } from '@/components/DataDisplay/Composables/useContextMenu.js'
import { useApi } from '@/oauth/useApi'
import { useAuth0 } from '@auth0/auth0-vue'

// Emisor de eventos
const emit = defineEmits(['addToast'])

// Router & API
const router = useRouter()
const route = useRoute()
const { getRequest, postRequest, putRequest, deleteRequest } = useApi()
const auth0 = useAuth0()

// Estado principal
const isEditing = ref(false)
const templateId = ref(route.params.templateId || null)
const templateName = ref(route.query.name || 'Nueva Plantilla')
const dataTypes = ['SHORT_TEXT', 'TEXT', 'NUMBER', 'FLOAT', 'DATE', 'CHOICE']

// Estado inicial de campos (ejemplo)
const fields = ref([
  { name: 'Primer Nombre', type: '', required: true, isConfigured: false },
  { name: 'Apellido Familiar', type: '', required: true, isConfigured: false },
  { name: 'Hijos', type: '', required: false, isConfigured: false },
  { name: 'Estado Civil', type: '', required: false, isConfigured: false }
])

const selectedField = ref({})
const isRemoveModalVisible = ref(false)
const isCreateFieldModalVisible = ref(false)
const isRenameModalVisible = ref(false)
const categories = ref([''])

// Context Menu
const {
  position: contextMenuPosition,
  visible: contextMenuVisible,
  showContextMenu,
  hideContextMenu
} = useContextMenu()

// ===========================================================
// Hooks
// ===========================================================
onMounted(() => {
  if (templateId.value) {
    // Modo edición: cargar datos del servidor
    isEditing.value = true
    loadTemplateData(templateId.value)
  } else {
    // Modo creación: sin ID definido aún
    // No se requiere acción adicional.
  }

  // Obtener token
  auth0
    .getAccessTokenSilently()
    .then(() => {
      console.log('Access Token obtenido correctamente.')
    })
    .catch((error) => {
      console.error('Error obteniendo Access Token:', error)
    })
})

// ===========================================================
// Funciones utilitarias y API
// ===========================================================
async function getDoctorId() {
  let userId = auth0.user.value.sub.split('|')[1]
  try {
    const response = await postRequest('/users/@me', { id: userId })
    return response.data.roleDependentInfo.id
  } catch {
    emit('addToast', { content: 'Ocurrió un error obteniendo información del doctor', type: 0 })
    return ''
  }
}

async function loadTemplateData(id) {
  try {
    const doctorId = await getDoctorId()
    if (!doctorId) return

    const response = await getRequest(
      `/doctor/PatientTemplate?doctorId=${doctorId}&templateId=${id}`
    )
    if (response.status === 200 && response.data) {
      templateName.value = response.data.name
      categories.value = response.data.categories || ['']

      // Asegurar último campo vacío para nueva categoría
      if (
        categories.value.length === 0 ||
        categories.value[categories.value.length - 1].trim() !== ''
      ) {
        categories.value.push('')
      }

      fields.value = response.data.fields.map((field) => ({ ...field, isConfigured: true }))
    } else {
      console.error('No se encontraron datos de la plantilla:', response)
    }
  } catch (error) {
    console.error('Error al cargar datos de la plantilla:', error)
  }
}

// ===========================================================
// Manejo de Categorías
// ===========================================================
function handleCategoryFocus(index) {
  // Si el usuario se enfoca en la última categoría y no está vacía, agregar una nueva vacía
  if (index === categories.value.length - 1 && categories.value[index].trim() !== '') {
    categories.value.push('')
  }
}

function handleCategoryBlur(index) {
  const current = categories.value[index].trim()
  // Eliminar la categoría vacía si no es la última
  if (current === '' && categories.value.length > 1) {
    categories.value.splice(index, 1)
  }
  // Asegurar que exista un último campo vacío
  if (index === categories.value.length - 1 && current !== '') {
    categories.value.push('')
  }
}

function handleCategoryEnter(index, event) {
  event.preventDefault()
  const current = categories.value[index].trim()

  // Si presiona Enter en la última categoría y no está vacía, agregar otra
  if (index === categories.value.length - 1 && current !== '') {
    categories.value.push('')
  }

  // Mover el foco a la siguiente entrada
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

// ===========================================================
// Manejo de Campos (CHOICE, etc.)
// ===========================================================
function handleChoiceChange(index) {
  if (!isEditing.value) return
  const field = fields.value[index]
  const options = field.options || []
  if (options.length === 0) return

  const oldFieldName = field.name
  const updatedFieldData = { ...field, options }
  editFieldInTemplate(oldFieldName, updatedFieldData)
}

// ===========================================================
// Manejo del Context Menu
// ===========================================================
function handleContextMenu(event, field) {
  event.stopPropagation()
  selectedField.value = field
  showContextMenu(event)
}

function showRemoveModal() {
  isRemoveModalVisible.value = true
}

function showCreateFieldModal() {
  isCreateFieldModalVisible.value = true
}

function showRenameModal() {
  isRenameModalVisible.value = true
}

// ===========================================================
// Navegación
// ===========================================================
function goBackToPatients() {
  emit('addToast', { type: 1, content: 'Plantilla editada exitosamente' })
  router.push('/config/patients')
}

// ===========================================================
// Guardar/Crear Plantilla
// ===========================================================
async function saveTemplate() {
  if (!templateName.value.trim()) {
    alert('El nombre de la plantilla es requerido')
    return
  }

  const validCategories = categories.value.map((c) => c.trim()).filter((c) => c !== '')
  if (validCategories.length === 0) {
    alert('Debe agregar al menos una categoría.')
    return
  }

  const doctorId = await getDoctorId()
  if (!doctorId) return

  const requestBody = {
    doctorId,
    name: templateName.value,
    categories: validCategories,
    fields: fields.value.map((field) => ({
      name: field.name,
      type: field.type,
      required: !!field.required,
      options: field.options || [],
      description: field.description || 'Descripción predeterminada'
    }))
  }

  try {
    if (isEditing.value) {
      // Actualizar plantilla existente
      requestBody.templateId = templateId.value
      await putRequest('/doctor/PatientTemplate', requestBody)
      alert('Plantilla actualizada exitosamente')
    } else {
      // Crear nueva plantilla
      const response = await postRequest('/doctor/PatientTemplate', requestBody)
      templateId.value = response.data.patientTemplateId
      isEditing.value = true
      alert('Plantilla creada exitosamente')
    }
    emit('addToast', { type: 1, content: 'Plantilla guardada exitosamente' })
    router.push('/config/patients')
  } catch (error) {
    emit('addToast', { type: 0, content: 'Hubo un error guardando la plantilla' })
    console.error('Error al guardar la plantilla:', error)
    const message = error.response?.data?.message || 'Error al guardar la plantilla'
    alert(message)
  }
}

// ===========================================================
// CRUD de Campos
// ===========================================================
async function addNewField({ name, type, required = false }) {
  const newField = { name, type, required }
  addFieldToTemplate(newField)
  isCreateFieldModalVisible.value = false
}

async function addFieldToTemplate(newField) {
  if (!isEditing.value) {
    // Modo creación: agregar localmente
    fields.value.push({ ...newField, isConfigured: true })
    return
  }

  if (!templateId.value) {
    console.error('No se puede añadir campo sin templateId')
    return
  }

  const doctorId = await getDoctorId()
  if (!doctorId) return

  const requestBody = {
    doctorId,
    templateId: templateId.value,
    field: {
      name: newField.name,
      type: newField.type,
      required: !!newField.required,
      options: newField.options || [],
      description: newField.description || 'Descripción predeterminada'
    }
  }

  try {
    await postRequest('/doctor/PatientTemplate/fields', requestBody)
    fields.value.push({ ...newField, isConfigured: true })
  } catch (error) {
    console.error('Error al añadir el campo:', error)
    alert(`Error al añadir el campo: ${error.response?.data?.message || error.message}`)
  }
}

async function editFieldInTemplate(oldFieldName, updatedFieldData) {
  if (!templateId.value || !oldFieldName) {
    alert('Información insuficiente para editar el campo')
    return
  }

  const doctorId = await getDoctorId()
  if (!doctorId) return

  const requestBody = {
    doctorId,
    templateId: templateId.value,
    oldFieldName,
    fieldData: {
      name: updatedFieldData.name,
      type: updatedFieldData.type,
      required: !!updatedFieldData.required,
      options: updatedFieldData.options || [],
      description: updatedFieldData.description || 'Descripción predeterminada'
    }
  }

  try {
    await putRequest('/doctor/PatientTemplate/fields', requestBody)
    const index = fields.value.findIndex((f) => f.name === oldFieldName)
    if (index !== -1) {
      fields.value[index] = { ...updatedFieldData, isConfigured: true }
    }
  } catch (error) {
    console.error('Error al editar el campo:', error)
    alert(`Error al editar el campo: ${error.response?.data?.message || error.message}`)
  }
}

function renameField(newName) {
  const field = selectedField.value
  const oldFieldName = field.name
  field.name = newName
  isRenameModalVisible.value = false

  if (!isEditing.value) return // Modo creación: solo local

  const updatedFieldData = { ...field, name: newName }
  editFieldInTemplate(oldFieldName, updatedFieldData)
}

async function removeField() {
  const field = selectedField.value
  if (!field || !field.name) {
    alert('Campo inválido para eliminar.')
    return
  }
  await deleteFieldFromTemplate(field.name)
}

async function deleteFieldFromTemplate(fieldName) {
  if (!fieldName) {
    alert('Información insuficiente para eliminar el campo.')
    return
  }

  if (!isEditing.value) {
    // Modo creación: eliminar localmente
    fields.value = fields.value.filter((field) => field.name !== fieldName)
    isRemoveModalVisible.value = false
    hideContextMenu()
    return
  }

  if (!templateId.value) {
    console.error('El templateId no está definido')
    return
  }

  const doctorId = await getDoctorId()
  if (!doctorId) return

  const requestBody = {
    doctorId,
    templateId: templateId.value,
    name: fieldName
  }

  try {
    await deleteRequest('/doctor/PatientTemplate/fields', requestBody)
    fields.value = fields.value.filter((field) => field.name !== fieldName)
  } catch (error) {
    console.error('Error al eliminar el campo:', error)
    alert(`Error al eliminar el campo: ${error.response?.data?.message || error.message}`)
  } finally {
    isRemoveModalVisible.value = false
    hideContextMenu()
  }
}

// ===========================================================
// Manejo de Cambios Simples en Campos
// ===========================================================
function handleFieldTypeChange(index, newType) {
  const field = fields.value[index]
  const oldFieldName = field.name
  field.type = newType

  if (!isEditing.value) return
  const updatedFieldData = { ...field, type: newType }
  editFieldInTemplate(oldFieldName, updatedFieldData)
}

function handleFieldRequiredChange(index, isRequired) {
  const field = fields.value[index]
  const oldFieldName = field.name
  field.required = isRequired

  if (!isEditing.value) return
  const updatedFieldData = { ...field, required: isRequired }
  editFieldInTemplate(oldFieldName, updatedFieldData)
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

/* Encabezado de campos */
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

/* Grupo de campos */
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

.button-component {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
}

/* Sección inferior de la forma */
.form-bottom {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

/* Categorías */
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
  max-width: 16rem;
}

.category-input-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
}

.category-input {
  flex-grow: 1;
  max-width: 18.75rem;
  padding: 1.3rem 0 0.3rem 0;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  background-color: transparent;
  padding-right: 25px;
}

.category-input::placeholder {
  color: #aaa;
}

.category-input:focus {
  border-bottom: 1px solid #000;
}

.delete-btn {
  position: absolute;
  right: 0;
  margin-top: 0.7rem;
  cursor: pointer;
  font-size: 1.2rem;
}

.delete-btn:hover {
  color: darkred;
}

.choice-container {
  width: 100%;
  padding-left: 1rem;
}
</style>
