import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AuthorInfo from '@/components/blog/AuthorInfo'
import LikeBookmark from '@/components/blog/LikeBookmark'
import CommentsSection from '@/components/blog/CommentsSection'
import { useBlogPost } from '@/hooks/useBlogPosts'

const BlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: post, isLoading, error } = useBlogPost(id!)

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
          The blog post you're looking for doesn't exist.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all posts
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {post.category}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {post.title}
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          {post.excerpt}
        </p>
      </header>

      {post.featuredImage && (
        <div className="mb-8">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mb-12">
        <AuthorInfo
          author={post.author}
          publishedAt={post.publishedAt}
          readTime={post.readTime}
        />
      </div>

      <div className="mb-12">
        <LikeBookmark
          initialLikes={post.likes}
          initialBookmarks={post.bookmarks}
        />
      </div>

      <div className="mb-12">
        <CommentsSection postId={post.id} />
      </div>
    </article>
  )
}

export default BlogPage