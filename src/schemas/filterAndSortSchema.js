import * as yup from 'yup'

export const sortSchema = yup.object({
  name: yup.string().required('Campo a ordenar no puede ser vacío'),
  mode: yup
    .string()
    .oneOf(['Ascendiente', 'Descendiente'], 'Modo debe ser Ascendiente o Descendiente')
    .required('Modo de ordenamiento no puede ser vacío')
})

export const betweenSchema = yup.object({
  dateBefore: yup
    .date()
    .required('Fecha de inicio es obligatoria')
    .typeError('Ingrese una fecha válida'),
  dateAfter: yup
    .date()
    .required('Fecha final es obligatoria')
    .typeError('Ingrese una fecha válida')
    .min(yup.ref('dateBefore'), 'Fecha final debe ser después de la fecha inicial')
})
export const filterSchema = (type, options, operation) => {
  let valueSchema = null
  if (['SHORT_TEXT', 'TEXT'].includes(type)) {
    valueSchema = yup.string().required('Valor es obligatorio')
  } else if (type === 'DATE') {
    valueSchema = yup.date().required('Fecha es obligatoria').typeError('Ingrese una fecha válida')
  } else if (['NUMBER', 'FLOAT'].includes(type)) {
    valueSchema = yup
      .number('Valor debe ser un número')
      .typeError('Valor debe ser un número')
      .required('Valor es obligatorio')
  } else if (type === 'CHOICE') {
    if (operation == 'No es vacío') {
      valueSchema = yup.string()
    } else {
      valueSchema = yup
        .string()
        .oneOf(options, 'Valor debe ser una de las opciones')
        .required('Valor es obligatorio')
    }
  }
  let filterSchema = yup.object({
    name: yup.string().required('Campo a ordenar no puede ser vacío'),
    operation: yup.string().required('Operación es obligatoria'),
    value: valueSchema
  })
  return filterSchema
}
