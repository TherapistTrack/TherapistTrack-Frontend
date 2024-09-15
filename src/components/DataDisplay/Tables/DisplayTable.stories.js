import { fn } from '@storybook/test'
import MyTable from './DisplayTable.vue'

const meta = {
  component: MyTable,
  args: {
    onClick: fn(),
    loading: Boolean,
    data: Object,
    success: Boolean,
    headers: []
  }
}

export default meta

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    headers: ['Nombre', 'Apellidos', 'Fecha de Nacimiento'],
    data: {
      1: {
        Nombre: 'Daniel Alfredo',
        Apellidos: 'Rayo',
        'Fecha de Nacimiento': '1990-02-03'
      },
      2: {
        Nombre: 'Sofía ',
        Apellidos: 'de la Rosa',
        'Fecha de Nacimiento': '2000-01-11'
      },
      3: {
        Nombre: 'Ricardo ',
        Apellidos: 'Morales Sagastume',
        'Fecha de Nacimiento': '2003-02-31'
      }
    },
    loading: false,
    success: true
  }
}

export const Loading = {
  args: {
    headers: ['Nombre', 'Apellidos', 'Fecha de Nacimiento'],
    data: {
      1: {
        Nombre: 'Daniel Alfredo',
        Apellidos: 'Rayo',
        'Fecha de Nacimiento': '1990-02-03'
      },
      2: {
        Nombre: 'Sofía ',
        Apellidos: 'de la Rosa',
        'Fecha de Nacimiento': '2000-01-11'
      },
      3: {
        Nombre: 'Ricardo ',
        Apellidos: 'Morales Sagastume',
        'Fecha de Nacimiento': '2003-02-31'
      }
    },
    loading: true,
    success: true
  }
}

export const Error = {
  args: {
    headers: ['Nombre', 'Apellidos', 'Fecha de Nacimiento'],
    data: {
      1: {
        Nombre: 'Daniel Alfredo',
        Apellidos: 'Rayo',
        'Fecha de Nacimiento': '1990-02-03'
      },
      2: {
        Nombre: 'Sofía ',
        Apellidos: 'de la Rosa',
        'Fecha de Nacimiento': '2000-01-11'
      },
      3: {
        Nombre: 'Ricardo ',
        Apellidos: 'Morales Sagastume',
        'Fecha de Nacimiento': '2003-02-31'
      }
    },
    loading: false,
    success: false
  }
}
