import React from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Clock, User } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { formatDate } from '../../utils/formatDate'
import type { BlogPost } from '../../api/types'

interface BlogCardProps {
  post: BlogPost
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  // Safely extract data with defaults
  const safePost = {
    id: post?.id || 'unknown',
    title: post?.title || 'Untitled Post',
    excerpt: post?.excerpt || 'No description available',
    category: post?.category || 'General',
    author: {
      name: post?.author?.name || 'Unknown Author',
      avatar: post?.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous`,
      id: post?.author?.id || 'unknown'
    },
    featuredImage: post?.featuredImage,
    publishedAt: post?.publishedAt || new Date().toISOString(),
    readTime: post?.readTime || 5,
    tags: post?.tags || [],
    likes: post?.likes || 0,
    bookmarks: post?.bookmarks || 0,
    views: post?.views || 0
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col hover-lift">
      {safePost.featuredImage && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={safePost.featuredImage}
            alt={safePost.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80'
            }}
          />
          <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm">
            {safePost.category}
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <Link to={`/blog/${safePost.id}`} className="focus-ring rounded-md">
          <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {safePost.title}
          </h3>
        </Link>
      </CardHeader>
      
      <CardContent className="flex-1 pb-3">
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {safePost.excerpt}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{safePost.author.name}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>{formatDate(safePost.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{safePost.readTime} min read</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="flex flex-wrap gap-2">
          {safePost.tags.slice(0, 3).map((tag: string) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="text-xs hover:bg-primary/10 transition-colors"
            >
              #{tag}
            </Badge>
          ))}
          {safePost.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{safePost.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export default BlogCard