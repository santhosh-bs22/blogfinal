import React, { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Label } from '../ui/Label'
import { Badge } from '../ui/Badge'
import { 
  Eye, EyeOff, Save, Send, Tag, X, 
  Calendar, Clock, Image as ImageIcon 
} from 'lucide-react'
interface MarkdownEditorProps {
  initialTitle?: string
  initialContent?: string
  initialTags?: string[]
  initialCategory?: string
  isEdit?: boolean
  onSubmit: (data: {
    title: string
    content: string
    excerpt: string
    tags: string[]
    category: string
    featuredImage?: string
    status: 'draft' | 'published'
  }) => Promise<void>
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialTitle = '',
  initialContent = '',
  initialTags = [],
  initialCategory = 'React',
  isEdit = false,
  onSubmit,
}) => {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [tags, setTags] = useState<string[]>(initialTags)
  const [tagInput, setTagInput] = useState('')
  const [category, setCategory] = useState(initialCategory)
  const [featuredImage, setFeaturedImage] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [isPreview, setIsPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = ['React', 'TypeScript', 'JavaScript', 'Tailwind', 'Backend', 'DevOps', 'General']

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in title and content')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        title,
        content,
        excerpt: content.substring(0, 150) + '...',
        tags,
        category,
        featuredImage: featuredImage || undefined,
        status,
      })
    } catch (error) {
      console.error('Failed to save post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          {isEdit ? 'Edit Post' : 'Create New Post'}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Edit
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Post Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title..."
                    className="text-lg font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  {isPreview ? (
                    <div className="prose prose-lg max-w-none p-4 border rounded-md">
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                  ) : (
                    <div data-color-mode="light">
                      <MDEditor
                        value={content}
                        onChange={(value) => setContent(value || '')}
                        height={400}
                        preview="edit"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featured-image">Featured Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="featured-image"
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                    <Button variant="outline" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  {featuredImage && (
                    <div className="mt-2">
                      <img
                        src={featuredImage}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Add a tag..."
                    />
                    <Button onClick={handleAddTag} variant="outline">
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={status === 'draft' ? 'default' : 'outline'}
                      onClick={() => setStatus('draft')}
                      className="flex-1"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>
                    <Button
                      type="button"
                      variant={status === 'published' ? 'default' : 'outline'}
                      onClick={() => setStatus('published')}
                      className="flex-1"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Publish
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Scheduled for: Now</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Read time: {Math.ceil(content.length / 1000)} min</span>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Preview</h3>
              <div className="space-y-4">
                {featuredImage && (
                  <img
                    src={featuredImage}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-md"
                  />
                )}
                <h4 className="font-semibold line-clamp-2">{title || 'Post Title'}</h4>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {content.substring(0, 100) || 'Post content will appear here...'}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{category}</span>
                  <span>{Math.ceil(content.length / 1000)} min read</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MarkdownEditor