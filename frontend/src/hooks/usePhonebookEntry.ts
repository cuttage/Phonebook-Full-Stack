import { useState } from 'react'
import logger from '../logger'
import { query as q } from 'faunadb'
import client from '../faunaClient/faunadbClientFauna'
import { useForm } from '../hooks/useForm'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { initialFormValues } from '../utils/formUtils'

const collection = process.env.REACT_APP_FAUNA_COLLECTION as string

export const usePhonebookEntry = (id: string | undefined) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { formValues, setFormValues, handleInputChange, transformToFormData } =
    useForm()
  const [deleteSection, setDeleteSection] = useState<boolean>(false)
  const [editSection, setEditSection] = useState<boolean>(false)

  const fetchPhonebookEntry = async () => {
    try {
      const query = q.Get(q.Ref(q.Collection(collection), id))
      const response = await client.query<PhonebookEntryData>(query)
      logger.info('Phonebook Entry Loaded:', response.data)
      const formData = transformToFormData(response.data)
      setFormValues(formData)
      return response.data
    } catch (error) {
      logger.error('Failed to fetch phonebook entry', error)
      throw error
    }
  }

  const {
    data: phonebookEntry,
    isLoading,
    isError,
  } = useQuery(['phonebookEntry', id], fetchPhonebookEntry)

  const deletePhonebookEntry = async () => {
    try {
      const query = q.Delete(q.Ref(q.Collection(collection), id))
      await client.query(query)
      logger.info('Phonebook Entry Deleted')
      navigate('/')
    } catch (error) {
      logger.error('Failed to delete phonebook entry', error)
      throw error
    }
  }

  const deleteMutation = useMutation(deletePhonebookEntry, {
    onError: (error) => {
      logger.error('Failed to delete phonebook entry', error)
    },
  })

  const updateMutation = useMutation(
    async (updatedValues: FormValues) => {
      const query = q.Update(q.Ref(q.Collection(collection), id), {
        data: updatedValues,
      })
      const response = await client.query<PhonebookEntryData>(query)
      logger.info('Phonebook Entry Updated:', response)
      return response
    },
    {
      onError: (error) => {
        logger.error('Failed to update phonebook entry', error)
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['phonebookEntry', id])
        toggleEditSection()
        setFormValues(initialFormValues)
      },
    }
  )

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const requiredFields = ['firstName', 'number']
    const missingFields = requiredFields.filter(
      (fieldName) => !formValues[fieldName]
    )

    if (missingFields.length > 0) {
      logger.error('Missing required fields:', missingFields)
      return
    }

    updateMutation.mutate(formValues)
  }

  const toggleDeleteSection = () => {
    setDeleteSection(!deleteSection)
    setEditSection(false)
  }

  const toggleEditSection = () => {
    setEditSection(!editSection)
    setDeleteSection(false)
  }

  return {
    formValues,
    isLoading,
    isError,
    handleSubmit,
    toggleEditSection,
    toggleDeleteSection,
    phonebookEntry,
    deleteMutation,
    handleInputChange,
    deleteSection,
    editSection,
  }
}
