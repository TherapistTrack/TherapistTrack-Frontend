<template>
  <div class="loader">
    <span class="toast-container" v-for="(toast, key) in localList" :key="key">
      <Toast :type="toast.type" :content="toast.content" :onClose="() => onClose(key)" />
    </span>
  </div>
</template>

<script setup>
import Toast from './ToastComponent.vue'
import { ref } from 'vue'
const emit = defineEmits(['update:toastList'])
const localList = ref(null)
const props = defineProps({
  toastList: Array
})

localList.value = props.toastList

const onClose = (key) => {
  localList.value.splice(key, 1)
  emit('update:toastList', localList)
}
</script>

<style>
.loader {
  margin: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
