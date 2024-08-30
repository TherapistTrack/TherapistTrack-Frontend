<template>
  <div
    v-if="props.visible"
    class="context-menu"
    :style="{ top: props.position.y + 'px', left: props.position.x + 'px' }"
  >
    <button class="menu-button" @click="onRename">Renombrar</button>
    <button class="menu-button danger" @click="onRemove">Eliminar</button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  position: {
    type: Object,
    required: true
  },
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['rename', 'remove'])

function onRename() {
  emit('rename')
}

function onRemove() {
  emit('remove')
}
</script>

<style scoped>
.context-menu {
  position: fixed;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.menu-button {
  background-color: transparent;
  border: none;
  padding: 0.5rem 1rem;
  text-align: left;
  cursor: pointer;
  color: #000;
  font-size: 16px;
}

.menu-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.danger {
  color: red;
}

.menu-button:last-child {
  margin-bottom: 0;
}
</style>
