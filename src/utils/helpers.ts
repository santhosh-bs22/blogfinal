export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const generateExcerpt = (content: string, length: number = 150): string => {
  return truncateText(content, length)
}