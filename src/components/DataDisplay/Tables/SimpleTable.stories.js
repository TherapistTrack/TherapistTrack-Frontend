import SimpleTable from './SimpleTable.vue'

const meta = {
  component: SimpleTable,
  args: {
    data: Object,
    headers: Object
  }
}

export default meta

export const Primary = {
  args: {
    data: {
      nombre: 'Daniel Rayo',
      rol: 'Doctor',
      telefonos: ['555 555', '222 222'],
      numColegiado: 32115,
      correos: ['aaa@gmail.com', 'bbb@gmail.com']
    },
    headers: {
      rol: 'Rol',
      telefonos: 'Teléfonos',
      numColegiado: 'No. Colegiado',
      correos: 'Correo'
    }
  }
}
