import { query as q } from 'faunadb'
import client from '../faunadbClientFauna'
import { useParams, Link } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { useQuery } from 'react-query'
import useStringAvatar from '../hooks/useStringAvatar'

const collection = process.env.REACT_APP_FAUNA_COLLECTION as string

const PhonebookEntryComponent = () => {
  const { id } = useParams()

  const fetchPhonebookEntry = async () => {
    try {
      const query = q.Get(q.Ref(q.Collection(collection), id))

      const response = await client.query<PhonebookEntryData>(query)

      console.log('Phonebook Entry Loaded:', response.data)

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

  if (isLoading) {
    return (
      <div>
        <IconButton
          size="large"
          sx={{ color: '#f2f3f4', marginTop: '20px' }}
          component={Link}
          to="/"
        >
          <ArrowBackRoundedIcon />
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
          <ArrowBackRoundedIcon />
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
    <div>
      <IconButton
        size="large"
        sx={{ color: '#f2f3f4', marginTop: '20px' }}
        component={Link}
        to="/"
      >
        <ArrowBackRoundedIcon />
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
          <Divider
            sx={{ borderColor: '#f2f3f4', width: '100%', marginTop: '20px' }}
          />
        </div>
      )}
    </div>
  )
}

export default PhonebookEntryComponent
