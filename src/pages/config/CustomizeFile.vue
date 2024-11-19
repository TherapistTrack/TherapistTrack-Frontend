<template>
  <div class="template-container" @click="hideContextMenu">
    <h1 class="page-title">{{ fileName }}</h1>
    <p>Aquí puede editar los campos de información que se deben registrar en el archivo.</p>

    <div class="form-header">
      <span class="header-item">Nombre del Campo</span>
      <span class="header-item">Tipo de Dato</span>
      <span class="header-item">Obligatorio</span>
      <span class="header-item">Opciones</span>
    </div>

    <div class="form-section">
      <div v-for="(field, index) in fields" :key="index" class="form-group">
        <div class="field-name">
          <span class="field-label"
            ><b>{{ field.name }}:</b></span
          >
        </div>
        <!-- Tipo de Dato -->
        <div class="field-type">
          <DropdownField
            :id="'dropdown-' + index"
            :label="'Seleccione un tipo'"
            :disabledValue="'Seleccionar...'"
            :options="dataTypes"
            v-model="field.type"
            @change="handleFieldTypeChange(index, $event.target.value)"
            :disabled="!isEditing"
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
          <button class="more-options-btn" @click="handleContextMenu($event, field)">
            <RiMoreFill />
          </button>
        </div>
        <DynamicList
          v-if="field.type == 'CHOICE'"
          title="Opciones disponibles"
          v-model:model-array="field.options"
          @change="handleChoiceChange(index)"
        />
      </div>
      <button class="add-field-btn button-component" @click="showCreateFieldModal">
        Agregar Campo +
      </button>
    </div>

    <ButtonSimple
      v-if="!isEditing"
      msg="Guardar"
      class="save-button button-component"
      @click="saveFile"
    />
    <ButtonSimple
      v-else
      msg="Regresar"
      class="back-button button-component"
      @click="goBackToFiles"
    />

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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Checkbox from '@/components/Forms/CheckBox/CheckBox.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import DropdownField from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import ContextMenu from '@/components/Feedback/Modals/ContextMenu.vue'
import RemoveTemplate from '@/components/Feedback/Modals/RemoveTemplate.vue'
import CreateTemplate from '@/components/Feedback/Modals/CreateTemplate.vue'
import RenameTemplate from '@/components/Feedback/Modals/RenameTemplate.vue'
import { useContextMenu } from '@/components/DataDisplay/Composables/useContextMenu.js'
import { useApi } from '@/oauth/useApi'
import { useAuth0 } from '@auth0/auth0-vue'
import DynamicList from '@/components/Forms/DynamicList/DynamicList.vue'
import { RiMoreFill } from '@remixicon/vue'

const emit = defineEmits('addToast')

const auth0 = useAuth0()
const router = useRouter()
const route = useRoute()
const { getRequest, postRequest, putRequest, deleteRequest } = useApi()

const isEditing = ref(false)

const fileId = ref(route.params.fileId || null)
const fileName = ref(route.query.name || 'Nuevo Archivo')

const dataTypes = ['SHORT_TEXT', 'TEXT', 'NUMBER', 'FLOAT', 'DATE', 'CHOICE']

const fields = ref([
  {
    name: 'Número de Documento',
    type: 'text',
    value: '',
    required: true,
    isConfigured: false,
    options: []
  },
  {
    name: 'Fecha de Emisión',
    type: 'date',
    value: '',
    required: true,
    isConfigured: false,
    options: []
  }
])

const selectedField = ref({})
const isRemoveModalVisible = ref(false)
const isCreateFieldModalVisible = ref(false)
const isRenameModalVisible = ref(false)

const {
  position: contextMenuPosition,
  visible: contextMenuVisible,
  showContextMenu,
  hideContextMenu
} = useContextMenu()

const get_doctor_id = async () => {
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

function showCreateFieldModal() {
  isCreateFieldModalVisible.value = true
}

function showRenameModal() {
  isRenameModalVisible.value = true
}

function goBackToFiles() {
  router.push('/config/files')
}

function addNewField({ name, type, required = false }) {
  const newField = {
    name,
    type,
    required
  }

  // Llamar a la función de agregar campo al servidor
  addFieldToFile(newField)
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
  editFieldInFile(oldFieldName, updatedFieldData)
}

async function saveFile() {
  if (!fileName.value.trim()) {
    alert('El nombre del archivo es requerido')
    return
  }

  // Prepare the request body
  let doctorId = await get_doctor_id()
  const requestBody = {
    doctorId: doctorId,
    name: fileName.value,
    categories: ['General'],
    fields: fields.value.map((field) => ({
      name: field.name,
      type: field.type,
      required: field.required === true,
      options: field.options || [],
      description: field.description || 'Descripción predeterminada'
    }))
  }

  try {
    if (!isEditing.value) {
      // Create the new file
      const response = await postRequest('/doctor/FileTemplate', requestBody)
      console.log('Archivo creado exitosamente:', response)

      // Update fileId and isEditing to reflect the new file
      fileId.value = response.data.fileTemplateId
      isEditing.value = true

      // Redirect or show a success message
      router.push('/config/files')
    } else {
      // Logic for updating the file if needed
    }
  } catch (error) {
    console.error('Error al guardar el archivo:', error)
    if (error.response && error.response.data) {
      alert(`Error al guardar el archivo: ${error.response.data.message}`)
    } else {
      alert('Error al guardar el archivo')
    }
  }
}

async function loadFileData(fileId) {
  try {
    const doctorId = await get_doctor_id()
    const response = await getRequest(
      `/doctor/FileTemplate?doctorId=${doctorId}&templateId=${fileId}`
    )

    if (response.status === 200 && response.data) {
      fileName.value = response.data.name
      fields.value = response.data.fields.map((field) => ({
        ...field,
        isConfigured: true
      }))
      console.log('Datos del archivo cargados:', response.data)
    } else {
      console.error('No se encontraron datos del archivo en la respuesta:', response)
    }
  } catch (error) {
    console.error('Error al cargar los datos del archivo:', error)
  }
}

onMounted(() => {
  if (fileId.value) {
    // Editing an existing file
    isEditing.value = true
    loadFileData(fileId.value)
  } else {
    // Creating a new file
    console.log('Creating a new file without an ID in the backend yet.')
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

async function addFieldToFile(newField) {
  if (!isEditing.value) {
    // Modo creación: agregar el campo localmente
    fields.value.push({ ...newField, isConfigured: true })
    return
  }

  if (!fileId.value) {
    console.error('El fileId no está definido')
    return
  }
  let doctorId = await get_doctor_id()
  const requestBody = {
    doctorId: doctorId,
    templateId: fileId.value, // Cambiar a 'templateId'
    field: {
      name: newField.name,
      type: newField.type,
      required: newField.required === true,
      options: newField.options || [],
      description: newField.description || 'Descripción predeterminada'
    }
  }

  try {
    const response = await postRequest('/doctor/FileTemplate/fields', requestBody)
    console.log('Campo añadido exitosamente:', response.message)
    fields.value.push({ ...newField, isConfigured: true })
  } catch (error) {
    console.error('Error al añadir el campo:', error)
    alert(`Error al añadir el campo: ${error.response?.data?.message || error.message}`)
  }
}

async function editFieldInFile(oldFieldName, updatedFieldData) {
  console.log('old field name: ', oldFieldName)
  if (!fileId.value || !oldFieldName) {
    alert('Información insuficiente para editar el campo')
    return
  }
  let doctorId = await get_doctor_id()
  const requestBody = {
    doctorId: doctorId,
    templateId: fileId.value, // Cambiar a 'color: var(--gray-1)templateId'
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
    const response = await putRequest('/doctor/FileTemplate/fields', requestBody)
    console.log('Campo editado exitosamente:', response.message)
    const index = fields.value.findIndex((field) => field.name === oldFieldName)
    if (index !== -1) {
      fields.value[index] = { ...updatedFieldData, isConfigured: true }
    }
  } catch (error) {
    console.error('Error al editar el campo:', error)
    alert(`Error al editar el campo: ${error.response?.data?.message || error.message}`)
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
  editFieldInFile(oldFieldName, updatedFieldData)
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
  editFieldInFile(oldFieldName, updatedFieldData)
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

  editFieldInFile(oldFieldName, updatedFieldData)
}

async function deleteFieldFromFile(fieldName) {
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
  if (!fileId.value) {
    console.error('El fileId no está definido')
    return
  }
  let doctorId = await get_doctor_id()
  const requestBody = {
    doctorId: doctorId,
    templateId: fileId.value, // Usamos 'templateId' en la solicitud
    name: fieldName
  }

  try {
    const response = await deleteRequest('/doctor/FileTemplate/fields', requestBody)
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

  await deleteFieldFromFile(field.name)
}
</script>

<style scoped>
.template-container {
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
</style>
