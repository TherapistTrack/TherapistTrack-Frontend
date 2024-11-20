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
          <div class="line-container" v-if="showLoader">
            <div class="loader-wrapper">
              <InfiniteLoading />
            </div>
          </div>
          <div class="upload-text">
            <p>{{ uploadStatusText }}</p>
            <p>No cierres la App</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useUploadStore } from '@/stores/uploadStore'
import { useRoute } from 'vue-router'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import InfiniteLoading from '@/components/Feedback/InfiniteLoading/InfiniteLoading.vue'
import { useApi } from '@/oauth/useApi'
import removeAccents from 'remove-accents'

const { uploadRequest } = useApi()

const emit = defineEmits(['goToFinish'])

const animationInstance = ref(null)
const route = useRoute()

// Rutas a los archivos JSON
const animationPathPlane = new URL('@/assets/animations/paper-airplane.json', import.meta.url).href

// Propiedad reactiva para controlar el estado del botón
const isButtonDisabled = ref(true)
const uploadStatusText = ref('Subiendo Archivos...')
const showLoader = ref(true)

const uploadStore = useUploadStore()
const currentFile = ref(uploadStore.files[0]) // Suponemos que se sube un archivo a la vez

function goToFinish() {
  console.log('Archivos subidos:', currentFile.value) // Imprimir la información del archivo en la consola
  emit('goToFinish')
}

function handleAnimation(anim) {
  animationInstance.value = anim
}

const uploadFile = async (file) => {
  let metadata = formatMetadata(file.data)
  let file_data = formatFileName(file.file)
  try {
    const response = await uploadRequest('/files/', file_data, metadata)
    console.log(response)
  } catch {
    console.log('Hubo un error subiendo los datos')
  }
}

const formatFileName = (file) => {
  let cleanName = removeAccents(file.name)
  return new File([file], cleanName, {
    type: file.type,
    lastModified: file.lastModified
  })
}

const formatMetadata = (raw_data) => {
  let metadata = {
    doctorId: uploadStore.doctorId,
    recordId: uploadStore.recordId,
    templateId: raw_data.templateId,
    name: raw_data.name,
    category: 'Testing',
    fields: []
  }
  Object.keys(raw_data).forEach((item) => {
    if (item != 'name' && item != 'templateId') {
      let field = {
        name: item,
        value: raw_data[item]
      }

      if (!isNaN(Number(raw_data[item]))) {
        field.value = Number(raw_data[item])
      }

      metadata.fields.push(field)
    }
  })
  return metadata
}

// Habilitar el botón después de 3 segundos y luego redirigir automáticamente después de otros 2 segundos
onMounted(async () => {
  uploadStore.files.forEach(async (file) => {
    await uploadFile(file)
  })

  isButtonDisabled.value = false
  uploadStatusText.value = 'Archivos Subidos' // Actualizar el texto
  showLoader.value = true

  setTimeout(() => {
    console.log('Redirigiendo a la página de finalización después de 2 segundos.')
    goToFinish() // Navegar a la página final
  }, 1000)

  history.pushState(null, null, document.URL)

  const handlePopState = () => {
    if (route.name !== 'uploadFiles') {
      // Bloquear el retroceso si no es la página UploadFiles
      console.log('Intento de retroceder detectado, redirigiendo a la página actual.')
      history.pushState(null, null, document.URL)
    }
  }
  // Añadir el listener para el evento 'popstate'
  window.addEventListener('popstate', handlePopState)

  // Limpiar el listener cuando el componente sea desmontado
  onBeforeUnmount(() => {
    window.removeEventListener('popstate', handlePopState)
  })
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 0;
  margin-bottom: 20px;
}

.loader-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
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
