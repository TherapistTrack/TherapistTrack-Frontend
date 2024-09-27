<template>
  <div class="upload-files-container">
    <div class="upload-card">
      <div class="header-container">
        <!-- Título o contenido adicional si es necesario -->
      </div>
      <div class="content-container">
        <div class="animation-container">
          <div class="airplane-container">
            <DotLottieVue
              :src="animationPathPlane"
              :autoplay="true"
              :loop="true"
              @lottie="handleAnimation"
            />
          </div>
          <div class="line-container">
            <DotLottieVue :src="animationPathLine" :autoplay="true" :loop="false" />
          </div>
          <div class="upload-text">
            <p>Subiendo Archivos...</p>
            <p>No cierres la App</p>
          </div>
        </div>
      </div>

      <!-- Botón de acción -->
      <div class="actions">
        <ButtonSimple
          msg="Finalizar"
          color="blue"
          @click="goToFinish"
          :disabled="isButtonDisabled"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

const router = useRouter()
const animationInstance = ref(null)

// Rutas a los archivos JSON
const animationPathPlane = new URL('@/assets/animations/paper-airplane.json', import.meta.url).href
const animationPathLine = new URL('@/assets/animations/loading-line.json', import.meta.url).href

// Propiedad reactiva para controlar el estado del botón
const isButtonDisabled = ref(true)

function goToFinish() {
  router.push('/upload/finish')
}

function handleAnimation(anim) {
  animationInstance.value = anim
}

// Habilitar el botón después de la duración de la animación
onMounted(() => {
  const totalFrames = 360
  const frameRate = 30
  const durationInSeconds = totalFrames / frameRate
  const durationInMilliseconds = durationInSeconds * 1000

  setTimeout(() => {
    isButtonDisabled.value = false
    console.log('El botón se ha habilitado después de la duración de la animación.')
  }, durationInMilliseconds)
})
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

.airplane-container {
  width: 100%;
  max-width: 500px;
  margin: 0;
  padding: 0;
}

.line-container {
  width: 100%;
  max-width: 150px;
  margin: -40px 0 0 0;
  padding: 0;
}

.airplane-container .dotlottie-player,
.line-container .dotlottie-player {
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
