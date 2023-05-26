import { useState } from 'react'
import { initialFormValues } from '../utils/formUtils'

export const useForm = () => {
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues)

  const transformToFormData = (data: PhonebookEntryData): FormValues => {
    const { firstName, lastName, number } = data.data
    return {
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      number: number ?? '',
    } as FormValues
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }

  return { formValues, setFormValues, handleInputChange, transformToFormData }
}
