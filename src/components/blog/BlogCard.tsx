import React from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Clock, ArrowRight, Edit2, Trash2, Eye } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { formatDate } from '../../utils/formatDate'
import type { BlogPost } from '../../api/types'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { hybridService } from '../../api/hybridService'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface BlogCardProps {
  post: BlogPost
  manageMode?: boolean
}

const BlogCard: React.FC<BlogCardProps> = ({ post, manageMode = false }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  
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
    authorId: post?.authorId,
    status: (post as any).status || 'published', // Handle status
    views: post?.views || 0,
    likes: post?.likes || 0
  }

  const isAuthor = user?.id === safePost.authorId

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    try {
      await hybridService.deleteHybridPost(safePost.id)
      
      // Refresh queries
      await queryClient.invalidateQueries({ queryKey: ['blogPosts'] })
      await queryClient.invalidateQueries({ queryKey: ['hybridPosts'] })
      
      toast.success('Post deleted successfully')
    } catch (error) {
      toast.error('Failed to delete post.')
    }
  }

  return (
    <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="h-full"
    >
        <Card className={`group relative flex flex-col h-full border-border/50 overflow-hidden bg-card/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 dark:bg-card/40 ${manageMode ? 'border-primary/20' : ''}`}>
        
        {safePost.featuredImage ? (
            <div className="relative h-52 overflow-hidden">
                <motion.img
                    src={safePost.featuredImage}
                    alt={safePost.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                
                <Badge className="absolute top-4 left-4 bg-background/90 text-foreground backdrop-blur-md shadow-lg hover:bg-background border-none">
                    {safePost.category}
                </Badge>
                
                {/* Status Badge for Manage Mode */}
                {manageMode && (
                   <Badge variant={safePost.status === 'published' ? 'default' : 'secondary'} className="absolute bottom-4 left-4 shadow-lg">
                     {safePost.status === 'published' ? 'Published' : 'Draft'}
                   </Badge>
                )}

                {/* Actions Overlay - Always visible in manageMode, or on hover otherwise */}
                {isAuthor && (
                   <div className={`absolute top-4 right-4 flex gap-2 transition-opacity duration-300 z-10 ${manageMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                     <Link to={`/edit-post/${safePost.id}`}>
                       <Button size="sm" variant="secondary" className="h-8 px-2 shadow-lg backdrop-blur-md bg-background/80 hover:bg-background hover:text-primary">
                         <Edit2 className="h-3.5 w-3.5 mr-1" />
                         Edit
                       </Button>
                     </Link>
                     <Button 
                        size="sm" 
                        variant="destructive" 
                        className="h-8 px-2 shadow-lg backdrop-blur-md"
                        onClick={handleDelete}
                     >
                       <Trash2 className="h-3.5 w-3.5 mr-1" />
                       Delete
                     </Button>
                   </div>
                )}
            </div>
        ) : (
             // Fallback for no image, still show actions
             <div className="relative h-20 bg-muted/20 border-b flex justify-end p-4">
                 {isAuthor && (
                   <div className="flex gap-2">
                     <Link to={`/edit-post/${safePost.id}`}>
                       <Button size="sm" variant="outline" className="h-8">
                         <Edit2 className="h-3.5 w-3.5" />
                       </Button>
                     </Link>
                     <Button size="sm" variant="destructive" onClick={handleDelete} className="h-8">
                       <Trash2 className="h-3.5 w-3.5" />
                     </Button>
                   </div>
                )}
             </div>
        )}
        
        <CardHeader className="pb-2 pt-5 px-5">
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-full">
                    <CalendarDays className="h-3 w-3" />
                    {formatDate(safePost.publishedAt)}
                </span>
                {manageMode && (
                  <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-full">
                      <Eye className="h-3 w-3" />
                      {safePost.views}
                  </span>
                )}
            </div>
            
            <Link to={`/blog/${safePost.id}`} className="focus:outline-none">
                <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors tracking-tight leading-tight">
                    {safePost.title}
                </h3>
            </Link>
        </CardHeader>
        
        <CardContent className="flex-1 px-5 pb-2">
            <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                {safePost.excerpt}
            </p>
        </CardContent>
        
        <CardFooter className="px-5 pb-5 pt-4 border-t border-border/50 mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full ring-2 ring-background overflow-hidden">
                     <img src={safePost.author.avatar} alt={safePost.author.name} className="h-full w-full object-cover" />
                </div>
                <span className="text-sm font-medium text-foreground/80">{safePost.author.name}</span>
            </div>
        </CardFooter>
        </Card>
    </motion.div>
  )
}

export default BlogCard