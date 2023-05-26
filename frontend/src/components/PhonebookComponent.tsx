import { useState } from 'react'
import { Expr, query as q } from 'faunadb'
import client from '../faunadbClientFauna'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'
import useStringAvatar from '../hooks/useStringAvatar'
import { useForm } from '../hooks/useForm'
import useFormattedString from '../hooks/useFormattedString'
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
  Pagination,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'

const collection = process.env.REACT_APP_FAUNA_COLLECTION as string

const PhonebookComponent = () => {
  const queryClient = useQueryClient()
  const { formValues, setFormValues, handleInputChange } = useForm()
  const formatText = useFormattedString()
  const [addSection, setAddSection] = useState<boolean>(false)
  const [sortKey, setSortKey] = useState<string>('firstName')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const ITEMS_PER_PAGE = 10
  const [currentPage, setCurrentPage] = useState<number>(1)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

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

  const sortedEntries = phonebookEntries?.sort((a, b) => {
    const nameA = (a?.data[sortKey as keyof EntryData] || '').toLowerCase()
    const nameB = (b?.data[sortKey as keyof EntryData] || '').toLowerCase()
    return nameA.localeCompare(nameB)
  })

  const filteredEntries = sortedEntries?.filter((entry) => {
    const fullName = `${entry?.data?.firstName} ${
      entry?.data?.lastName || ''
    }`.toLowerCase()
    const number = entry?.data?.number?.toLowerCase()

    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      number.includes(searchQuery.toLowerCase())
    )
  })

  const itemCount = filteredEntries?.length || 0

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

      console.log('Phonebook Entry Created:', response)

      queryClient.invalidateQueries('phonebookEntries')

      setFormValues(initialFormValues)
    } catch (error) {
      console.error('Failed to create phonebook entry', error)
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
          >
            <Button
              onClick={() => handleSort('firstName')}
              sx={{
                color: '#f2f3f4',
                fontFamily: 'Prompt',
                fontWeight: 700,
                textRendering: 'geometricPrecision',
              }}
            >
              Sort by First Name
            </Button>
            <Button
              onClick={() => handleSort('lastName')}
              sx={{
                color: '#f2f3f4',
                fontFamily: 'Prompt',
                fontWeight: 700,
                textRendering: 'geometricPrecision',
              }}
            >
              Sort by Last Name
            </Button>
          </ListItem>
          <ListItem
            sx={{
              border: '1px solid #f2f3f4',
            }}
          >
            <TextField
              label="Search"
              name="searchQuery"
              value={searchQuery}
              onChange={handleSearch}
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
          </ListItem>
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
          {filteredEntries?.slice(startIndex, endIndex).map((entry, index) => (
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
          <Pagination
            count={Math.ceil(itemCount / ITEMS_PER_PAGE)}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            sx={{
              button: {
                color: '#f2f3f4',
                fontFamily: 'Prompt',
                fontWeight: 700,
                textRendering: 'geometricPrecision',
                marginTop: '20px',
              },
            }}
          />
        </List>
      )}
    </div>
  )
}

export default PhonebookComponent
