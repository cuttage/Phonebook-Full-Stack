function useStringAvatar(name: string) {
  const stringAvatar = { children: `${name.split(' ')[0][0]}` }
  return stringAvatar
}

export default useStringAvatar
