import { useState } from 'react'
import { Link } from 'react-router-dom'
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
import * as sxUtils from '../utils/sxUtils'
import { fieldNames } from '../utils/formUtils'
import { usePhonebook } from '../hooks/usePhonebook'
import useStringAvatar from '../hooks/useStringAvatar'

const PhonebookComponent = () => {
  const {
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
  } = usePhonebook()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const ITEMS_PER_PAGE = 10
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

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

  const stringAvatars =
    phonebookEntries?.map((entry) =>
      useStringAvatar(`${entry?.data?.firstName}`)
    ) ?? []

  if (isLoading) {
    return (
      <div>
        <h1>Phonebook</h1>
        <Typography sx={sxUtils.typographySxOne}>Loading...</Typography>
      </div>
    )
  }
  if (isError) {
    return (
      <div>
        <h1>Phonebook</h1>
        <Typography sx={sxUtils.typographySxOne}>
          Failed to fetch phonebook entries
        </Typography>
      </div>
    )
  }

  return (
    <div>
      <h1>Phonebook</h1>
      {phonebookEntries !== null && phonebookEntries !== undefined && (
        <List sx={sxUtils.listSxOne}>
          <ListItem sx={sxUtils.listItemSxOne}>
            <Button
              onClick={() => handleSort('firstName')}
              sx={sxUtils.buttonSxOne}
            >
              Sort by First Name
            </Button>
            <Button
              onClick={() => handleSort('lastName')}
              sx={sxUtils.buttonSxOne}
            >
              Sort by Last Name
            </Button>
          </ListItem>
          <ListItem sx={sxUtils.listItemSxOne}>
            <TextField
              label="Search"
              name="searchQuery"
              value={searchQuery}
              onChange={handleSearch}
              variant="filled"
              sx={sxUtils.textFieldSxOne}
              margin="dense"
              color="secondary"
              fullWidth
            />
          </ListItem>
          <ListItem sx={sxUtils.listItemSxOne} onClick={toggleAddSection}>
            <ListItemAvatar>
              <IconButton sx={sxUtils.iconButtonSxOne} disabled>
                <AddRoundedIcon sx={sxUtils.iconButtonSxOne} />
              </IconButton>
            </ListItemAvatar>
            <ListItemText
              disableTypography
              primary={
                <Typography variant="body1" sx={sxUtils.buttonSxOne}>
                  Add
                </Typography>
              }
            />
          </ListItem>
          {addSection && (
            <ListItem sx={sxUtils.listItemSxOne}>
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
                    sx={sxUtils.textFieldSxOne}
                    margin="dense"
                    color="secondary"
                    fullWidth
                  />
                ))}
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={sxUtils.buttonSxTwo}
                >
                  Create
                </Button>
              </form>
            </ListItem>
          )}
          {filteredEntries?.slice(startIndex, endIndex).map((entry, index) => (
            <ListItem key={entry?.ref?.value?.id} sx={sxUtils.listItemSxOne}>
              <Link
                to={`/entry/${entry?.ref?.value?.id}`}
                className="center-flex"
              >
                <ListItemAvatar>
                  <Avatar {...stringAvatars[index]} sx={sxUtils.avatarSxOne} />
                </ListItemAvatar>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography variant="body1" sx={sxUtils.buttonSxOne}>
                      {entry?.data?.firstName}{' '}
                      {entry?.data?.lastName && entry?.data?.lastName}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={sxUtils.buttonSxOne}>
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
            sx={sxUtils.paginationSxOne}
          />
        </List>
      )}
    </div>
  )
}

export default PhonebookComponent
