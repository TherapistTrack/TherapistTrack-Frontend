<template>
  <div class="table-overlayContainer" @click="goBack()" :id="start ? 'init' : 'end'">
    <div class="table-settings" @click.stop="" :id="start ? 'init' : 'end'">
      <div class="top">
        <SearchBar :pholder="'Buscar por Nombre'" v-model:search-value="search" />
      </div>
      <div class="do-show">
        <p class="title">Mostrar en la tabla</p>
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
          <RiEyeFill
            class="see-icon"
            color="var(--gray-1)"
            size="1.1rem"
            @click="deactivateField(item)"
          />
        </div>
      </div>

      <div class="no-show">
        <p class="title">Ocultar en la Tabla</p>
        <template v-for="(item, key) in props.allHeaders" :key="key">
          <div v-if="!Object.values(localShownHeaders).includes(item)" class="inactive-field">
            <span>
              <RiDraggable color="var(--gray-1)" size="1.3rem" />
              <p>{{ item }}</p>
            </span>
            <RiEyeOffFill color="var(--gray-2)" size="1.1rem" @click="activateField(item)" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RiEyeFill, RiEyeOffFill, RiDraggable } from '@remixicon/vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from '@/components/Forms/InputField/SearchBar.vue'
const props = defineProps({
  allHeaders: Object,
  shownHeaders: Object
})

const emit = defineEmits(['update:shownHeaders'])

const start = ref(false)
const search = ref('')
const router = useRouter()
const localShownHeaders = ref(props.shownHeaders)
const draggedItem = ref(null)

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
    router.back()
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
}

.table-settings {
  position: absolute;
  right: -220px;
  z-index: 400;
  background-color: white;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 2vh 0 0 0;
  width: 270px;
  height: 80vh;
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
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
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
</style>
