<template>
  <div class="template-container" @click="hideContextMenu">
    <SideBarConfig
      backgroundColor="#1f3a93"
      arrowColor="#ffffff"
      iconColor="#ffffff"
      userName="Jose Marchena"
      userRole="Usuario"
      selectedOption="Archivos"
    />

    <div class="content">
      <h1 class="page-title">{{ fileName }}</h1>
      <p>Aquí puede editar los campos de información que se deben registrar en el archivo.</p>

      <div class="form-header">
        <span class="header-item">Nombre del Campo</span>
        <span class="header-item">Tipo de Dato</span>
        <span class="header-item">Opciones</span>
      </div>

      <div class="form-section">
        <div v-for="(field, index) in fields" :key="index" class="form-group">
          <div class="field-name">
            <span class="field-label">{{ field.name }}</span>
          </div>
          <div class="field-type">
            <DropdownField
              v-if="!field.isConfigured"
              :id="'dropdown-' + index"
              :label="'Seleccione un tipo'"
              :disabledValue="'Seleccionar...'"
              :options="dataTypes"
              v-model="field.type"
              @update:modelValue="configureField(index)"
            />
            <div v-else>
              <InputField
                v-if="field.type === 'SHORT_TEXT'"
                :id="'input-' + index"
                type="text"
                :placeholder="field.name"
                maxlength="255"
                v-model="field.value"
              />
              <textarea
                v-if="field.type === 'TEXT'"
                :id="'textarea-' + index"
                :placeholder="field.name"
                v-model="field.value"
                rows="4"
                cols="50"
                @input="autoResizeTextarea($event)"
              ></textarea>
              <input
                v-if="field.type === 'NUMBER' || field.type === 'FLOAT'"
                :id="'number-' + index"
                type="number"
                v-model="field.value"
                @input="validateNumberInput($event)"
              />
              <input
                v-if="field.type === 'DATE'"
                :id="'date-' + index"
                type="date"
                v-model="field.value"
              />
              <!-- Botón para reconfigurar el campo -->
              <button @click="reconfigureField(index)" class="reconfigure-button">
                Cambiar Tipo
              </button>
            </div>
          </div>
          <div class="field-options">
            <button class="more-options-btn" @click="handleContextMenu($event, field)">...</button>
          </div>
        </div>
        <button class="add-field-btn button-component" @click="showCreateFieldModal">
          Agregar Campo +
        </button>
      </div>

      <ButtonSimple msg="Guardar" class="save-button button-component" @click="saveFile" />

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

      <!-- Modal para crear un nuevo campo -->
      <CreateTemplate
        v-if="isCreateFieldModalVisible"
        type="field"
        @close="isCreateFieldModalVisible = false"
        @create="addNewField"
      />

      <!-- Modal para renombrar un campo existente -->
      <RenameTemplate
        v-if="isRenameModalVisible"
        :currentName="selectedField.name"
        type="field"
        @close="isRenameModalVisible = false"
        @rename="renameField"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import InputField from '@/components/Forms/InputField/InputField.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import DropdownField from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import ContextMenu from '@/components/Feedback/Modals/ContextMenu.vue'
import RemoveTemplate from '@/components/Feedback/Modals/RemoveTemplate.vue'
import CreateTemplate from '@/components/Feedback/Modals/CreateTemplate.vue'
import RenameTemplate from '@/components/Feedback/Modals/RenameTemplate.vue'
import { useContextMenu } from '@/components/DataDisplay/Composables/useContextMenu.js'

const route = useRoute()
const fileName = ref(route.query.name || 'Nuevo Archivo')

const dataTypes = ['SHORT_TEXT', 'TEXT', 'NUMBER', 'FLOAT', 'DATE']

const fields = ref([])

const selectedField = ref({})
const isCreateFieldModalVisible = ref(false)
const isRenameModalVisible = ref(false)
const isRemoveModalVisible = ref(false)

const {
  position: contextMenuPosition,
  visible: contextMenuVisible,
  showContextMenu,
  hideContextMenu
} = useContextMenu()

function showCreateFieldModal() {
  isCreateFieldModalVisible.value = true
}

function addNewField({ name, type }) {
  fields.value.push({
    name,
    type,
    value: '',
    isConfigured: true
  })
  isCreateFieldModalVisible.value = false
}

function configureField(index) {
  fields.value[index].isConfigured = true
}

function reconfigureField(index) {
  fields.value[index].isConfigured = false
  fields.value[index].type = ''
}

function handleContextMenu(event, field) {
  event.stopPropagation()
  selectedField.value = field
  showContextMenu(event)
}

function showRenameModal() {
  isRenameModalVisible.value = true
}

function renameField(newName) {
  selectedField.value.name = newName
  isRenameModalVisible.value = false
}

function showRemoveModal() {
  isRemoveModalVisible.value = true
}

function removeField() {
  fields.value = fields.value.filter((field) => field !== selectedField.value)
  hideContextMenu()
}

function autoResizeTextarea(event) {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

function validateNumberInput(event) {
  if (event.target.value < 0) {
    event.target.value = 0
  }
}

function saveFile() {
  console.log('Archivo guardado:', fields.value)
  // Aquí puedes redirigir o hacer alguna acción adicional
}
</script>

<style scoped>
.template-container {
  display: flex;
  height: 100vh;
}

.content {
  flex-grow: 1;
  padding: 65px;
  background-color: #fff;
  border-radius: 8px;
  height: 100vh;
  overflow-y: auto;
}

.page-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
}

.form-header {
  display: grid;
  grid-template-columns: 3fr 2fr auto;
  align-items: center;
  margin-bottom: 15px;
  font-weight: bold;
  padding: 10px 0;
  border-bottom: 2px solid #ddd;
  gap: 20px;
  text-align: center;
}

.form-group {
  display: grid;
  grid-template-columns: 3fr 2fr auto;
  align-items: center;
  margin-bottom: 10px;
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  gap: 20px;
}

.form-group:hover {
  background-color: #eaeaea;
}

.field-name {
  padding-left: 10px;
}

.field-options {
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-field-btn {
  background-color: var(--green-1);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 5px;
  cursor: pointer;
}

.save-button {
  margin-top: 20px;
}

.more-options-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.more-options-btn:hover {
  background-color: #e0e0e0;
}

.reconfigure-button {
  margin-top: 10px;
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
</style>
