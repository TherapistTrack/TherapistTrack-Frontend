<template>
  <div class="loader">
    <span class="toast-container" v-for="(toast, key) in localList" :key="key">
      <Toast :type="toast.type" :content="toast.content" :onClose="() => onClose(toast.id)" />
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
  localList.value.filter((item) => item.id != key)
  emit('update:toastList', localList)
}
</script>

<style scoped>
.loader {
  position: absolute;
  display: flex;
  flex-direction: column-reverse;
  background-color: blue;
  margin-left: 1rem;
  height: 100vh;
  bottom: 0;
  width: 0;
  flex-shrink: 0;
  justify-content: end;
  align-items: start;
}

.toast-container {
  height: fit-content;
}
</style>
