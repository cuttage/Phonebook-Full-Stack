import { useState } from 'react'
import { query as q } from 'faunadb'
import client from '../faunadbClientFauna'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import useStringAvatar from '../hooks/useStringAvatar'
import { useForm } from '../hooks/useForm'
import useFormattedString from '../hooks/useFormattedString'
import { fieldNames, initialFormValues } from '../formUtils'
import {
  Button,
  Tooltip,
  IconButton,
  Typography,
  Avatar,
  Divider,
  TextField,
} from '@mui/material'
import {
  ArrowBackRounded,
  EditRounded,
  DeleteRounded,
} from '@mui/icons-material'

const collection = process.env.REACT_APP_FAUNA_COLLECTION as string

const PhonebookEntryComponent = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { formValues, setFormValues, handleInputChange, transformToFormData } =
    useForm()
  const formatText = useFormattedString()
  const [deleteSection, setDeleteSection] = useState<boolean>(false)
  const [editSection, setEditSection] = useState<boolean>(false)

  const fetchPhonebookEntry = async () => {
    try {
      const query = q.Get(q.Ref(q.Collection(collection), id))
      const response = await client.query<PhonebookEntryData>(query)
      console.log('Phonebook Entry Loaded:', response.data)
      const formData = transformToFormData(response.data)
      setFormValues(formData)
      return response.data
    } catch (error) {
      console.error('Failed to fetch phonebook entry', error)
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
      console.log('Phonebook Entry Deleted')
      navigate('/')
    } catch (error) {
      console.error('Failed to delete phonebook entry', error)
      throw error
    }
  }

  const deleteMutation = useMutation(deletePhonebookEntry, {
    onError: (error) => {
      console.error('Failed to delete phonebook entry', error)
    },
  })

  const updateMutation = useMutation(
    async (updatedValues: FormValues) => {
      const query = q.Update(q.Ref(q.Collection(collection), id), {
        data: updatedValues,
      })
      const response = await client.query<PhonebookEntryData>(query)
      console.log('Phonebook Entry Updated:', response)
      return response
    },
    {
      onError: (error) => {
        console.error('Failed to update phonebook entry', error)
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
      console.error('Missing required fields:', missingFields)
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

  if (isLoading) {
    return (
      <div>
        <IconButton
          size="large"
          sx={{ color: '#f2f3f4', marginTop: '20px' }}
          component={Link}
          to="/"
        >
          <ArrowBackRounded />
        </IconButton>
        <h1>Phonebook Entry</h1>
        <Typography
          style={{
            color: '#f2f3f4',
            fontFamily: 'Prompt',
            fontWeight: 700,
            fontSize: '18px',
            textRendering: 'geometricPrecision',
          }}
        >
          Loading...
        </Typography>
      </div>
    )
  }
  if (isError) {
    return (
      <div>
        <IconButton
          size="large"
          sx={{ color: '#f2f3f4', marginTop: '20px' }}
          component={Link}
          to="/"
        >
          <ArrowBackRounded />
        </IconButton>
        <h1>Phonebook Entry</h1>
        <Typography
          style={{
            color: '#f2f3f4',
            fontFamily: 'Prompt',
            fontWeight: 700,
            fontSize: '18px',
            textRendering: 'geometricPrecision',
          }}
        >
          Failed to fetch phonebook entry
        </Typography>
      </div>
    )
  }

  const stringAvatar = useStringAvatar(`${phonebookEntry?.data?.firstName}`)

  return (
    <div style={{ paddingBottom: '74.02px' }}>
      <IconButton
        size="large"
        sx={{ color: '#f2f3f4', marginTop: '20px' }}
        component={Link}
        to="/"
      >
        <ArrowBackRounded />
      </IconButton>
      <h1>Phonebook Entry</h1>
      {phonebookEntry !== null && phonebookEntry !== undefined && (
        <div
          className="center-flex column-flex"
          key={phonebookEntry?.ref?.value?.id}
        >
          <Avatar
            {...stringAvatar}
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'magenta',
              color: '#f2f3f4',
            }}
          />
          <Typography
            style={{
              color: '#f2f3f4',
              fontFamily: 'Prompt',
              fontWeight: 700,
              fontSize: '36px',
              textRendering: 'geometricPrecision',
            }}
          >
            {phonebookEntry?.data?.firstName}{' '}
            {phonebookEntry?.data?.lastName && phonebookEntry?.data?.lastName}
          </Typography>
          <Typography
            style={{
              color: '#f2f3f4',
              fontFamily: 'Prompt',
              fontWeight: 700,
              fontSize: '24px',
              textRendering: 'geometricPrecision',
            }}
          >
            {phonebookEntry?.data?.number}
          </Typography>
          <div className="center-flex">
            <Tooltip title="Edit" arrow>
              <IconButton
                color="secondary"
                sx={{
                  bgcolor: 'transparent',
                  color: '#f2f3f4',
                  fontFamily: 'Prompt',
                  fontWeight: 700,
                  margin: '10px',
                  '&:hover': {
                    bgcolor: 'transparent',
                  },
                }}
                onClick={toggleEditSection}
              >
                <EditRounded />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <IconButton
                color="secondary"
                sx={{
                  bgcolor: 'transparent',
                  color: '#f2f3f4',
                  fontFamily: 'Prompt',
                  fontWeight: 700,
                  margin: '10px',
                  '&:hover': {
                    bgcolor: 'transparent',
                  },
                }}
                onClick={toggleDeleteSection}
              >
                <DeleteRounded />
              </IconButton>
            </Tooltip>
          </div>
          <Divider
            sx={{
              borderColor: '#f2f3f4',
              width: '100%',
              marginTop: '20px',
              marginBottom: '20px',
            }}
          />
          {deleteSection && (
            <div className="center-flex row-flex">
              <Typography
                style={{
                  color: '#f2f3f4',
                  fontFamily: 'Prompt',
                  fontWeight: 700,
                  fontSize: '24px',
                  textRendering: 'geometricPrecision',
                }}
              >
                Permanently Delete
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  bgcolor: '#FF0080',
                  color: '#f2f3f4',
                  fontFamily: 'Prompt',
                  fontWeight: 700,
                  margin: '10px',
                  '&:hover': {
                    bgcolor: '#FF0080',
                  },
                }}
                onClick={() => deleteMutation.mutate()}
              >
                Delete
              </Button>
            </div>
          )}
          {editSection && (
            <div className="center-flex row-flex">
              <form onSubmit={handleSubmit} style={{ padding: '10px' }}>
                {fieldNames.map((fieldName) => (
                  <TextField
                    key={fieldName.toString()}
                    required={
                      fieldName === 'firstName' || fieldName === 'number'
                    }
                    label={formatText(fieldName.toString())}
                    name={fieldName.toString()}
                    value={formValues[fieldName]}
                    onChange={handleInputChange}
                    variant="filled"
                    sx={{
                      border: '1px solid #f2f3f4',
                      input: {
                        color: '#f2f3f4',
                        fontFamily: 'Prompt',
                        fontWeight: 700,
                      },
                      label: {
                        color: '#f2f3f4',
                        fontFamily: 'Prompt',
                        fontWeight: 700,
                      },
                      fontFamily: 'Prompt',
                      bgcolor: '#0d0111',
                    }}
                    margin="dense"
                    color="secondary"
                    fullWidth
                  />
                ))}
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    sx={{
                      bgcolor: 'magenta',
                      color: '#f2f3f4',
                      fontFamily: 'Prompt',
                      fontWeight: 700,
                      margin: '10px',
                      '&:hover': {
                        bgcolor: 'magenta',
                      },
                    }}
                  >
                    Update
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PhonebookEntryComponent
