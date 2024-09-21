import * as yup from 'yup'

export const sortSchema = yup.object({
  name: yup.string().required('Campo a ordenar no puede ser vacío'),
  mode: yup
    .string()
    .oneOf(['Ascendiente', 'Descendiente'], 'Modo debe ser Ascendiente o Descendiente')
    .required('Modo de ordenamiento no puede ser vacío')
})

export const filterSchema = (type, options) => {
  let valueSchema = null
  if (['short_text', 'text'].includes(type)) {
    valueSchema = yup.string().required('Valor es obligatorio')
  } else if (type === 'date') {
    valueSchema = yup.date().required('Fecha es obligatoria').typeError('Ingrese una fecha válida')
  } else if (['number', 'float'].includes(type)) {
    valueSchema = yup
      .number('Valor debe ser un número')
      .typeError('Valor debe ser un número')
      .required('Valor es obligatorio')
  } else if (type === 'choice') {
    valueSchema = yup
      .string()
      .oneOf(options, 'Valor debe ser una de las opciones')
      .required('Valor es obligatorio')
  }
  let filterSchema = yup.object({
    name: yup.string().required('Campo a ordenar no puede ser vacío'),
    operation: yup.string().required('Operación es obligatoria'),
    value: valueSchema
  })
  return filterSchema
}
