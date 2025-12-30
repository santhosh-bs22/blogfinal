import { apiClient } from './client'
import type { BlogPost, Author, Comment } from './types'

export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const [posts, authors] = await Promise.all([
      apiClient.get<BlogPost[]>('posts.json'),
      apiClient.get<Author[]>('authors.json')
    ])
    
    // Merge authors with posts
    return posts.map(post => ({
      ...post,
      author: authors.find(author => author.id === post.authorId) || {
        id: post.authorId,
        name: 'Unknown Author',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown',
        bio: '',
        role: 'Writer'
      }
    }))
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export const fetchBlogPost = async (id: string): Promise<BlogPost | null> => {
  try {
    const posts = await fetchBlogPosts()
    return posts.find(post => post.id === id) || null
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export const fetchComments = async (postId: string): Promise<Comment[]> => {
  try {
    const comments = await apiClient.get<Comment[]>('comments.json')
    return comments.filter(comment => comment.postId === postId)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return []
  }
}

// export const fetchCategories = async (): Promise<string[]> => {
//   try {
//     const posts = await apiClient.get<BlogPost[]>('posts.json')
//     const categories = [...new Set(posts.map(post => post.category))]
//     return ['all', ...categories]
//   } catch (error) {
//     console.error('Error fetching categories:', error)
//     return ['all']
//   }
// }

export const fetchCategories = async (): Promise<any[]> => {
  try {
    const categories = await apiClient.get<any[]>('categories.json')
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return [
      { id: 'all', name: 'All', slug: 'all', description: 'All blog posts' }
    ]
  }
}