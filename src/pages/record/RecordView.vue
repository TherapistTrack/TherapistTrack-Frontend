<template>
  <router-view :id="selected" />
  <div class="tabs">
    <RecordSideBar :minim="minim" @updateValue="updateMinim" />
  </div>
  <div class="records">
    <div class="sideSpace" :id="minim ? '' : 'max'"></div>
    <div class="page">
      <h1><b>Expedientes</b></h1>
      <div class="actions">
        <IconButton :msg="'Ordenar'" :firstIcon="RiArrowUpDownLine" :secondIcon="RiAddLine" />

        <IconButton :msg="'Nuevo Filtro'" :firstIcon="RiFilterFill" :secondIcon="RiAddLine" />
        <ButtonSimple :msg="'Nuevo'" />
      </div>
      <div class="established"></div>
      <DisplayTable
        :data="fetchedData"
        :headers="headers"
        :loading="loading"
        :onClick="handleOpenPreview"
      />
    </div>
  </div>
</template>

<script setup>
import RecordSideBar from '@/components/Navigation/SideBar/RecordSideBar.vue'
import DisplayTable from '@/components/DataDisplay/Tables/DisplayTable.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import IconButton from '@/components/Buttons/IconButton.vue'
import { RiArrowUpDownLine, RiAddLine, RiFilterFill } from '@remixicon/vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// Constants
const minim = ref(false)
const router = useRouter()
const fetchedData = ref(null)
const loading = ref(false)
const selected = ref(0)

const headers = ref({
  id: 'ID',
  nombre: 'Nombre',
  apellido: 'Apellidos',
  escolaridad: 'Escolaridad'
})

// On Mounted

onMounted(async () => {
  loading.value = true
  // simulation time
  await new Promise((resolve) => setTimeout(resolve, 500))

  // fetchData for when the backend gets deployed
  // fetchedData.value = await fetchData();
  fetchedData.value = {
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
  //   fetchedData.value = {
  //     1: {
  //       nombre: 'Daniel Rayo',
  //       rol: 'Doctor',
  //       telefonos: ['555 555', '222 222'],
  //       numColegiado: 32115,
  //       correos: ['aaa@gmail.com', 'bbb@gmail.com']
  //     },
  //     2: {
  //       nombre: 'Sofia de la Rosa',
  //       rol: 'Doctor',
  //       telefonos: ['444 444', '333 333'],
  //       numColegiado: 53515,
  //       correos: ['ccc@gmail.com', 'ddd@gmail.com']
  //     },
  //     3: {
  //       nombre: 'Ricardo Morales Sagastume',
  //       rol: 'Asistente',
  //       telefonos: ['111 111', '777 777'],
  //       numColegiado: null,
  //       correos: ['eee@gmail.com']
  //     }
  //   }

  loading.value = false
  return fetchedData
})

// Fucntions
const updateMinim = () => {
  minim.value = !minim.value
}

const handleOpenPreview = (key) => {
  selected.value = key
  router.push(`/records/view${key}`)
}
</script>

<style>
.tabs {
  background-color: var(--gray-3);
  border-bottom: 1px solid var(--gray-4);
  display: flex;
}
#app {
  display: flex;
  flex-direction: column;
  background-color: white;
  font-family: 'MotivaSansMedium';
}
.records {
  display: flex;
}

.page {
  padding: 5vw;
  padding-top: 8vh;
  width: 80vw;
}

.records .actions {
  display: flex;
  gap: 1rem;
  padding-bottom: 0.5rem;
}
/* SideBar Space */
.sideSpace {
  width: 0vw;
  transition: Width 0.5s;
}

.sideSpace#max {
  width: 200px;
}

/* Media tags */
@media (max-aspect-ratio: 1/1) {
  .sideSpace#max {
    width: 0vw;
  }
}
</style>
