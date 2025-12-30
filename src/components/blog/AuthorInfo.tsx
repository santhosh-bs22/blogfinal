import React from 'react'
import { CalendarDays, Clock } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar'
import { formatDate } from '../../utils/formatDate'
import type { Author } from '../../api/types'

interface AuthorInfoProps {
  author: Author
  publishedAt: string
  readTime: number
}

const AuthorInfo: React.FC<AuthorInfoProps> = ({
  author,
  publishedAt,
  readTime,
}) => {
  const initials = author.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex items-center gap-4 p-6 border rounded-lg">
      <Avatar className="h-16 w-16">
        <AvatarImage src={author.avatar} alt={author.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{author.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{author.role}</p>
        <p className="text-sm">{author.bio}</p>
        
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span>{formatDate(publishedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readTime} min read</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthorInfo