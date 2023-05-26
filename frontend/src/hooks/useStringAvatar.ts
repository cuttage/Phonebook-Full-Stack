function useStringAvatar(name: string): { children: string } {
  const stringAvatar = { children: `${name.split(' ')[0][0].toUpperCase()}` }
  return stringAvatar
}

export default useStringAvatar
