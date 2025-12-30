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

const LOCAL_STORAGE_KEY = 'blog-custom-posts';

export const postsApi = {
  // New helper to get all posts (mock + local)
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      // 1. Get default posts from public/mock-api/posts.json
      const defaultPosts = await apiClient.get<BlogPost[]>('posts.json')
      
      // 2. Get custom posts from localStorage
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      const customPosts: BlogPost[] = saved ? JSON.parse(saved) : []
      
      // Combine them, putting newest custom posts first
      return [...customPosts, ...defaultPosts]
    } catch (error) {
      console.error('Error fetching posts:', error)
      return []
    }
  },

  async getUserPosts(userId: string): Promise<BlogPost[]> {
    const allPosts = await this.getAllPosts()
    return allPosts.filter(post => post.authorId === userId)
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

    // Save to localStorage so it persists
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    const customPosts = saved ? JSON.parse(saved) : []
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([newPost, ...customPosts]))
    
    return newPost
  },

  async updatePost(id: string, postData: Partial<BlogPost>): Promise<BlogPost> {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    let customPosts: BlogPost[] = saved ? JSON.parse(saved) : []
    const postIndex = customPosts.findIndex(p => p.id === id)
    
    if (postIndex === -1) {
      throw new Error('Post not found or is a read-only default post')
    }

    const updatedPost: BlogPost = {
      ...customPosts[postIndex],
      ...postData,
      updatedAt: new Date().toISOString(),
    }

    customPosts[postIndex] = updatedPost
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customPosts))
    
    return updatedPost
  },

  async deletePost(id: string): Promise<void> {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      const customPosts: BlogPost[] = JSON.parse(saved)
      const filtered = customPosts.filter(p => p.id !== id)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered))
    }
  },
}