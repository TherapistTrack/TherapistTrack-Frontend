<template>
  <div class="fot-container" ref="myDiv">
    <div class="fot-component">
      <div class="fot-edit-row" @click="handleEdit">
        <RiEditBoxLine size="1.2rem" />
        <p>Editar</p>
      </div>
      <div class="fot-delete-row" @click="handleDelete">
        <RiDeleteBin7Fill size="1.2rem" />
        <p>Eliminar</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { RiEditBoxLine, RiDeleteBin7Fill } from '@remixicon/vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
const myDiv = ref(null)
const emit = defineEmits(['closeTooltip', 'onEdit', 'onDelete'])

const handleEdit = () => {
  emit('onEdit')
  emit('closeTooltip')
}

const handleDelete = () => {
  emit('onDelete')
  emit('closeTooltip')
}
const handleClickOutside = (event) => {
  if (myDiv.value && !myDiv.value.contains(event.target)) {
    emit('closeTooltip')
  }
}
onMounted(() => {
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside)
  }, 1)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside) // Step 4: Remove event listener on unmount
})
</script>
<style scoped>
.fot-container {
  position: absolute;
}
.fot-component {
  position: absolute;
  top: -4rem;
  left: 2rem;
  background-color: white;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
  padding: 0.5rem;
}
.fot-edit-row,
.fot-delete-row {
  display: flex;
  gap: 1rem;
  padding: 0.2rem;
  align-items: center;
  transition: all 0.2s;
}

.fot-edit-row * {
  color: var(--gray-1);
}
.fot-edit-row:hover {
  background-color: var(--gray-3);
}
.fot-edit-row:hover * {
  color: var(--gray-1);
}

.fot-delete-row * {
  color: var(--red-1);
}
.fot-delete-row:hover {
  background-color: var(--red-1);
}
.fot-delete-row:hover * {
  color: white;
}
</style>
