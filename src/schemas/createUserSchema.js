import * as yup from 'yup'

export const createUserSchema = yup.object().shape({
  id: yup
    .string()
    .required('ID is required')
    .matches(/^[a-fA-F0-9]{24}$/, 'ID must be a 24-character hex string'),
  names: yup.string().required('Names are required').trim().min(1, 'Names cannot be empty'),

  lastNames: yup
    .string()
    .required('Last names are required')
    .trim()
    .min(1, 'Last names cannot be empty'),
  phones: yup
    .array()
    .of(yup.string().matches(/^[0-9]+$/, 'Phone numbers must contain only numbers'))
    .required('At least one phone number is required')
    .min(1, 'At least one phone number is required'),
  rol: yup
    .string()
    .oneOf(['Assistant', 'Doctor'], 'Role must be either "Assistant" or "Doctor"')
    .required('Role is required'),
  mails: yup
    .array()
    .of(
      yup
        .string()
        .matches(
          /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
          'Each email must be a valid email address'
        )
        .required('There cannot be empty emails')
    )
    .required('At least one email is required')
    .min(1, 'At least one email is required'),

  startDate: yup
    .date()
    .nullable()
    .test(
      'is-valid-date',
      'Start date must be a valid date',
      (value) => value === null || value === '' || !isNaN(new Date(value).getTime())
    )
    .when('rol', (rol) =>
      rol == 'Assistant'
        ? yup
            .date()
            .required('Start date is required for Assistants')
            .typeError('Select a start date')
        : yup.string().nullable()
    ),

  endDate: yup
    .date()
    .nullable()
    .test(
      'is-valid-date',
      'End date must be a valid date',
      (value) => value === null || value === '' || !isNaN(new Date(value).getTime())
    )

    .when('rol', (rol) =>
      rol == 'Assistant'
        ? yup
            .date()
            .required('End date is required for Assistants')
            .typeError('Select an end date')
            .min(yup.ref('startDate'), 'End date must be after start date')
        : yup.string().nullable()
    ),

  DPI: yup
    .string()
    .nullable()
    .when('rol', (rol) =>
      rol == 'Assistant'
        ? yup
            .string()
            .matches(/^[0-9]+$/, 'DPI must contain only numbers')
            .required('DPI is required for Assistants')
        : yup.string().nullable()
    ),
  collegiateNumber: yup
    .string()
    .nullable()
    .when('rol', (rol) =>
      rol == 'Doctor'
        ? yup.string().trim().required('Collegiate number is required for Doctors')
        : yup.string().nullable()
    ),
  specialty: yup
    .string()
    .nullable()
    .when('rol', (rol) =>
      rol == 'Doctor'
        ? yup.string().trim().required('Specialty is required for Doctors')
        : yup.string().nullable()
    )
})
