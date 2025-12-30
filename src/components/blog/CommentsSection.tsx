import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, ThumbsUp } from 'lucide-react'
import { Button } from '../ui/Button'
import { Textarea } from '../ui/Textarea'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar'
import { Card } from '../ui/Card'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { hybridService } from '../../api/hybridService'

interface CommentsSectionProps {
  postId: string
}

// Fixed Animation Variants with 'as const'
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const commentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: 'spring' as const, stiffness: 50 } 
  }
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const [newComment, setNewComment] = useState('')
  const queryClient = useQueryClient()

  // Fixed: Correct method name 'getHybridComments'
  const { data: comments = [] } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => hybridService.getHybridComments(postId),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    // Basic optimisic update or mutation logic could go here
    // For now we just clear the input
    setNewComment('')
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h3>Discussion ({comments.length})</h3>
      </div>

      {/* Input Form */}
      <Card className="p-6 border-2 focus-within:border-primary/50 transition-colors">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!newComment.trim()}>
                <Send className="mr-2 h-4 w-4" />
                Post Comment
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Animated List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {comments.map((comment: any) => (
            <motion.div
              key={comment.id}
              variants={commentVariants}
              layout
            >
              <Card className="p-6">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.author.avatar || comment.avatar} />
                    <AvatarFallback>{comment.author.name?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-sm">{comment.author.name || comment.author}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                         <ThumbsUp className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

export default CommentsSection