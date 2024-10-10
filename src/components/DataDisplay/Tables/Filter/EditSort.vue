<template>
  <div class="edit-sort">
    <div
      v-for="(sort, index) in localSorts"
      :key="index"
      class="es-container"
      :draggable="false"
      @dragstart="handleDragStart(index)"
      @dragover.prevent=""
      @drop="handleDrop(index)"
      @dragend="handleDragEnd"
    >
      <RiDraggable
        class="drag"
        color="var(--gray-1)"
        @mousedown="enableDrag"
        @mouseleave="disableDrag"
      />

      <div class="e-sort-component">
        <SelectDropDown
          :id="sort.name + sort.mode"
          :options="[sort.name, ...availableFields]"
          v-model:model-value="sort.name"
          :disabled-value="'Escoge un campo'"
        />
        <SelectDropDown
          :id="sort.name + sort.mode"
          :placeholder="'Modo'"
          :options="['Ascendiente', 'Descendiente']"
          v-model:model-value="sort.mode"
          :disabled-value="'Escoge un modo'"
        />
        <RiCloseLine color="var(--red-1)" class="delete" @click.stop="() => deleteSort(index)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import { RiDraggable, RiCloseLine } from '@remixicon/vue'
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  sorts: Array,
  fields: Object
})
// Emits
const emit = defineEmits(['updateSorts'])

// Refs

const localSorts = ref(props.sorts)
const selectedFields = ref(props.sorts.map((sort) => sort.name))
const availableFields = ref(
  Object.keys(props.fields).filter((item) => !selectedFields.value.includes(item))
)

// Functions
watch(
  localSorts,
  () => {
    updateFields()
    emit('updateSorts', localSorts.value)
  },
  { deep: true }
)

const updateFields = () => {
  selectedFields.value = localSorts.value.map((sort) => sort.name)
  availableFields.value = Object.keys(props.fields).filter(
    (item) => !selectedFields.value.includes(item)
  )
}

const deleteSort = (index) => {
  localSorts.value.splice(index, 1)
}

// Drag logic
const draggedItem = ref(null)

const handleDragStart = (key) => {
  draggedItem.value = key
}
const handleDrop = (key) => {
  const droppedItem = localSorts.value.splice(draggedItem.value, 1)[0]
  localSorts.value.splice(key, 0, droppedItem)
}
const handleDragEnd = () => {
  draggedItem.value = null
}
const enableDrag = (event) => {
  event.target.closest('.es-container').setAttribute('draggable', 'true')
}
const disableDrag = (event) => {
  event.target.closest('.es-container').setAttribute('draggable', 'false')
}
</script>

<style scoped>
.e-sort-component {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.e-sort-component * {
  margin: 0;
}

.e-sort-component .delete {
  flex-shrink: 0;
  transition: fill 0.2s;
  cursor: pointer;
}
.e-sort-component .delete:hover {
  fill: var(--red-2);
}
.edit-sort {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.es-container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.es-container .drag {
  flex-shrink: 0;
  transition: fill 0.2s;
  cursor: grab;
}

.es-container .drag:hover {
  fill: var(--gray-2);
}
</style>
