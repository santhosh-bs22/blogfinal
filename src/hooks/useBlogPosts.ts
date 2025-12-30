import { useQuery } from '@tanstack/react-query'
import { fetchBlogPosts, fetchBlogPost } from '../api/endpoints'
import { useBlog } from '../context/BlogContext'
import type { BlogPost } from '../api/types'

export const useBlogPosts = (category?: string, search?: string) => {
  const { addToRecentlyViewed } = useBlog()
  
  return useQuery({
    queryKey: ['blogPosts', category, search],
    queryFn: () => fetchBlogPosts(),
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
      const post = await fetchBlogPost(id)
      if (post) {
        addToRecentlyViewed(id)
      }
      return post
    },
    enabled: !!id,
  })
}