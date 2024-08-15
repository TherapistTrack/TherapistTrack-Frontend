<template>
  <router-view
    :id="selected"
    v-model:shownHeaders="headers"
    :allHeaders="allHeaders"
    :data="fetchedData"
  />
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
      <div class="table-illusion">
        <DisplayTable
          :data="fetchedData"
          :headers="headers"
          :loading="loading"
          :onClick="handleOpenPreview"
        />
        <DisplayTable
          :data="fetchedData"
          :headers="fakeHeaders"
          :loading="loading"
          :onClick="handleTableSettings"
        />
      </div>
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
const fetchedData = ref({})
const loading = ref(false)
const selected = ref(0)

const headers = ref({
  id: 'ID',
  nombre: 'Nombre',
  apellido: 'Apellidos',
  escolaridad: 'Escolaridad'
})

const allHeaders = ref({
  id: 'ID',
  nombre: 'Nombre',
  apellido: 'Apellidos',
  escolaridad: 'Escolaridad',
  ultimaAct: 'Ultima Actualización',
  estadoCivil: 'Estado Civil',
  nombrePareja: 'Nombre de Pareja',
  nacimiento: 'Fecha de Nacimiento'
})

const fakeHeaders = ref({
  moreSettings: '...'
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
    },
    4: {
      id: 'EXP-004',
      nombre: 'Maria',
      apellido: 'González',
      escolaridad: 'Secundaria',
      ultimaAct: '10/06/2022',
      estadoCivil: 'Casada',
      nombrePareja: 'Luis Martínez',
      nacimiento: '12/07/2000'
    },
    5: {
      id: 'EXP-005',
      nombre: 'Carlos',
      apellido: 'Soto',
      escolaridad: 'Doctorado',
      ultimaAct: '01/02/2021',
      estadoCivil: 'Soltero',
      nombrePareja: '',
      nacimiento: '22/08/1998'
    },
    6: {
      id: 'EXP-006',
      nombre: 'Ana',
      apellido: 'Ramírez',
      escolaridad: 'Maestría',
      ultimaAct: '18/03/2023',
      estadoCivil: 'Casada',
      nombrePareja: 'Javier Fernández',
      nacimiento: '15/04/2001'
    },
    7: {
      id: 'EXP-007',
      nombre: 'Miguel',
      apellido: 'Torres',
      escolaridad: 'Univseridad',
      ultimaAct: '27/09/2020',
      estadoCivil: 'Soltero',
      nombrePareja: '',
      nacimiento: '30/11/2002'
    },
    8: {
      id: 'EXP-008',
      nombre: 'Laura',
      apellido: 'Mendoza',
      escolaridad: 'Bachillerato',
      ultimaAct: '05/05/2022',
      estadoCivil: 'Casada',
      nombrePareja: 'Carlos Hernández',
      nacimiento: '01/01/2004'
    },
    9: {
      id: 'EXP-009',
      nombre: 'Roberto',
      apellido: 'Pérez',
      escolaridad: 'Primaria',
      ultimaAct: '12/12/2021',
      estadoCivil: 'Soltero',
      nombrePareja: '',
      nacimiento: '14/06/2007'
    },
    10: {
      id: 'EXP-010',
      nombre: 'Elena',
      apellido: 'Rodríguez',
      escolaridad: 'Univseridad',
      ultimaAct: '22/08/2023',
      estadoCivil: 'Casada',
      nombrePareja: 'Pedro Morales',
      nacimiento: '02/02/2000'
    }
  }

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

const handleTableSettings = () => {
  router.push('/records/table-settings')
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
  width: 100vw;
}

.records .actions {
  display: flex;
  gap: 1rem;
  padding-bottom: 0.5rem;
}

.records .table-illusion {
  display: grid;
  grid-template-columns: 10fr 1fr;
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
