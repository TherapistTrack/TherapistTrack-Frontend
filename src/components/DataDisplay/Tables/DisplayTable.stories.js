import { fn } from '@storybook/test'
import MyTable from './DisplayTable.vue'

const meta = {
  component: MyTable,
  args: {
    onClick: fn(),
    isLoading: Boolean,
    data: Object,
    headers: []
  }
}

export default meta

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    headers: {
      nombre: 'Nombre',
      rol: 'Rol'
    },
    data: {
      1: {
        nombre: 'Daniel Rayo',
        rol: 'Doctor',
        telefonos: ['555 555', '222 222'],
        numColegiado: 32115,
        correos: ['aaa@gmail.com', 'bbb@gmail.com']
      },
      2: {
        nombre: 'Sofia de la Rosa',
        rol: 'Doctor',
        telefonos: ['444 444', '333 333'],
        numColegiado: 53515,
        correos: ['ccc@gmail.com', 'ddd@gmail.com']
      },
      3: {
        nombre: 'Ricardo Morales Sagastume',
        rol: 'Asistente',
        telefonos: ['111 111', '777 777'],
        numColegiado: null,
        correos: ['eee@gmail.com']
      }
    },
    isLoading: false
  }
}
