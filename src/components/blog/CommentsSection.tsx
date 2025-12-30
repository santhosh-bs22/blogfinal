import React, { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'
import { formatDate } from '../../utils/formatDate'
import { useComments } from '../../hooks/useComments'
import type { Comment as CommentType } from '../../api/types'

interface CommentsSectionProps {
  postId: string
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const { data: comments, isLoading } = useComments(postId)
  const [comment, setComment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      // In a real app, you would submit this to your API
      console.log('Submitting comment:', comment)
      setComment('')
    }
  }

  if (isLoading) {
    return <div>Loading comments...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-xl font-semibold">
          Comments ({(comments?.length || 0)})
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
        <Button type="submit" disabled={!comment.trim()}>
          Post Comment
        </Button>
      </form>

      <div className="space-y-6">
        {comments?.map((comment: CommentType) => (
          <div key={comment.id} className="flex gap-4 p-4 border rounded-lg">
            <Avatar>
              <AvatarImage src={comment.avatar} alt={comment.author} />
              <AvatarFallback>
                {comment.author.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">{comment.author}</h4>
                <span className="text-sm text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommentsSection