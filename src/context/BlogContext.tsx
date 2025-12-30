import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Comment } from '../api/types'

interface BlogContextType {
  readingProgress: number
  updateReadingProgress: (progress: number) => void
  
  bookmarkedPosts: string[]
  toggleBookmark: (postId: string) => void
  isBookmarked: (postId: string) => boolean
  
  likedPosts: string[]
  toggleLike: (postId: string) => void
  isLiked: (postId: string) => boolean
  
  userComments: Record<string, Comment[]>
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void
  
  recentlyViewed: string[]
  addToRecentlyViewed: (postId: string) => void
  
  clearUserData: () => void
}

const BlogContext = createContext<BlogContextType | undefined>(undefined)

export const useBlog = () => {
  const context = useContext(BlogContext)
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider')
  }
  return context
}

interface BlogProviderProps {
  children: ReactNode
}

export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const [readingProgress, setReadingProgress] = useState<number>(0)
  
  const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>(() => {
    const saved = localStorage.getItem('blog-bookmarks')
    return saved ? JSON.parse(saved) : []
  })
  
  const [likedPosts, setLikedPosts] = useState<string[]>(() => {
    const saved = localStorage.getItem('blog-likes')
    return saved ? JSON.parse(saved) : []
  })
  
  const [userComments, setUserComments] = useState<Record<string, Comment[]>>(() => {
    const saved = localStorage.getItem('blog-comments')
    return saved ? JSON.parse(saved) : {}
  })
  
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem('blog-recently-viewed')
    return saved ? JSON.parse(saved) : []
  })

  const updateReadingProgress = useCallback((progress: number) => {
    setReadingProgress(Math.min(100, Math.max(0, progress)))
  }, [])

  const toggleBookmark = useCallback((postId: string) => {
    setBookmarkedPosts(prev => {
      const newBookmarks = prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
      
      localStorage.setItem('blog-bookmarks', JSON.stringify(newBookmarks))
      return newBookmarks
    })
  }, [])

  const isBookmarked = useCallback((postId: string) => {
    return bookmarkedPosts.includes(postId)
  }, [bookmarkedPosts])

  const toggleLike = useCallback((postId: string) => {
    setLikedPosts(prev => {
      const newLikes = prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
      
      localStorage.setItem('blog-likes', JSON.stringify(newLikes))
      return newLikes
    })
  }, [])

  const isLiked = useCallback((postId: string) => {
    return likedPosts.includes(postId)
  }, [likedPosts])

  const addComment = useCallback((postId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...commentData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      avatar: commentData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${commentData.author}`
    }

    setUserComments(prev => {
      const newComments = {
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }
      
      localStorage.setItem('blog-comments', JSON.stringify(newComments))
      return newComments
    })
  }, [])

  const addToRecentlyViewed = useCallback((postId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== postId)
      const newRecentlyViewed = [postId, ...filtered].slice(0, 10)
      
      localStorage.setItem('blog-recently-viewed', JSON.stringify(newRecentlyViewed))
      return newRecentlyViewed
    })
  }, [])

  const clearUserData = useCallback(() => {
    localStorage.removeItem('blog-bookmarks')
    localStorage.removeItem('blog-likes')
    localStorage.removeItem('blog-comments')
    localStorage.removeItem('blog-recently-viewed')
    
    setBookmarkedPosts([])
    setLikedPosts([])
    setUserComments({})
    setRecentlyViewed([])
    setReadingProgress(0)
  }, [])

  const value: BlogContextType = {
    readingProgress,
    updateReadingProgress,
    bookmarkedPosts,
    toggleBookmark,
    isBookmarked,
    likedPosts,
    toggleLike,
    isLiked,
    userComments,
    addComment,
    recentlyViewed,
    addToRecentlyViewed,
    clearUserData
  }

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  )
}