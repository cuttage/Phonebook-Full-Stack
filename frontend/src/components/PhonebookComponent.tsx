import { useState } from 'react'
import { Expr, query as q } from 'faunadb'
import client from '../faunadbClientFauna'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'
import useStringAvatar from '../hooks/useStringAvatar'
import { useForm } from '../hooks/useForm'
import { initialFormValues, fieldNames } from '../formUtils'
import {
  IconButton,
  TextField,
  Typography,
  ListItemAvatar,
  ListItemText,
  ListItem,
  List,
  Avatar,
  Button,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'

const collection = process.env.REACT_APP_FAUNA_COLLECTION as string

const PhonebookComponent = () => {
  const queryClient = useQueryClient()
  const { formValues, setFormValues, handleInputChange } = useForm()
  const [addSection, setAddSection] = useState<boolean>(false)

  const fetchPhonebookEntries = async () => {
    try {
      const query = q.Map(
        q.Paginate(q.Documents(q.Collection(collection))),
        q.Lambda((ref: Expr) => q.Get(ref))
      )

      const response = await client.query<FindPhonebookResponse>(query)

      console.log('Phonebook Loaded:', response.data.data)

      return response.data.data
    } catch (error) {
      console.error('Failed to fetch phonebook entries', error)
      throw error
    }
  }

  const {
    data: phonebookEntries,
    isLoading,
    isError,
  } = useQuery('phonebookEntries', fetchPhonebookEntries)

  const toggleAddSection = () => {
    setAddSection(!addSection)
  }

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

    try {
      const response = await client.query(
        q.Create(q.Collection(collection), { data: formValues })
      )

      console.log('Form submitted:', response)

      queryClient.invalidateQueries('phonebookEntries')

      setFormValues(initialFormValues)
    } catch (error) {
      console.error('Failed to create phonebook entry', error)
    }
  }

  if (isLoading) {
    return (
      <div>
        <h1>Phonebook</h1>
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
        <h1>Phonebook</h1>
        <Typography
          style={{
            color: '#f2f3f4',
            fontFamily: 'Prompt',
            fontWeight: 700,
            fontSize: '18px',
            textRendering: 'geometricPrecision',
          }}
        >
          Failed to fetch phonebook entries
        </Typography>
      </div>
    )
  }

  const stringAvatars =
    phonebookEntries?.map((entry) =>
      useStringAvatar(`${entry?.data?.firstName}`)
    ) ?? []

  return (
    <div>
      <h1>Phonebook</h1>
      {phonebookEntries !== null && phonebookEntries !== undefined && (
        <List
          sx={{
            width: '100%',
            paddingBottom: '74.02px',
          }}
        >
          <ListItem
            sx={{
              border: '1px solid #f2f3f4',
            }}
            onClick={toggleAddSection}
          >
            <ListItemAvatar>
              <IconButton sx={{ color: '#f2f3f4' }} disabled>
                <AddRoundedIcon sx={{ color: '#f2f3f4' }} />
              </IconButton>
            </ListItemAvatar>
            <ListItemText
              disableTypography
              primary={
                <Typography
                  variant="body1"
                  style={{
                    color: '#f2f3f4',
                    fontFamily: 'Prompt',
                    fontWeight: 700,
                    textRendering: 'geometricPrecision',
                  }}
                >
                  Add
                </Typography>
              }
            />
          </ListItem>
          {addSection && (
            <ListItem
              sx={{
                border: '1px solid #f2f3f4',
              }}
            >
              <form onSubmit={handleSubmit}>
                {fieldNames.map((fieldName) => (
                  <TextField
                    key={fieldName.toString()}
                    required={
                      fieldName === 'firstName' || fieldName === 'number'
                    }
                    label={fieldName.toString()}
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
                  Create
                </Button>
              </form>
            </ListItem>
          )}
          {phonebookEntries?.map((entry, index) => (
            <ListItem
              key={entry?.ref?.value?.id}
              sx={{
                border: '1px solid #f2f3f4',
              }}
            >
              <Link
                to={`/entry/${entry?.ref?.value?.id}`}
                className="center-flex"
              >
                <ListItemAvatar>
                  <Avatar
                    {...stringAvatars[index]}
                    sx={{ bgcolor: 'magenta', color: '#f2f3f4' }}
                  />
                </ListItemAvatar>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      variant="body1"
                      style={{
                        color: '#f2f3f4',
                        fontFamily: 'Prompt',
                        fontWeight: 700,
                        textRendering: 'geometricPrecision',
                      }}
                    >
                      {entry?.data?.firstName}{' '}
                      {entry?.data?.lastName && entry?.data?.lastName}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      style={{
                        color: '#f2f3f4',
                        fontFamily: 'Prompt',
                        fontWeight: 700,
                        textRendering: 'geometricPrecision',
                      }}
                    >
                      {entry?.data?.number}
                    </Typography>
                  }
                />
              </Link>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  )
}

export default PhonebookComponent
