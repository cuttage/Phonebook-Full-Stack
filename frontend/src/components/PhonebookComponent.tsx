import { Expr, query as q } from 'faunadb'
import client from '../faunadbClientFauna'
import { Link } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Typography from '@mui/material/Typography'
import { useQuery } from 'react-query'
import useStringAvatar from '../hooks/useStringAvatar'

const collection = process.env.REACT_APP_FAUNA_COLLECTION as string

const PhonebookComponent = () => {
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
          }}
        >
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
