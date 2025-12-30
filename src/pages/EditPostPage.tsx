import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MarkdownEditor from '../components/editor/MarkdownEditor'
import { postsApi } from '../api/posts'
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import type { BlogPost } from '../api/types'

const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // In a real app, fetch from API
        // For now, we'll use mock data
        const mockPost: BlogPost = {
          id: id || '',
          title: 'Sample Post',
          content: '# Sample Content\n\nThis is a sample post.',
          excerpt: 'Sample excerpt for the post',
          authorId: user?.id || '',
          author: {
            id: user?.id || '',
            name: user?.name || '',
            avatar: user?.avatar || '',
            bio: user?.bio || '',
            role: user?.role || 'user',
          },
          category: 'React',
          tags: ['react', 'typescript'],
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          readTime: 5,
          likes: 0,
          bookmarks: 0,
          views: 0,
          status: 'published',
        }
        setPost(mockPost)
      } catch (error) {
        toast.error('Failed to load post')
        navigate('/profile')
      } finally {
        setLoading(false)
      }
    }

    if (id && user) {
      fetchPost()
    }
  }, [id, user, navigate])

  const handleSubmit = async (data: {
    title: string
    content: string
    excerpt: string
    tags: string[]
    category: string
    featuredImage?: string
    status: 'draft' | 'published'
  }) => {
    if (!user || !id) return

    try {
      await postsApi.updatePost(id, {
        ...data,
        authorId: user.id,
        author: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          bio: user.bio || '',
          role: user.role,
        },
      })
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

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Post not found</h2>
          <p className="text-muted-foreground">The post you're trying to edit doesn't exist.</p>
        </div>
      </div>
    )
  }

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