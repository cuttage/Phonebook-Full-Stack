export const initialFormValues: FormValues = {
  firstName: '',
  lastName: '',
  number: '',
} as FormValues

export const fieldNames: (keyof FormValues)[] = [
  'firstName',
  'lastName',
  'number',
]
