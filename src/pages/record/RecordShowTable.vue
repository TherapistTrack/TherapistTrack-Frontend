<template>
  <div class="table-overlayContainer" @click="goBack()" :id="start ? 'init' : 'end'">
    <div class="table-settings" @click.stop="" :id="start ? 'init' : 'end'">
      <div class="top">
        <SearchBar :pholder="'Buscar por Nombre'" v-model:search-value="search" />
      </div>
      <p class="title">Mostrar en la tabla</p>
      <div class="do-show">
        <div
          v-for="(item, key) in localShownHeaders"
          :key="key"
          class="active-field"
          :draggable="false"
          @dragstart="handleDragStart(key)"
          @dragover.prevent=""
          @drop="handleDrop(key)"
          @dragend="handleDragEnd"
        >
          <span>
            <RiDraggable
              class="drag-icon"
              @mousedown="enableDrag"
              @mouseleave="disableDrag"
              color="var(--gray-1)"
              size="1.3rem"
            />
            <p>{{ item }}</p>
          </span>
          <span>
            <TypeIconLoader :iconType="fields[item].type" />
            <!-- <object class="icon" :data="typeIconTranslate[fields[item].type]" /> -->
            <RiEyeFill
              class="see-icon"
              color="var(--gray-1)"
              size="1.1rem"
              @click="deactivateField(item)"
            />
          </span>
        </div>
      </div>
      <div class="no-show">
        <span
          v-for="type in ['SHORT_TEXT', 'TEXT', 'CHOICE', 'DATE', 'NUMBER', 'FLOAT']"
          :key="type"
        >
          <div class="type-title">
            <p>{{ titleTranslate[type] }}</p>
            <TypeIconLoader :icon-type="type" />
          </div>
          <span
            v-for="(item, key) in allHeaders.filter(
              (item) =>
                fields[item].type == type && !Object.values(localShownHeaders).includes(item)
            )"
            :key="key"
          >
            <div class="inactive-field">
              <p>{{ item }}</p>
              <RiEyeOffFill color="var(--gray-2)" size="1.1rem" @click="activateField(item)" />
            </div>
          </span>
        </span>

        <!-- <template v-for="(item, key) in props.allHeaders" :key="key">
          <div v-if="!Object.values(localShownHeaders).includes(item)" class="inactive-field">
            <span>
              <p>{{ item }}</p>
            </span>
            <RiEyeOffFill color="var(--gray-2)" size="1.1rem" @click="activateField(item)" />
          </div>
        </template> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { RiEyeFill, RiEyeOffFill, RiDraggable } from '@remixicon/vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from '@/components/Forms/InputField/SearchBar.vue'
import TypeIconLoader from '@/assets/TypeIcons/TypeIconLoader.vue'
const props = defineProps({
  allHeaders: Object,
  shownHeaders: Object,
  fields: Object
})

const emit = defineEmits(['update:shownHeaders'])

const start = ref(false)
const search = ref('')
const router = useRouter()
const localShownHeaders = ref(props.shownHeaders)
const draggedItem = ref(null)
const titleTranslate = ref({
  TEXT: 'Texto',
  SHORT_TEXT: 'Texto Corto',
  DATE: 'Fecha',
  CHOICE: 'Selección',
  NUMBER: 'Numero',
  FLOAT: 'Decimal'
})

const handleDragStart = (key) => {
  draggedItem.value = key
}

const handleDrop = (key) => {
  const droppedItem = localShownHeaders.value.splice(draggedItem.value, 1)[0]
  localShownHeaders.value.splice(key, 0, droppedItem)
}

const handleDragEnd = () => {
  draggedItem.value = null
}
const enableDrag = (event) => {
  event.target.closest('.active-field').setAttribute('draggable', 'true')
}

const disableDrag = (event) => {
  event.target.closest('.active-field').setAttribute('draggable', 'false')
}
onMounted(() => {
  setTimeout(() => {
    start.value = true
  }, 2) // You can adjust the delay if needed
})

const goBack = () => {
  start.value = false
  setTimeout(() => {
    router.push('/record/main')
  }, 250) // You can adjust the delay if needed
}

const deactivateField = (field) => {
  localShownHeaders.value.splice(localShownHeaders.value.indexOf(field), 1)
  updateShownHeaders()
}

const activateField = (field) => {
  if (!localShownHeaders.value.includes(field)) {
    localShownHeaders.value.push(field)
    updateShownHeaders()
  }
}
// Emiting change for shown headers:
const updateShownHeaders = () => {
  emit('update:shownHeaders', localShownHeaders.value)
}
</script>

<style>
.type-title {
  margin-top: 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  border-bottom: 1px solid var(--gray-3);
  margin-bottom: 0.5rem;
}
.type-title p {
  color: var(--gray-1);
}
.table-overlayContainer {
  height: 100%;
  width: 100%;
  z-index: 300;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: start;
  align-items: end;
  transition: background-color 0.3s;
  background-color: rgba(0, 0, 0, 0.4);
}

.table-overlayContainer#init {
  background-color: rgba(0, 0, 0, 0.4);
}

.table-overlayContainer#end {
  background-color: none;
}

.table-overlayContainer p {
  font-size: small;
}
.table-overlayContainer .title {
  color: var(--gray-1);
  margin-top: 1rem;
}

.table-settings {
  position: absolute;
  right: -220px;
  z-index: 400;
  background-color: white;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 2vh 0 0 0;
  width: 290px;
  height: 85vh;
  padding: 1.5rem;
  transition: right 0.3s;
}

.table-settings#init {
  right: 0;
}

.table-settings#end {
  right: -400px;
}

.table-settings .top {
  width: 10px;
}

/* Areas */
.table-settings .do-show,
.table-settings .no-show {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  overflow-y: scroll;
}
.no-show {
  margin-top: 1rem;
}

/* Draggable Fields */
.table-settings .active-field,
.table-settings .inactive-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: smaller;
  height: fit-content;
  transition: height 1s;
  padding: 0.1rem;
  padding-right: 0.4rem;
}

.table-settings .active-field .drag-icon {
  cursor: grab;
}
.table-settings .active-field .see-icon {
  cursor: pointer;
}

.table-settings .active-field:hover,
.table-settings .inactive-field:hover {
  background-color: var(--gray-3);
}
.table-settings .active-field *,
.table-settings .inactive-field * {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.inactive-field {
  margin-left: 1rem;
}
.icon {
  height: 0.9rem;
  width: 0.9rem;
}
</style>
