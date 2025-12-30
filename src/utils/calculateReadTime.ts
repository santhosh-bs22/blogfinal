export const calculateReadTime = (content: string, wordsPerMinute = 200): number => {
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}