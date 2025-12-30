import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Clock, Tag } from 'lucide-react'
import LoadingSpinner from '../ui/LoadingSpinner'
import AuthorInfo from './AuthorInfo'
import LikeBookmark from './LikeBookmark'
import CommentsSection from './CommentsSection'
import { Badge } from '../ui/Badge'
import { useBlogPost } from '../../hooks/useBlogPosts'
import { formatDate } from '../../utils/formatDate'

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: post, isLoading, error } = useBlogPost(id || '')

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <p className="text-muted-foreground mb-6">
          The blog post you're looking for doesn't exist or may have been removed.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all posts
        </Link>
      </div>
    )
  }

  return (
    <article className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all posts</span>
          </Link>

          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                {post.category}
              </Badge>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime} min read</span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-auto max-h-[500px] object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80'
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <div className="whitespace-pre-line leading-relaxed text-lg">
              {post.content.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-12 p-6 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="px-3 py-1 text-sm"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Author Info */}
          <div className="mb-12">
            <AuthorInfo
              author={post.author}
              publishedAt={post.publishedAt}
              readTime={post.readTime}
            />
          </div>

          {/* Like and Bookmark */}
          <div className="mb-12 p-6 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-2">Enjoyed this article?</h3>
                <p className="text-muted-foreground">
                  Show your appreciation by liking or bookmarking it!
                </p>
              </div>
              <LikeBookmark
                initialLikes={post.likes}
                initialBookmarks={post.bookmarks}
              />
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-12">
            <CommentsSection postId={post.id} />
          </div>

          {/* Navigation */}
          <div className="border-t pt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>View all articles</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogDetail