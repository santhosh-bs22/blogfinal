import { apiClient } from './client'
import type { BlogPost } from './types'

interface CreatePostData {
  title: string
  content: string
  excerpt: string
  authorId: string
  author: {
    id: string
    name: string
    avatar: string
    bio: string
    role: string
  }
  category: string
  tags: string[]
  featuredImage?: string
  status: 'draft' | 'published'
}

export const postsApi = {
  async getUserPosts(userId: string): Promise<BlogPost[]> {
    try {
      const posts = await apiClient.get<BlogPost[]>('posts.json')
      return posts.filter(post => post.authorId === userId)
    } catch (error) {
      console.error('Error fetching user posts:', error)
      return []
    }
  },

  async createPost(postData: CreatePostData): Promise<BlogPost> {
    const currentDate = new Date().toISOString()
    
    const newPost: BlogPost = {
      ...postData,
      id: `post-${Date.now()}`,
      publishedAt: currentDate,
      updatedAt: currentDate,
      readTime: Math.ceil(postData.content.length / 1000),
      likes: 0,
      bookmarks: 0,
      views: 0,
      isFeatured: false,
    }

    // In a real app, you would save this to your database
    console.log('Creating post:', newPost)
    
    return newPost
  },

  async updatePost(id: string, postData: Partial<BlogPost>): Promise<BlogPost> {
    try {
      const posts = await apiClient.get<BlogPost[]>('posts.json')
      const postIndex = posts.findIndex(p => p.id === id)
      
      if (postIndex === -1) {
        throw new Error('Post not found')
      }

      const updatedPost: BlogPost = {
        ...posts[postIndex],
        ...postData,
        updatedAt: new Date().toISOString(),
      }

      // In a real app, you would save this to your database
      console.log('Updating post:', updatedPost)
      
      return updatedPost
    } catch (error) {
      console.error('Error updating post:', error)
      throw error
    }
  },

  async deletePost(id: string): Promise<void> {
    // Simulate deletion
    console.log('Deleting post:', id)
    return Promise.resolve()
  },
}