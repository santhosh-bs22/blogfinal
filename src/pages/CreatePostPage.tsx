import React from 'react'
import MarkdownEditor from '../components/editor/MarkdownEditor'
import { useNavigate } from 'react-router-dom'
import { postsApi } from '../api/posts'
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner'

interface PostFormData {
  title: string
  content: string
  excerpt: string
  tags: string[]
  category: string
  featuredImage?: string
  status: 'draft' | 'published'
}

const CreatePostPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (data: PostFormData) => {
    if (!user) return

    try {
      const postData = {
        ...data,
        authorId: user.id,
        author: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          bio: user.bio || '',
          role: user.role,
        },
      }

      const newPost = await postsApi.createPost(postData)
      
      toast.success(
        data.status === 'published' 
          ? 'Post published successfully!' 
          : 'Post saved as draft'
      )
      
      navigate(`/blog/${newPost.id}`)
    } catch (error) {
      toast.error('Failed to save post')
      console.error(error)
    }
  }

  return <MarkdownEditor onSubmit={handleSubmit} />
}

export default CreatePostPage