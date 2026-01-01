import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MarkdownEditor from '../components/editor/MarkdownEditor'
import { hybridService } from '../api/hybridService' // Changed to hybridService
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import type { BlogPost } from '../api/types'
import { useQueryClient } from '@tanstack/react-query'

const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return
      
      try {
        const foundPost = await hybridService.getPost(id)
        
        if (foundPost) {
           // Security check: only allow author to edit
           if (user && foundPost.authorId !== user.id) {
             toast.error("You don't have permission to edit this post")
             navigate('/')
             return
           }
           setPost(foundPost)
        } else {
          toast.error('Post not found')
          navigate('/profile')
        }
      } catch (error) {
        console.error(error)
        toast.error('Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    if (id && user) {
      fetchPost()
    }
  }, [id, user, navigate])

  const handleSubmit = async (data: any) => {
    if (!user || !id) return

    try {
      // Use hybridService to update
      await hybridService.updateHybridPost(id, {
        ...data,
      })

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['blogPosts'] })
      await queryClient.invalidateQueries({ queryKey: ['blogPost', id] })
      
      toast.success('Post updated successfully!')
      navigate(`/blog/${id}`)
    } catch (error) {
      toast.error('Failed to update post')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!post) return null

  return (
    <MarkdownEditor
      initialTitle={post.title}
      initialContent={post.content}
      initialTags={post.tags}
      initialCategory={post.category}
      isEdit={true}
      onSubmit={handleSubmit}
    />
  )
}

export default EditPostPage