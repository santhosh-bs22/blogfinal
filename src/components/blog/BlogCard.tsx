import React from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Clock, User } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { formatDate } from '../../utils/formatDate'
import type { BlogPost } from '../../api/types'
import { motion } from 'framer-motion' // Added framer-motion

interface BlogCardProps {
  post: BlogPost
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  // Safely extract data (kept from original)
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
    <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="h-full"
    >
        <Card className="group hover:shadow-2xl transition-all duration-300 h-full flex flex-col border-border/50 overflow-hidden">
        {safePost.featuredImage && (
            <div className="relative h-48 overflow-hidden">
            <motion.img
                src={safePost.featuredImage}
                alt={safePost.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80'
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm shadow-sm">
                {safePost.category}
            </Badge>
            </div>
        )}
        
        <CardHeader className="pb-3 relative">
            <Link to={`/blog/${safePost.id}`} className="focus-ring rounded-md outline-none">
            <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2 tracking-tight">
                {safePost.title}
            </h3>
            </Link>
        </CardHeader>
        
        <CardContent className="flex-1 pb-3">
            <p className="text-muted-foreground line-clamp-3 mb-4 text-sm leading-relaxed">
            {safePost.excerpt}
            </p>
            
            <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-primary" />
                <span className="text-foreground/80 font-medium">{safePost.author.name}</span>
                </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                <div className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>{formatDate(safePost.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{safePost.readTime} min read</span>
                </div>
            </div>
            </div>
        </CardContent>
        
        <CardFooter className="pt-2 pb-4">
            <div className="flex flex-wrap gap-2 w-full">
            {safePost.tags.slice(0, 3).map((tag: string) => (
                <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                #{tag}
                </Badge>
            ))}
            </div>
        </CardFooter>
        </Card>
    </motion.div>
  )
}

export default BlogCard