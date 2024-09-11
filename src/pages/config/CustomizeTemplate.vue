<template>
  <div class="template-container" @click="hideContextMenu">
    <SideBarConfig
      backgroundColor="#1f3a93"
      arrowColor="#ffffff"
      iconColor="#ffffff"
      userName="Jose Marchena"
      userRole="Administrador"
      selectedOption="Pacientes"
    />

    <div class="content">
      <h1 class="page-title">{{ templateName }}</h1>
      <p>Aquí se puede editar los campos de información que se debe registrar sobre un paciente.</p>

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
              <span>{{ field.type }}</span>
              <div class="reconfigure-button-container">
                <button @click="reconfigureField(index)" class="reconfigure-button">
                  Cambiar Tipo
                </button>
              </div>
            </div>
          </div>
          <div class="field-required">
            <Checkbox :id="'required-' + index" label="" v-model="field.required" />
          </div>
          <div class="field-options">
            <button class="more-options-btn" @click="handleContextMenu($event, field)">...</button>
          </div>
        </div>
        <button class="add-field-btn button-component" @click="showCreateFieldModal">
          Agregar Campo +
        </button>
      </div>

      <ButtonSimple msg="Guardar" class="save-button button-component" @click="saveTemplate" />

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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Checkbox from '@/components/Forms/CheckBox/CheckBox.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import DropdownField from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import ContextMenu from '@/components/Feedback/Modals/ContextMenu.vue'
import RemoveTemplate from '@/components/Feedback/Modals/RemoveTemplate.vue'
import CreateTemplate from '@/components/Feedback/Modals/CreateTemplate.vue'
import RenameTemplate from '@/components/Feedback/Modals/RenameTemplate.vue'
import { useContextMenu } from '@/components/DataDisplay/Composables/useContextMenu.js'

const router = useRouter()
const route = useRoute()

const templateName = ref(route.query.name || 'Plantilla-2024')

const dataTypes = ['SHORT_TEXT', 'TEXT', 'NUMBER', 'FLOAT', 'DATE']

const fields = ref([
  { name: 'Nombres', type: '', value: '', required: true, isConfigured: false },
  { name: 'Apellidos', type: '', value: '', required: true, isConfigured: false },
  { name: 'Hijos', type: '', value: '', required: false, isConfigured: false },
  { name: 'Estado Civil', type: '', value: '', required: false, isConfigured: false }
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

function showCreateFieldModal() {
  isCreateFieldModalVisible.value = true
}

function showRenameModal() {
  isRenameModalVisible.value = true
}

function addNewField({ name, type }) {
  fields.value.push({
    name,
    type,
    value: '',
    required: false,
    isConfigured: true
  })
  isCreateFieldModalVisible.value = false
}

function renameField(newName) {
  selectedField.value.name = newName
  isRenameModalVisible.value = false
}

function saveTemplate() {
  console.log('Plantilla guardada:', fields.value)
  router.push('/config/patients')
}

function handleContextMenu(event, field) {
  event.stopPropagation()
  selectedField.value = field
  showContextMenu(event)
}

function showRemoveModal() {
  isRemoveModalVisible.value = true
}

function removeField() {
  fields.value = fields.value.filter((field) => field !== selectedField.value)
  isRemoveModalVisible.value = false
  hideContextMenu()
}

function configureField(index) {
  fields.value[index].isConfigured = true
}

function reconfigureField(index) {
  fields.value[index].isConfigured = false
  fields.value[index].type = ''
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
  grid-template-columns: 3fr 2fr 1fr auto;
  align-items: center;
  margin-bottom: 15px;
  font-weight: bold;
  padding: 10px 0;
  border-bottom: 2px solid #ddd;
  gap: 20px;
  text-align: center;
}

.form-header .header-item:first-child {
  text-align: left;
  padding-left: 10px;
}

.form-section {
  margin-bottom: 20px;
}

.form-group {
  display: grid;
  grid-template-columns: 3fr 2fr 1fr auto;
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
</style>
