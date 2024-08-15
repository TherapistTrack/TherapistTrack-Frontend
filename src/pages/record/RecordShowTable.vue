<template>
  <div class="table-overlayContainer" @click="goBack()" :id="start ? 'init' : 'end'">
    <div class="table-settings" @click.stop="" :id="start ? 'init' : 'end'">
      <div class="top">
        <SearchBar :pholder="'Buscar por Nombre'" />
      </div>
      <div class="do-show">
        <p>Mostrar en la tabla</p>
        <div v-for="(item, key) in localShownHeaders" :key="key" class="active-field">
          <span>
            <RiDraggable color="var(--gray-1)" size="1.3rem" />
            {{ item }}
          </span>
          <RiEyeFill color="var(--gray-1)" size="1.3rem" @click="deactivateField(key)" />
        </div>
      </div>

      <div class="no-show">
        <p>Ocultar en la Tabla</p>
        <template v-for="(item, key) in props.allHeaders" :key="key">
          <div v-if="!Object.keys(localShownHeaders).includes(key)" class="inactive-field">
            <span>
              <RiDraggable color="var(--gray-1)" size="1.3rem" />
              {{ item }}
            </span>
            <RiEyeOffFill color="var(--gray-2)" size="1.3rem" @click="activateField(key)" />
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

const start = ref(false)
const router = useRouter()
const localShownHeaders = ref({ ...props.shownHeaders })

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

const deactivateField = (key) => {
  delete localShownHeaders.value[key]
  updateShownHeaders()
}

const activateField = (key) => {
  if (!localShownHeaders.value[key]) {
    localShownHeaders.value[key] = props.allHeaders[key]
  }
  updateShownHeaders()
}
// Emiting change for shown headers:
const emit = defineEmits(['update:shownHeaders'])
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

.table-settings {
  position: absolute;
  right: -220px;
  z-index: 400;
  background-color: white;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 2vh 0 0 0;
  width: 220px;
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
}

.table-settings .active-field *,
.table-settings .inactive-field * {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
