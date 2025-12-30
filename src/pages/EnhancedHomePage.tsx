import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, Filter, TrendingUp, Clock, BookOpen, 
  Sparkles, Users, Rocket, Star, Zap, 
  ArrowRight, Flame, User
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar'
import BlogCard from '../components/blog/BlogCard'
import { useQuery } from '@tanstack/react-query'
import { hybridService } from '../api/hybridService'
import { formatDistanceToNow } from 'date-fns'

const EnhancedHomePage: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [trendingPosts, setTrendingPosts] = useState<any[]>([])

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['hybridPosts'],
    queryFn: () => hybridService.getHybridPosts(),
  })

  useEffect(() => {
    if (posts.length > 0) {
      const trending = [...posts]
        .filter(post => post && post.views && post.likes)
        .sort((a, b) => (b.views * 2 + b.likes) - (a.views * 2 + a.likes))
        .slice(0, 5)
      setTrendingPosts(trending)
    }
  }, [posts])

  const categories = [
    { id: 'all', label: 'All', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'React', label: 'React', icon: <Zap className="h-4 w-4" /> },
    { id: 'TypeScript', label: 'TypeScript', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'JavaScript', label: 'JavaScript', icon: <Rocket className="h-4 w-4" /> },
    { id: 'Tailwind', label: 'Tailwind', icon: <Flame className="h-4 w-4" /> },
    { id: 'Backend', label: 'Backend', icon: <TrendingUp className="h-4 w-4" /> },
  ]

  const filteredPosts = posts.filter(post => {
    if (!post) return false
    
    const matchesSearch = searchQuery === '' || 
      (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    
    const matchesCategory = selectedCategory === 'all' || 
      (post.category && post.category === selectedCategory)
    
    return matchesSearch && matchesCategory
  })

  const featuredPosts = posts
    .filter(post => post && post.isFeatured)
    .slice(0, 3)

  // Helper function to safely get post data
  const getPostData = (post: any) => ({
    id: post?.id || 'unknown',
    title: post?.title || 'Untitled',
    excerpt: post?.excerpt || 'No description available',
    category: post?.category || 'General',
    author: {
      name: post?.author?.name || 'Unknown Author',
      avatar: post?.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous`,
      id: post?.author?.id || 'unknown'
    },
    featuredImage: post?.featuredImage || `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80&auto=format&fit=crop`,
    publishedAt: post?.publishedAt || new Date().toISOString(),
    views: post?.views || 0,
    likes: post?.likes || 0,
    tags: post?.tags || [],
    readTime: post?.readTime || 5,
    status: post?.status || 'published',
    isFeatured: post?.isFeatured || false
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container relative mx-auto px-4 text-center">
          <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600">
            <Sparkles className="mr-2 h-4 w-4" />
            Welcome to BlogSphere
          </Badge>
          
          <h1 className="mb-6 text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Discover Amazing
            </span>
            <br />
            <span className="text-foreground">Tech Stories & Insights</span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            Join our community of developers sharing knowledge, insights, and stories 
            about modern web technologies and beyond.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:shadow-xl"
              onClick={() => navigate('/create-post')}
            >
              <Rocket className="h-5 w-5" />
              Start Writing
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 border-2"
              onClick={() => navigate('/trending')}
            >
              <BookOpen className="h-5 w-5" />
              Explore Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="container mx-auto px-4 py-8 -mt-8 relative z-10">
        <Card className="backdrop-blur-xl bg-background/80 border-2 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-96">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search articles, tags, or authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-lg border-2"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={selectedCategory === cat.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.id)}
                      className="gap-2"
                    >
                      {cat.icon}
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Star className="h-7 w-7 text-yellow-500 fill-yellow-500" />
                Featured Stories
              </h2>
              <p className="text-muted-foreground">Handpicked articles worth reading</p>
            </div>
            <Button variant="ghost" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => {
              const safePost = getPostData(post)
              return (
                <Card 
                  key={safePost.id} 
                  className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2"
                >
                  <CardHeader className="p-0">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={safePost.featuredImage}
                        alt={safePost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80&auto=format&fit=crop'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge className="absolute top-4 left-4 bg-primary/90">
                        Featured
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={safePost.author.avatar} />
                        <AvatarFallback>
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{safePost.author.name}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(safePost.publishedAt), { addSuffix: true })}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {safePost.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {safePost.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{safePost.category}</Badge>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {safePost.views.toLocaleString()} views
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button className="w-full" onClick={() => navigate(`/blog/${safePost.id}`)}>
                      Read Story
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="recent" className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-3">
              <TabsTrigger value="recent" className="gap-2">
                <Clock className="h-4 w-4" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="trending" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="popular" className="gap-2">
                <Users className="h-4 w-4" />
                Popular
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{filteredPosts.length} articles found</span>
            </div>
          </div>

          <TabsContent value="recent" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-48 bg-muted rounded-lg mb-4" />
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded mb-2 w-3/4" />
                      <div className="h-4 bg-muted rounded mb-4 w-1/2" />
                      <div className="h-8 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post) => {
                  const safePost = getPostData(post)
                  return <BlogCard key={safePost.id} post={safePost} />
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trendingPosts.map((post, index) => {
                const safePost = getPostData(post)
                return (
                  <Card key={safePost.id} className="group hover:shadow-xl transition-all">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 relative">
                        <img
                          src={safePost.featuredImage}
                          alt={safePost.title}
                          className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80'
                          }}
                        />
                        <Badge className="absolute top-3 left-3">
                          #{index + 1} Trending
                        </Badge>
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={safePost.author.avatar} />
                            <AvatarFallback>
                              <User className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{safePost.author.name}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">
                          {safePost.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-3 mb-4">
                          {safePost.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{safePost.category}</Badge>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              {safePost.views.toLocaleString()}
                            </span>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => navigate(`/blog/${safePost.id}`)}
                            >
                              Read
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="popular">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts
                .filter(post => post && post.likes !== undefined)
                .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                .slice(0, 9)
                .map((post) => {
                  const safePost = getPostData(post)
                  return <BlogCard key={safePost.id} post={safePost} />
                })
              }
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-0">
          <CardContent className="p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {posts.filter(p => p).length}+
                </div>
                <p className="text-muted-foreground">Articles Published</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {posts.reduce((acc, post) => acc + (post?.views || 0), 0).toLocaleString()}+
                </div>
                <p className="text-muted-foreground">Total Views</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {posts.reduce((acc, post) => acc + (post?.likes || 0), 0).toLocaleString()}+
                </div>
                <p className="text-muted-foreground">Likes Received</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  50+
                </div>
                <p className="text-muted-foreground">Active Writers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default EnhancedHomePage