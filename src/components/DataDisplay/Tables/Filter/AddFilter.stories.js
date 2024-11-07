import AddFilter from './AddFilter.vue'

const meta = {
  component: AddFilter,
  args: {}
}

export default meta

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const AddSort = {
  args: {
    fields: {
      age: {
        name: 'Edad',
        type: 'number'
      },
      names: {
        name: 'Nombres',
        type: 'string'
      },
      lastNames: {
        name: 'Apellidos',
        type: 'string'
      },
      mails: {
        name: 'Correos',
        type: 'string'
      },
      birthdate: {
        name: 'Fecha de Nacimiento',
        type: 'date'
      }
    },
    type: 'sort'
  }
}

export const AddFilt = {
  args: {
    fields: {
      age: {
        name: 'Edad',
        type: 'number'
      },
      names: {
        name: 'Nombres',
        type: 'string'
      },
      lastNames: {
        name: 'Apellidos',
        type: 'string'
      },
      mails: {
        name: 'Correos',
        type: 'string'
      },
      birthdate: {
        name: 'Fecha de Nacimiento',
        type: 'date'
      }
    },
    type: 'filter'
  }
}
