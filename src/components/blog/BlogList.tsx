import React from 'react'
import BlogCard from './BlogCard'
import LoadingSpinner from '../ui/LoadingSpinner'
import { useBlogPosts } from '../../hooks/useBlogPosts'
import type { BlogPost } from '../../api/types'

interface BlogListProps {
  category?: string
  searchQuery?: string
}

const BlogList: React.FC<BlogListProps> = ({ category, searchQuery }) => {
  const { data: posts, isLoading, error } = useBlogPosts(category, searchQuery)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-semibold text-destructive mb-2">
          Error loading posts
        </h3>
        <p className="text-muted-foreground">
          Please try again later
        </p>
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-semibold mb-2">
          No posts found
        </h3>
        <p className="text-muted-foreground">
          {searchQuery 
            ? `No posts matching "${searchQuery}"`
            : 'No posts available'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post: BlogPost) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  )
}

export default BlogList