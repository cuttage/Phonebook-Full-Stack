function useFormattedString(): (str: string) => string {
  const formatString = (str: string): string => {
    const formatted = str.replace(/([A-Z])/g, ' $1')
    const words = formatted.split(' ')
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    return capitalizedWords.join(' ')
  }

  return formatString
}

export default useFormattedString
