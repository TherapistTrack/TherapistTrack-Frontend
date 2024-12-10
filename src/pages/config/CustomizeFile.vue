<template>
  <div class="template-container" @click="hideContextMenu">
    <h1 class="page-title">{{ fileName }}</h1>
    <p>Aquí puede editar los campos de información que se deben registrar en el archivo.</p>

    <!-- Encabezado de la tabla -->
    <div class="form-header">
      <span class="header-item">Nombre del Campo</span>
      <span class="header-item">Tipo de Dato</span>
      <span class="header-item">Obligatorio</span>
      <span class="header-item">Opciones</span>
    </div>

    <!-- Sección de campos -->
    <div class="form-section">
      <div v-for="(field, index) in fields" :key="index" class="form-group">
        <!-- Nombre del campo -->
        <div class="field-name">
          <span class="field-label"
            ><b>{{ field.name }}:</b></span
          >
        </div>

        <!-- Tipo de dato -->
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

        <!-- Campo obligatorio -->
        <div class="field-required">
          <Checkbox
            :id="'required-' + index"
            label=""
            v-model="field.required"
            @change="handleFieldRequiredChange(index, $event.target.checked)"
          />
        </div>

        <!-- Opciones (menú contextual) -->
        <div class="field-options">
          <RiMoreFill class="more-options-btn" @click="handleContextMenu($event, field)" />
        </div>

        <!-- Lista dinámica (solo para tipo CHOICE) -->
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
        class="save-button button-component"
        @click="saveFile"
      />
      <ButtonSimple
        v-else
        msg="Regresar"
        class="back-button button-component"
        @click="goBackToFiles"
      />
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
 * Este componente permite crear o editar una plantilla de campos asociada a un "archivo".
 * Puede:
 * - Crear un archivo nuevo.
 * - Editar un archivo existente (si se proporciona un fileId en la ruta).
 * - Agregar, renombrar, eliminar y configurar campos de la plantilla.
 */

// Imports Vue
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Imports de componentes
import Checkbox from '@/components/Forms/CheckBox/CheckBox.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import DropdownField from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import ContextMenu from '@/components/Feedback/Modals/ContextMenu.vue'
import RemoveTemplate from '@/components/Feedback/Modals/RemoveTemplate.vue'
import CreateTemplate from '@/components/Feedback/Modals/CreateTemplate.vue'
import RenameTemplate from '@/components/Feedback/Modals/RenameTemplate.vue'
import DynamicList from '@/components/Forms/DynamicList/DynamicList.vue'
import { RiMoreFill } from '@remixicon/vue'

// Imports de lógica y API
import { useContextMenu } from '@/components/DataDisplay/Composables/useContextMenu.js'
import { useApi } from '@/oauth/useApi'
import { useAuth0 } from '@auth0/auth0-vue'

// Emit
const emit = defineEmits(['addToast'])

// Composables
const auth0 = useAuth0()
const router = useRouter()
const route = useRoute()
const { getRequest, postRequest, putRequest, deleteRequest } = useApi()
const {
  position: contextMenuPosition,
  visible: contextMenuVisible,
  showContextMenu,
  hideContextMenu
} = useContextMenu()

// Variables reactivas de estado
const isEditing = ref(false)
const fileId = ref(route.params.fileId || null)
const fileName = ref(route.query.name || 'Nuevo Archivo')
const selectedField = ref({})
const isRemoveModalVisible = ref(false)
const isCreateFieldModalVisible = ref(false)
const isRenameModalVisible = ref(false)

// Datos iniciales
const dataTypes = ['SHORT_TEXT', 'TEXT', 'NUMBER', 'FLOAT', 'DATE', 'CHOICE']
const fields = ref([
  {
    name: 'Número de Documento',
    type: 'text',
    required: true,
    isConfigured: false,
    options: []
  },
  {
    name: 'Fecha de Emisión',
    type: 'date',
    required: true,
    isConfigured: false,
    options: []
  }
])

// Hooks del ciclo de vida
onMounted(() => {
  if (fileId.value) {
    // Editar archivo existente
    isEditing.value = true
    loadFileData(fileId.value)
  } else {
    // Crear nuevo archivo
    console.log('Creando un nuevo archivo.')
  }
})

/**
 * Obtiene el ID del doctor autenticado.
 */
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

/**
 * Carga los datos de un archivo existente en base a su ID.
 * @param {String} id - ID del archivo
 */
async function loadFileData(id) {
  try {
    const doctorId = await getDoctorId()
    if (!doctorId) return

    const response = await getRequest(`/doctor/FileTemplate?doctorId=${doctorId}&templateId=${id}`)
    if (response.status === 200 && response.data) {
      fileName.value = response.data.name
      fields.value = response.data.fields.map((field) => ({ ...field, isConfigured: true }))
    } else {
      console.error('No se encontraron datos del archivo:', response)
    }
  } catch (error) {
    console.error('Error al cargar los datos del archivo:', error)
  }
}

/**
 * Guarda el archivo actual (creando uno nuevo si no existe, o actualizando si ya existe).
 */
async function saveFile() {
  if (!fileName.value.trim()) {
    alert('El nombre del archivo es requerido')
    return
  }

  const doctorId = await getDoctorId()
  if (!doctorId) return

  const requestBody = {
    doctorId: doctorId,
    name: fileName.value,
    categories: ['General'],
    fields: fields.value.map((field) => ({
      name: field.name,
      type: field.type,
      required: !!field.required,
      options: field.options || [],
      description: field.description || 'Descripción predeterminada'
    }))
  }

  try {
    if (!isEditing.value) {
      // Crear un archivo nuevo
      const response = await postRequest('/doctor/FileTemplate', requestBody)
      fileId.value = response.data.fileTemplateId
      isEditing.value = true
      router.push('/config/files')
    } else {
      // Lógica para actualizar el archivo existente (pendiente si se requiere)
    }
  } catch (error) {
    console.error('Error al guardar el archivo:', error)
    const message = error.response?.data?.message || 'Error al guardar el archivo'
    alert(message)
  }
}

/**
 * Retorna a la vista de archivos configurados.
 */
function goBackToFiles() {
  router.push('/config/files')
}

/**
 * Muestra el modal para crear un nuevo campo.
 */
function showCreateFieldModal() {
  isCreateFieldModalVisible.value = true
}

/**
 * Muestra el modal para renombrar el campo seleccionado.
 */
function showRenameModal() {
  isRenameModalVisible.value = true
}

/**
 * Muestra el modal para eliminar el campo seleccionado.
 */
function showRemoveModal() {
  isRemoveModalVisible.value = true
}

/**
 * Maneja la creación de un nuevo campo.
 * @param {Object} param0 - Objeto con propiedades del nuevo campo: { name, type, required }
 */
function addNewField({ name, type, required = false }) {
  const newField = { name, type, required }
  addFieldToFile(newField)
  isCreateFieldModalVisible.value = false
}

/**
 * Renombra un campo existente.
 * @param {String} newName - Nuevo nombre para el campo.
 */
function renameField(newName) {
  const field = selectedField.value
  const oldFieldName = field.name
  field.name = newName
  isRenameModalVisible.value = false

  if (!isEditing.value) return // Modo creación: cambios locales

  const updatedFieldData = { ...field, name: newName }
  editFieldInFile(oldFieldName, updatedFieldData)
}

/**
 * Añade un campo al archivo (local o servidor).
 * @param {Object} newField - Campo a agregar.
 */
async function addFieldToFile(newField) {
  if (!isEditing.value) {
    // Modo creación: agregar localmente
    fields.value.push({ ...newField, isConfigured: true })
    return
  }

  if (!fileId.value) {
    console.error('No se puede añadir campo sin fileId')
    return
  }

  const doctorId = await getDoctorId()
  if (!doctorId) return

  const requestBody = {
    doctorId,
    templateId: fileId.value,
    field: {
      name: newField.name,
      type: newField.type,
      required: !!newField.required,
      options: newField.options || [],
      description: newField.description || 'Descripción predeterminada'
    }
  }

  try {
    await postRequest('/doctor/FileTemplate/fields', requestBody)
    fields.value.push({ ...newField, isConfigured: true })
  } catch (error) {
    console.error('Error al añadir el campo:', error)
    alert(`Error al añadir el campo: ${error.response?.data?.message || error.message}`)
  }
}

/**
 * Edita un campo en el archivo.
 * @param {String} oldFieldName - Nombre anterior del campo.
 * @param {Object} updatedFieldData - Datos actualizados del campo.
 */
async function editFieldInFile(oldFieldName, updatedFieldData) {
  if (!fileId.value || !oldFieldName) {
    alert('Información insuficiente para editar el campo')
    return
  }

  const doctorId = await getDoctorId()
  if (!doctorId) return

  const requestBody = {
    doctorId,
    templateId: fileId.value,
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
    await putRequest('/doctor/FileTemplate/fields', requestBody)
    const index = fields.value.findIndex((field) => field.name === oldFieldName)
    if (index !== -1) {
      fields.value[index] = { ...updatedFieldData, isConfigured: true }
    }
  } catch (error) {
    console.error('Error al editar el campo:', error)
    alert(`Error al editar el campo: ${error.response?.data?.message || error.message}`)
  }
}

/**
 * Maneja el cambio de opciones de un campo tipo CHOICE.
 * @param {Number} index - Índice del campo en el array.
 */
function handleChoiceChange(index) {
  if (!isEditing.value) return
  const field = fields.value[index]
  const oldFieldName = field.name
  const options = field.options || []

  if (!options.length) return

  const updatedFieldData = { ...field, options }
  editFieldInFile(oldFieldName, updatedFieldData)
}

/**
 * Maneja el cambio de tipo de dato de un campo.
 * @param {Number} index - Índice del campo.
 * @param {String} newType - Nuevo tipo de dato.
 */
function handleFieldTypeChange(index, newType) {
  const field = fields.value[index]
  const oldFieldName = field.name
  field.type = newType

  if (!isEditing.value) return // Modo creación: solo local

  const updatedFieldData = { ...field, type: newType }
  editFieldInFile(oldFieldName, updatedFieldData)
}

/**
 * Maneja el cambio en el campo obligatorio.
 * @param {Number} index - Índice del campo.
 * @param {Boolean} isRequired - Nuevo valor de "required".
 */
function handleFieldRequiredChange(index, isRequired) {
  const field = fields.value[index]
  const oldFieldName = field.name
  field.required = isRequired

  if (!isEditing.value) return // Modo creación: solo local

  const updatedFieldData = { ...field, required: isRequired }
  editFieldInFile(oldFieldName, updatedFieldData)
}

/**
 * Elimina un campo del archivo, ya sea localmente o en el servidor.
 * @param {String} fieldName - Nombre del campo a eliminar.
 */
async function deleteFieldFromFile(fieldName) {
  if (!fieldName) {
    alert('Información insuficiente para eliminar el campo.')
    return
  }

  if (!isEditing.value) {
    // Modo creación: eliminar localmente
    fields.value = fields.value.filter((f) => f.name !== fieldName)
    isRemoveModalVisible.value = false
    hideContextMenu()
    return
  }

  if (!fileId.value) {
    console.error('No se puede eliminar campo sin fileId')
    return
  }

  const doctorId = await getDoctorId()
  if (!doctorId) return

  const requestBody = { doctorId, templateId: fileId.value, name: fieldName }

  try {
    await deleteRequest('/doctor/FileTemplate/fields', requestBody)
    fields.value = fields.value.filter((f) => f.name !== fieldName)
  } catch (error) {
    console.error('Error al eliminar el campo:', error)
    alert(`Error al eliminar el campo: ${error.response?.data?.message || error.message}`)
  } finally {
    isRemoveModalVisible.value = false
    hideContextMenu()
  }
}

/**
 * Confirma la eliminación de un campo.
 */
async function removeField() {
  const field = selectedField.value
  if (!field || !field.name) {
    alert('Campo inválido para eliminar.')
    return
  }
  await deleteFieldFromFile(field.name)
}

/**
 * Maneja la apertura del menú contextual en un campo.
 * @param {Event} event - Evento del click.
 * @param {Object} field - Campo sobre el que se hace click.
 */
function handleContextMenu(event, field) {
  event.stopPropagation()
  selectedField.value = field
  showContextMenu(event)
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
  padding: 1rem 1.5rem;
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
  padding: 0 1.5rem;
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

.form-bottom {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.button-component {
  transition: background-color 0.2s;
}
</style>
