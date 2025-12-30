import React, { useState } from 'react'
import { Heart, Bookmark } from 'lucide-react'
import { Button } from '../ui/Button'

interface LikeBookmarkProps {
  initialLikes: number
  initialBookmarks: number
  onLike?: () => void
  onBookmark?: () => void
}

const LikeBookmark: React.FC<LikeBookmarkProps> = ({
  initialLikes,
  initialBookmarks,
}) => {
  const [likes, setLikes] = useState(initialLikes)
  const [bookmarks, setBookmarks] = useState(initialBookmarks)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setIsLiked(!isLiked)
  }

  const handleBookmark = () => {
    if (isBookmarked) {
      setBookmarks(bookmarks - 1)
    } else {
      setBookmarks(bookmarks + 1)
    }
    setIsBookmarked(!isBookmarked)
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className="gap-2"
      >
        <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        <span>{likes}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        className="gap-2"
      >
        <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
        <span>{bookmarks}</span>
      </Button>
    </div>
  )
}

export default LikeBookmark