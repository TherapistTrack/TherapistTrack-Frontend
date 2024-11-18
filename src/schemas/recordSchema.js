import * as Yup from 'yup'

export const recordSchema = () => {
  const getTemplateSchema = (fieldInfo) => {
    let schemaShape = {}
    let headers = Object.keys(fieldInfo)

    headers.forEach((field) => {
      if (fieldInfo[field].type == 'TEXT' || fieldInfo[field].type == 'SHORT_TEXT') {
        if (fieldInfo[field].required) {
          schemaShape[field] = Yup.string().required(`${field} es un valor requerido`)
        } else {
          schemaShape[field] = Yup.string().nullable()
        }
      } else if (fieldInfo[field].type == 'DATE') {
        if (fieldInfo[field].required) {
          schemaShape[field] = Yup.date()
            .required(`${field} es un valor requerido`)
            .typeError(`${field} contiene una fecha inválda`)
        } else {
          schemaShape[field] = Yup.string().nullable()
        }
      }
      // else if (fieldInfo[field].type=='CHOICE'){
      //     if(fieldInfo[field].required){
      //         schemaShape[field] = Yup.string()
      //         .oneOf(fieldInfo[field].options,`${field} debe ser una de las opciones`)
      //         .required(`${field} es un valor requerido`)
      //     } else{
      //         schemaShape[field] = Yup.oneOf(fieldInfo[field].options,`${field} debe ser una de las opciones`).nullable()
      //     }
      // }
      else if (fieldInfo[field].type == 'NUMBER') {
        if (fieldInfo[field].required) {
          schemaShape[field] = Yup.number()
            .typeError(`${field} debe ser un numero`)
            .integer(`${field} debe ser un numero entero`) // Ensures the number is an integer
            .required(`${field} es un valor requerido`)
        } else {
          schemaShape[field] = Yup.number()
            .typeError(`${field} debe ser un numero`)
            .integer(`${field} debe ser un numero entero`)
            .nullable()
        }
      } else if (fieldInfo[field].type == 'FLOAT') {
        if (fieldInfo[field].required) {
          schemaShape[field] = Yup.number()
            .typeError(`${field} debe ser un numero`) // Ensures the number is an integer
            .required(`${field} es un valor requerido`)
        } else {
          schemaShape[field] = Yup.number().typeError(`${field} debe ser un numero`).nullable()
        }
      }
    })

    return Yup.object().shape(schemaShape)
  }
  return {
    getTemplateSchema
  }
}
