<template>
  <div class="overlayContainer" @click="goBack()" :id="start ? 'init' : 'end'">
    <div class="view-record" @click.stop="" :id="start ? 'init' : 'end'">
      <div class="top">
        <h1>
          <b>{{ data[props.id].nombre }}<br />{{ data[props.id].apellido }}</b>
        </h1>
        <RiCloseLine
          class-name="icon"
          size="2rem"
          color="var(--gray-2)"
          alt="close"
          @click="goBack()"
        />
      </div>

      <div class="mid">
        <SimpleTable :data="data[props.id]" :headers="headers" />
      </div>

      <div class="bottom">
        <ButtonSimple :msg="'Abrir'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { RiCloseLine } from '@remixicon/vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SimpleTable from '@/components/DataDisplay/Tables/SimpleTable.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'

const start = ref(false)
const router = useRouter()
const data = ref(null)
const props = defineProps({
  id: String
})

onMounted(() => {
  setTimeout(() => {
    start.value = true
  }, 2) // You can adjust the delay if needed
})

const headers = ref({
  nombre: 'Nombre',
  apellido: 'Apellidos',
  ultimaAct: 'Ultima Actualización',
  nacimiento: 'Nacimiento',
  estadoCivil: 'Estado Civil',
  nombrePareja: 'Nombre de Pareja'
})

data.value = {
  1: {
    id: 'EXP-001',
    nombre: 'Esteban',
    apellido: 'Zambrano',
    escolaridad: 'Univseridad',
    ultimaAct: '03/04/2020',
    estadoCivil: 'Casado',
    nombrePareja: 'Juan Fernando Menéndez',
    nacimiento: '03/03/2003'
  },
  2: {
    id: 'EXP-002',
    nombre: 'Daniel',
    apellido: 'Rayo',
    escolaridad: 'Univseridad',
    ultimaAct: '03/04/2023',
    estadoCivil: 'Soltero',
    nombrePareja: '',
    nacimiento: '05/05/2003'
  },
  3: {
    id: 'EXP-003',
    nombre: 'Juanito',
    apellido: 'Del Valle',
    escolaridad: 'Básicos',
    ultimaAct: '03/04/2023',
    estadoCivil: 'Soltero',
    nombrePareja: '',
    nacimiento: '03/03/2008'
  }
}

const goBack = () => {
  start.value = false
  setTimeout(() => {
    router.back()
  }, 250) // You can adjust the delay if needed
}
</script>

<style>
.overlayContainer {
  height: 100%;
  width: 100%;
  z-index: 300;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: end;
  align-items: center;
  transition: background-color 0.3s;
}

.overlayContainer#init {
  background-color: rgba(0, 0, 0, 0.4);
}
.overlayContainer#end {
  background-color: none;
}
.view-record {
  position: absolute;
  right: -400px;
  z-index: 400;
  background-color: white;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 2vh 0 0 2vh;
  width: 400px;
  height: 100vh;
  padding: 2rem;
  transition: right 0.3s;
}
.view-record#init {
  right: 0;
}
.view-record#end {
  right: -400px;
}
.view-record .top {
  display: flex;
  justify-content: space-between;
  padding-bottom: 2rem;
}

.view-record .mid {
  padding: 1rem;
}

.view-record .bottom {
  border-top: 1px solid var(--gray-3);
  padding-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: end;
}
</style>
