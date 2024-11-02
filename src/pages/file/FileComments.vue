<template>
  <div class="file-overlay-container" :id="anim ? 'init' : ''">
    <div class="file-comments" ref="myDiv">
      <div class="top">
        <h2>Notas</h2>
        <RiCloseLine
          class-name="close"
          size="2rem"
          color="var(--gray-2)"
          alt="close"
          @click="goBack()"
        />
      </div>
      <div class="mid">
        <div class="comment" v-for="(comment, key) in fileComments" :key="key">
          <p>{{ comment.date }}</p>
          <p>{{ comment.content }}</p>
        </div>
      </div>
      <div class="bottom">
        <InputFieldSimple
          v-model:model-value="ccomment"
          :id="'comment-input'"
          :placeholder="'Escribe un comentario...'"
        />
        <RiSendPlaneFill
          color="var(--blue-1)"
          class="send"
          size="1.4rem"
          @click="onUploadComment"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { RiCloseLine, RiSendPlaneFill } from '@remixicon/vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import InputFieldSimple from '@/components/Forms/InputField/InputFieldSimple.vue'
// Emits
const emit = defineEmits(['hideInfo', 'showEdit', 'disableSpace', 'downloadFile'])

// Variables
const myDiv = ref(null)
const anim = ref(false)
const fileComments = ref([])
const ccomment = ref('')

//  FUNCTIONS
// On Mounted
onMounted(() => {
  setTimeout(() => {
    anim.value = true
    document.addEventListener('click', handleClickOutside)
  }, 2)
  setTimeout(() => {
    fileComments.value = [
      {
        date: '3-15-2023',
        content: 'En página 4 no se de lo que habla el documento'
      },
      {
        date: '3-15-2024',
        content: 'En página 16 se describe el teorema Modus Ponens'
      },
      {
        date: '3-15-2022',
        content: 'En página 3 se describe el teorema 2'
      },
      {
        date: '4-10-2022',
        content: 'En página 4 se demuestra el lema 5'
      },
      {
        date: '5-05-2022',
        content: 'En página 5 se revisa la hipótesis inicial'
      },
      {
        date: '6-22-2022',
        content: 'En página 6 se explica la definición clave'
      },
      {
        date: '7-18-2022',
        content: 'En página 7 se introduce el concepto adicional'
      }
    ]
  }, 250)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside) // Step 4: Remove event listener on unmount
})

// Navigation
const goBack = () => {
  anim.value = false
  emit('disableSpace')
  setTimeout(() => {
    emit('hideInfo')
  }, 250)
}
const handleClickOutside = (event) => {
  // Closing event
  if (myDiv.value && !myDiv.value.contains(event.target)) {
    goBack()
  }
}

const onUploadComment = () => {
  const today = new Date()
  if (ccomment.value != '' && ccomment.value != undefined) {
    let fcomment = {
      date: today.toLocaleDateString().replaceAll('/', '-'),
      content: ccomment.value
    }
    console.log('API CALL, SEND COMMENT')
    console.log(fcomment)
  }
}
</script>

<style scoped>
.file-overlay-container {
  position: absolute;
  height: 100%;
  display: flex;
  right: -320px;
  top: 0;
  align-items: center;
  transition: right 0.2s;
}

.file-overlay-container#init {
  right: 0;
}
.file-comments {
  height: 95%;
  width: 300px;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem 0 0 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  overflow-y: scroll;
  z-index: 1000;
}

.file-comments .top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.close {
  cursor: pointer;
}

.mid {
  height: 460px;
  padding-bottom: 1rem;
  overflow-y: scroll;
}

.file-comments .mid {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment {
  display: flex;
  flex-direction: column;
}
.comment p {
  font-size: smaller;
}
.comment p:first-child {
  color: var(--gray-1);
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.send {
  cursor: pointer;
}
</style>
