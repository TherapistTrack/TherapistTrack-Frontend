<template>
  <div :class="closeAnim ? 'close' : 'isActive'">
    <div class="toast" :id="type === 0 ? 'error' : type === 1 ? 'success' : 'warning'">
      <div class="toast-body">
        <RiCloseCircleFill v-if="type == 0" class="icon" color="var(--red-1)" size="1.5rem" />
        <RiCheckboxCircleFill
          v-else-if="type == 1"
          lass="icon"
          color="var(--green-2)"
          size="1.5rem"
        />
        <RiAlertFill v-else class="icon" color="var(--yellow-3)" size="1.5rem" />

        <div class="text">
          <span v-if="type == 0">
            <p><b>Error</b></p>
          </span>
          <span v-else-if="type == 1">
            <p><b>Success</b></p>
          </span>
          <span v-else>
            <p><b>Warning</b></p>
          </span>
          <p>{{ content }}</p>
        </div>
      </div>

      <span class="close-container">
        <RiCloseLine size="1rem" class="close-icon" @click="doClose" />
      </span>
    </div>
  </div>
</template>

<script setup>
import { RiAlertFill, RiCloseLine, RiCheckboxCircleFill, RiCloseCircleFill } from '@remixicon/vue'
import { ref, onMounted } from 'vue'

const props = defineProps({
  content: String,
  type: Number,
  // 0 for error, 1 for success 3 or any for warning
  onClose: Function
})

onMounted(() => {
  setTimeout(() => {
    doClose()
  }, 10000)
})

const closeAnim = ref(false)
const doClose = () => {
  closeAnim.value = true
  setTimeout(() => {
    props.onClose()
  }, 10000)
}
</script>

<style scoped>
.toast {
  display: flex;
  padding: 0.5rem;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
  width: 500px;
  height: 60px;
  border-radius: 0.5rem;
  background-color: var(--white);
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
  border-left: 0.5rem solid var(--yellow-3);
}

.toast-body {
  display: flex;
  gap: 0.5rem;
}

.toast-body p {
  font-size: 0.8rem;
}
.toast#error {
  border-left: 0.5rem solid var(--red-1);
}

.toast#success {
  border-left: 0.5rem solid var(--green-2);
}

.icon {
  flex-shrink: 0;
}

.close-container {
  justify-self: flex-end;
}
.close-icon {
  transition: fill 0.2s;
  flex-shrink: 0;
}

.close-icon:hover {
  fill: var(--gray-1);
}

.close {
  animation: moveLeft 1s forwards;
}

@keyframes moveLeft {
  0% {
    transform: translateX(0);
    height: 60px;
  }
  50% {
    transform: translateX(-600px);
    height: 60px;
  }
  100% {
    transform: translateX(-800px);
    height: 0px;
  }
}
</style>
