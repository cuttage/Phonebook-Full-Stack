export const buttonSxOne = {
  color: '#f2f3f4',
  fontFamily: 'Prompt',
  fontWeight: 700,
  textRendering: 'geometricPrecision',
}

export const buttonSxTwo = {
  bgcolor: 'magenta',
  ...buttonSxOne,
  margin: '10px',
  '&:hover': {
    bgcolor: 'magenta',
  },
}

export const buttonSxThree = {
  bgcolor: '#FF0080',
  ...buttonSxOne,
  margin: '10px',
  '&:hover': {
    bgcolor: '#FF0080',
  },
}

export const listItemSxOne = {
  border: '1px solid #f2f3f4',
}

export const textFieldSxOne = {
  ...listItemSxOne,
  input: buttonSxOne,
  label: buttonSxOne,
  fontFamily: 'Prompt',
  bgcolor: '#0d0111',
}

export const iconButtonSxOne = {
  color: '#f2f3f4',
}

export const iconButtonSxTwo = {
  color: '#f2f3f4',
  marginTop: '20px',
}

export const iconButtonSxThree = {
  bgcolor: 'transparent',
  ...buttonSxOne,
  margin: '10px',
  '&:hover': {
    bgcolor: 'transparent',
  },
}

export const avatarSxOne = {
  bgcolor: 'magenta',
  color: '#f2f3f4',
}

export const avatarSxTwo = {
  width: 56,
  height: 56,
  ...avatarSxOne,
}

export const dividerSxOne = {
  ...iconButtonSxTwo,
  width: '100%',
  marginBottom: '20px',
  borderColor: '#f2f3f4',
}

export const paginationSxOne = {
  button: {
    ...buttonSxOne,
    marginTop: '20px',
  },
}

export const typographySxOne = {
  ...buttonSxOne,
  fontSize: '18px',
}

export const typographySxTwo = {
  ...buttonSxOne,
  fontSize: '36px',
}

export const typographySxThree = {
  ...buttonSxOne,
  fontSize: '24px',
}

export const listSxOne = {
  width: '100%',
  paddingBottom: '74.02px',
}
