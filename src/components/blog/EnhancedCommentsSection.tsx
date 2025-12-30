import React, { useState } from 'react'
import { 
  MessageSquare, Heart, Share2, Reply, 
  MoreVertical, Send, Smile, Image as ImageIcon,
  ThumbsUp, CheckCircle
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { Textarea } from '../ui/Textarea'
import { Card, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { useAuth } from '../../context/AuthContext'
import { hybridService } from '../../api/hybridService'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import type { Comment } from '../../api/types'

interface EnhancedCommentsSectionProps {
  postId: string
}

const EnhancedCommentsSection: React.FC<EnhancedCommentsSectionProps> = ({ postId }) => {
  const { user, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => hybridService.getHybridComments(postId),
  })

  const createCommentMutation = useMutation({
    mutationFn: (commentData: Omit<Comment, 'id'>) => 
      hybridService.createHybridComment(commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      setNewComment('')
      setReplyingTo(null)
      toast.success('Comment added successfully!')
    },
    onError: () => {
      toast.error('Failed to add comment')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    const commentData: Omit<Comment, 'id'> = {
      postId,
      author: user.name,
      avatar: user.avatar,
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
    }

    createCommentMutation.mutate(commentData)
  }

  const handleLikeComment = (commentId: string) => {
    toast.info('Like feature coming soon!')
  }

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId)
    const comment = comments.find(c => c.id === commentId)
    if (comment) {
      setNewComment(`@${comment.author} `)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Discussion ({comments.length})</h3>
            <p className="text-muted-foreground">Join the conversation</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <form onSubmit={handleSubmit}>
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px] resize-none border-2 mb-4"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="ghost" size="icon">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                      {replyingTo && (
                        <Badge variant="secondary" className="gap-1">
                          Replying
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-3 w-3 p-0"
                            onClick={() => setReplyingTo(null)}
                          >
                            ×
                          </Button>
                        </Badge>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      disabled={!newComment.trim() || createCommentMutation.isPending}
                      className="gap-2"
                    >
                      {createCommentMutation.isPending ? (
                        'Posting...'
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Post Comment
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2">
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-semibold mb-2">Join the discussion</h4>
            <p className="text-muted-foreground mb-4">
              Sign in to leave a comment and interact with the community
            </p>
            <Button onClick={() => window.location.href = '/login'}>
              Sign In to Comment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <Card key={comment.id} className="border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={comment.avatar} />
                      <AvatarFallback>{comment.author[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{comment.author}</span>
                        {comment.isVerified && (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        • {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mb-4">{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleLikeComment(comment.id)}
                      >
                        <Heart className="h-4 w-4" />
                        <span>{comment.likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleReply(comment.id)}
                      >
                        <Reply className="h-4 w-4" />
                        Reply
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h4 className="text-lg font-semibold mb-2">No comments yet</h4>
              <p className="text-muted-foreground">
                Be the first to share your thoughts!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default EnhancedCommentsSection