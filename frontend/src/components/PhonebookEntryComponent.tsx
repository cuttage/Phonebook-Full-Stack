import { useParams, Link } from 'react-router-dom'
import useStringAvatar from '../hooks/useStringAvatar'
import useFormattedString from '../hooks/useFormattedString'
import { fieldNames } from '../utils/formUtils'
import * as sxUtils from '../utils/sxUtils'
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
import { usePhonebookEntry } from '../hooks/usePhonebookEntry'

const PhonebookEntryComponent = () => {
  const { id } = useParams()
  const {
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
  } = usePhonebookEntry(id)
  const formatText = useFormattedString()

  if (isLoading) {
    return (
      <div>
        <IconButton
          size="large"
          sx={sxUtils.iconButtonSxTwo}
          component={Link}
          to="/"
        >
          <ArrowBackRounded />
        </IconButton>
        <h1>Phonebook Entry</h1>
        <Typography sx={sxUtils.typographySxOne}>Loading...</Typography>
      </div>
    )
  }
  if (isError) {
    return (
      <div>
        <IconButton
          size="large"
          sx={sxUtils.iconButtonSxTwo}
          component={Link}
          to="/"
        >
          <ArrowBackRounded />
        </IconButton>
        <h1>Phonebook Entry</h1>
        <Typography sx={sxUtils.typographySxOne}>
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
        sx={sxUtils.iconButtonSxTwo}
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
          <Avatar {...stringAvatar} sx={sxUtils.avatarSxTwo} />
          <Typography sx={sxUtils.typographySxTwo}>
            {phonebookEntry?.data?.firstName}{' '}
            {phonebookEntry?.data?.lastName && phonebookEntry?.data?.lastName}
          </Typography>
          <Typography sx={sxUtils.typographySxThree}>
            {phonebookEntry?.data?.number}
          </Typography>
          <div className="center-flex">
            <Tooltip title="Edit" arrow>
              <IconButton
                color="secondary"
                sx={sxUtils.iconButtonSxThree}
                onClick={toggleEditSection}
              >
                <EditRounded />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <IconButton
                color="secondary"
                sx={sxUtils.iconButtonSxThree}
                onClick={toggleDeleteSection}
              >
                <DeleteRounded />
              </IconButton>
            </Tooltip>
          </div>
          <Divider sx={sxUtils.dividerSxOne} />
          {deleteSection && (
            <div className="center-flex row-flex">
              <Typography sx={sxUtils.typographySxThree}>
                Permanently Delete
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                sx={sxUtils.buttonSxThree}
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
                    sx={sxUtils.textFieldSxOne}
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
                    sx={sxUtils.buttonSxTwo}
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
