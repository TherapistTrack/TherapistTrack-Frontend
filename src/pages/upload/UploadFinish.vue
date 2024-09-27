<template>
  <div class="upload-files-container">
    <div class="upload-card">
      <div class="header-container">
        <!-- Título o contenido adicional si es necesario -->
      </div>
      <div class="content-container">
        <div class="animation-container" @click="triggerFileInput">
          <div class="check-container">
            <DotLottieVue
              :src="animationPathCheck"
              :autoplay="true"
              :loop="true"
              @lottie="handleAnimation"
              @complete="handleAnimationComplete"
            />
          </div>
          <div class="upload-text">
            <p>Archivos Subidos Exitosamente!</p>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="actions">
        <ButtonSimple msg="Finalizar" color="blue" @click="handleFinish" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

const animationInstance = ref(null)

// Ruta al archivo JSON en la carpeta 'public'
const animationPathCheck = new URL('@/assets/animations/check.json', import.meta.url).href

function handleFinish() {
  console.log('Archivos subidos!')
}

function handleAnimation(anim) {
  animationInstance.value = anim
}

function triggerFileInput() {
  if (animationInstance.value) {
    animationInstance.value.stop()
    animationInstance.value.play()
  }
}

function handleAnimationComplete() {
  animationInstance.value?.stop()
}
</script>

<style scoped>
.upload-files-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--gray-3);
}

.upload-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  width: 45vw;
  height: 85vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 550px;
}

.content-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.animation-container {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 0;
}

.check-container {
  width: 100%;
  max-width: 500px;
  margin: 0;
  padding: 0;
}

.check-container .dotlottie-player {
  width: 100%;
  height: auto;
  margin: 0;
  padding: 0;
}

.upload-text {
  text-align: center;
  margin-top: 0;
}

.upload-text p {
  margin: 2px 0;
  font-size: 1rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 20px;
  gap: 10px;
}
</style>
