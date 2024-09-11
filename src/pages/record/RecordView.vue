<template>
  <router-view
    :id="selected"
    v-model:shownHeaders="headers"
    :allHeaders="allHeaders"
    :data="fetchedData"
  />
  <div class="page">
    <h1><b>Expedientes</b></h1>
    <div class="actions">
      <IconButton :msg="'Ordenar'" :firstIcon="RiArrowUpDownLine" :secondIcon="RiAddLine" />

      <IconButton :msg="'Nuevo Filtro'" :firstIcon="RiFilterFill" :secondIcon="RiAddLine" />
      <ButtonSimple :msg="'Nuevo'" :on-click="handleNewRecord" />
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
</template>

<script setup>
import DisplayTable from '@/components/DataDisplay/Tables/DisplayTable.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
import IconButton from '@/components/Buttons/IconButton.vue'
import { RiArrowUpDownLine, RiAddLine, RiFilterFill } from '@remixicon/vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// Constants
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
      ultimaAct: '2020-04-03',
      estadoCivil: 'Casado',
      nombrePareja: 'Juan Fernando Menéndez',
      nacimiento: '2003-03-03'
    },
    2: {
      id: 'EXP-002',
      nombre: 'Daniel',
      apellido: 'Rayo',
      escolaridad: 'Univseridad',
      ultimaAct: '2023-03-04',
      estadoCivil: 'Soltero',
      nombrePareja: '',
      nacimiento: '2003-05-05'
    },
    3: {
      id: 'EXP-003',
      nombre: 'Juanito',
      apellido: 'Del Valle',
      escolaridad: 'Básicos',
      ultimaAct: '2023-03-04',
      estadoCivil: 'Soltero',
      nombrePareja: '',
      nacimiento: '2008-03-03'
    },
    4: {
      id: 'EXP-004',
      nombre: 'Maria',
      apellido: 'González',
      escolaridad: 'Secundaria',
      ultimaAct: '2022-10-06',
      estadoCivil: 'Casada',
      nombrePareja: 'Luis Martínez',
      nacimiento: '2000-12-07'
    },
    5: {
      id: 'EXP-005',
      nombre: 'Carlos',
      apellido: 'Soto',
      escolaridad: 'Doctorado',
      ultimaAct: '2021-02-01',
      estadoCivil: 'Soltero',
      nombrePareja: '',
      nacimiento: '1998-08-22'
    },
    6: {
      id: 'EXP-006',
      nombre: 'Ana',
      apellido: 'Ramírez',
      escolaridad: 'Maestría',
      ultimaAct: '2023-03-18',
      estadoCivil: 'Casada',
      nombrePareja: 'Javier Fernández',
      nacimiento: '2001-04-15'
    },
    7: {
      id: 'EXP-007',
      nombre: 'Miguel',
      apellido: 'Torres',
      escolaridad: 'Univseridad',
      ultimaAct: '2020-09-17',
      estadoCivil: 'Soltero',
      nombrePareja: '',
      nacimiento: '2002-11-30'
    },
    8: {
      id: 'EXP-008',
      nombre: 'Laura',
      apellido: 'Mendoza',
      escolaridad: 'Bachillerato',
      ultimaAct: '2022-05-05',
      estadoCivil: 'Casada',
      nombrePareja: 'Carlos Hernández',
      nacimiento: '2004-01-01'
    },
    9: {
      id: 'EXP-009',
      nombre: 'Roberto',
      apellido: 'Pérez',
      escolaridad: 'Primaria',
      ultimaAct: '2021-12-12',
      estadoCivil: 'Soltero',
      nombrePareja: '',
      nacimiento: '2007-06-14'
    },
    10: {
      id: 'EXP-010',
      nombre: 'Elena',
      apellido: 'Rodríguez',
      escolaridad: 'Univseridad',
      ultimaAct: '2023-08-22',
      estadoCivil: 'Casada',
      nombrePareja: 'Pedro Morales',
      nacimiento: '2000-02-02'
    }
  }

  loading.value = false
  return fetchedData
})

// Fucntions

const handleOpenPreview = (key) => {
  selected.value = key
  router.push(`/record/main/view/${key}`)
}

const handleTableSettings = () => {
  router.push('/record/main/table-settings')
}

const handleNewRecord = () => {
  router.push('/record/create')
}
</script>

<style scoped>
.records {
  display: flex;
}

.page {
  padding: 2rem 3rem 0 3rem;
  width: 100vw;
}

.page .actions {
  display: flex;
  gap: 1rem;
  padding-bottom: 0.5rem;
}

.page .table-illusion {
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
