import { useQuery } from '@tanstack/react-query'
import { fetchComments } from '../api/endpoints'

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
  })
}