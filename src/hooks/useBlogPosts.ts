import { useQuery } from '@tanstack/react-query'
import { hybridService } from '../api/hybridService' // Using hybridService for consistency
import { useBlog } from '../context/BlogContext'
import type { BlogPost } from '../api/types'

export const useBlogPosts = (category?: string, search?: string) => {
  return useQuery({
    queryKey: ['blogPosts', category, search],
    // Switch to hybridService to fetch posts created by the user
    queryFn: () => hybridService.getHybridPosts(), 
    select: (data) => {
      let filtered = data
      
      if (category && category !== 'all') {
        filtered = filtered.filter((post: BlogPost) => post.category === category)
      }
      
      if (search) {
        const searchLower = search.toLowerCase()
        filtered = filtered.filter((post: BlogPost) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)) ||
          post.author.name.toLowerCase().includes(searchLower)
        )
      }
      
      return filtered
    },
  })
}

export const useBlogPost = (id: string) => {
  const { addToRecentlyViewed } = useBlog()
  
  return useQuery({
    queryKey: ['blogPost', id],
    queryFn: async () => {
      // Use hybridService.getPost to find the post from the correct storage
      const post = await hybridService.getPost(id)
      
      if (post) {
        addToRecentlyViewed(id)
        return post
      }
      return null
    },
    enabled: !!id,
  })
}