export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  authorId: string
  author: Author
  category: string
  tags: string[]
  publishedAt: string
  updatedAt: string  // Add this
  readTime: number
  likes: number
  bookmarks: number
  views: number  // Add this
  featuredImage?: string
  isFeatured?: boolean  // Add this
  status: 'draft' | 'published'  // Add this
}

export interface Author {
  id: string
  name: string
  avatar: string
  bio: string
  role: string
  social?: {  // Add this
    twitter?: string
    github?: string
    website?: string
    linkedin?: string
  }
}

export interface Comment {
  id: string
  postId: string
  author: string
  avatar: string
  content: string
  createdAt: string
  likes: number
  isVerified?: boolean
}

export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}