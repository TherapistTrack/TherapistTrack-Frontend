import * as yup from 'yup'

export const userSchema = yup.object().shape({
  names: yup
    .string()
    .required('Nombre es obligatorio')
    .trim()
    .min(1, 'Nombre no puede estar vacío'),
  lastNames: yup
    .string()
    .required('Apellidos es obligatorio')
    .trim()
    .min(1, 'Apellidos no puede ser vacío'),
  phones: yup
    .array()
    .of(yup.string().matches(/^[0-9]+$/, 'Números de teléfono solo pueden incluir números'))
    .required('Debe haber al menos un numero de teléfono')
    .min(1, 'Debe haber al menos un numero de teléfono'),
  rol: yup
    .string()
    .oneOf(['Assistant', 'Doctor', 'Admin'], 'El rol debe ser Assistant, Doctor o Admin')
    .required('Rol es obligatorio'),
  mails: yup
    .array()
    .of(
      yup
        .string()
        .matches(
          /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
          'Todos los emails deben ser válidos'
        )
        .required('No pueden haber emails vacíos')
    )
    .required('Debe haber al menos un email')
    .min(1, 'Debe haber al menos un email'),

  startDate: yup
    .date()
    .nullable()
    .test(
      'is-valid-date',
      'Fecha de inicio debe ser una fecha válida',
      (value) => value === null || value === '' || !isNaN(new Date(value).getTime())
    )
    .when('rol', (rol) =>
      rol == 'Assistant'
        ? yup
            .date()
            .required('Fecha de inicio es obligatoria para asistentes')
            .typeError('Fecha inválida')
        : yup.string().nullable()
    ),

  endDate: yup
    .date()
    .nullable()
    .test(
      'is-valid-date',
      'Fecha de fin debe ser una fecha válida',
      (value) => value === null || value === '' || !isNaN(new Date(value).getTime())
    )

    .when('rol', (rol) =>
      rol == 'Assistant'
        ? yup
            .date()
            .required('Fecha de fin es obligatoria para asistentes')
            .typeError('Fecha inválida')
            .min(yup.ref('startDate'), 'Fecha de fin debe ser previa a la fecha de inicio')
        : yup.string().nullable()
    ),

  DPI: yup
    .string()
    .nullable()
    .when('rol', (rol) =>
      rol == 'Assistant'
        ? yup
            .string()
            .matches(/^[0-9]+$/, 'DPI debe contener solo números')
            .required('DPI es obligatorio para asistentes')
        : yup.string().nullable()
    ),
  collegiateNumber: yup
    .string()
    .nullable()
    .when('rol', (rol) =>
      rol == 'Doctor'
        ? yup.string().trim().required('Numero de colegiado es obligatorio para doctores')
        : yup.string().nullable()
    ),
  specialty: yup
    .string()
    .nullable()
    .when('rol', (rol) =>
      rol == 'Doctor'
        ? yup.string().trim().required('Especialidad es obligatoria para doctores')
        : yup.string().nullable()
    )
})
