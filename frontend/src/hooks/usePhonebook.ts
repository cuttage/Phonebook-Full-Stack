import { useState } from 'react'
import { Expr, query as q } from 'faunadb'
import client from '../faunaClient/faunadbClientFauna'
import { useQuery, useQueryClient } from 'react-query'
import { useForm } from './useForm'
import useFormattedString from './useFormattedString'
import { initialFormValues } from '../utils/formUtils'
import logger from '../logger'

const collection = process.env.REACT_APP_FAUNA_COLLECTION as string

export const usePhonebook = () => {
  const queryClient = useQueryClient()
  const { formValues, setFormValues, handleInputChange } = useForm()
  const formatText = useFormattedString()
  const [sortKey, setSortKey] = useState<string>('firstName')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [addSection, setAddSection] = useState<boolean>(false)

  const fetchPhonebookEntries = async () => {
    try {
      const query = q.Map(
        q.Paginate(q.Documents(q.Collection(collection))),
        q.Lambda((ref: Expr) => q.Get(ref))
      )

      const response = await client.query<FindPhonebookResponse>(query)

      logger.info('Phonebook Loaded:', response.data.data)

      return response.data.data
    } catch (error) {
      logger.error('Failed to fetch phonebook entries', error)
      throw error
    }
  }

  const {
    data: phonebookEntries,
    isLoading,
    isError,
  } = useQuery('phonebookEntries', fetchPhonebookEntries)

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

    try {
      const response = await client.query(
        q.Create(q.Collection(collection), { data: formValues })
      )

      logger.info('Phonebook Entry Created:', response)

      queryClient.invalidateQueries('phonebookEntries')

      setFormValues(initialFormValues)
    } catch (error) {
      logger.error('Failed to create phonebook entry', error)
    }
  }

  const handleSort = (key: string) => {
    setSortKey(key)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const toggleAddSection = () => {
    setAddSection(!addSection)
  }

  return {
    formValues,
    handleInputChange,
    formatText,
    phonebookEntries,
    isLoading,
    isError,
    handleSubmit,
    sortKey,
    handleSort,
    searchQuery,
    handleSearch,
    addSection,
    toggleAddSection,
  }
}
