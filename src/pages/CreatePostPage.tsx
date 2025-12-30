import React from 'react'
import MarkdownEditor from '../components/editor/MarkdownEditor'
import { useNavigate } from 'react-router-dom'
import { postsApi } from '../api/posts'
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query' // Add this import

const CreatePostPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient() // Initialize query client

  const handleSubmit = async (data: any) => {
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
      
      // Invalidate the cache so the list updates immediately
      await queryClient.invalidateQueries({ queryKey: ['blogPosts'] })
      
      toast.success(
        data.status === 'published' 
          ? 'Post published successfully!' 
          : 'Post saved as draft'
      )
      
      // Navigate to the blog list page to see the new post
      navigate('/blog') 
    } catch (error) {
      toast.error('Failed to save post')
      console.error(error)
    }
  }

  return <MarkdownEditor onSubmit={handleSubmit} />
}

export default CreatePostPage