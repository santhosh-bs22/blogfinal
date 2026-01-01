import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Label } from '../components/ui/Label'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs'
import { Badge } from '../components/ui/Badge'
import { Separator } from '../components/ui/Separator'
import { 
  User, Mail, Calendar, FileText, Heart, Eye,
  Edit2, Save, X, Upload, BarChart2, Zap, LogOut, PenTool 
} from 'lucide-react'
import BlogCard from '../components/blog/BlogCard'
import { toast } from 'sonner'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { motion, AnimatePresence } from 'framer-motion'

const ProfilePage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  })
  
  const { data: allPosts, isLoading } = useBlogPosts(undefined, undefined)

  // Filter posts
  const myPosts = allPosts?.filter(post => post.authorId === user?.id) || []
  const publishedPosts = myPosts.filter(p => (p as any).status !== 'draft')
  const draftPosts = myPosts.filter(p => (p as any).status === 'draft')

  const stats = {
    totalPosts: myPosts.length,
    totalLikes: myPosts.reduce((acc, post) => acc + (post.likes || 0), 0),
    totalViews: myPosts.reduce((acc, post) => acc + (post.views || 0), 0),
    drafts: draftPosts.length
  }

  const handleSave = async () => {
    try {
      await updateProfile(editedUser)
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedUser(prev => ({ ...prev, avatar: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  if (isLoading) return <div className="h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. Hero Banner Section */}
      <div className="relative h-64 w-full bg-gradient-to-r from-primary/80 via-purple-500/80 to-pink-500/80 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
           <Zap className="w-96 h-96 text-white rotate-12" />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 2. Profile Sidebar Card */}
          <div className="lg:col-span-4">
            <Card className="shadow-2xl border-none bg-card/95 backdrop-blur-sm overflow-hidden">
              <CardContent className="pt-8 pb-8 px-6 flex flex-col items-center">
                
                {/* Avatar Section */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                  <Avatar className="h-32 w-32 ring-4 ring-background relative">
                    <AvatarImage src={isEditing ? editedUser.avatar : user?.avatar} className="object-cover" />
                    <AvatarFallback className="bg-muted text-4xl">
                      {user?.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 shadow-lg transform transition-transform hover:scale-105">
                      <Upload className="h-4 w-4" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>

                {/* User Info / Edit Form */}
                <div className="mt-6 w-full space-y-4 text-center">
                  {isEditing ? (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="space-y-1 text-left">
                        <Label className="text-xs text-muted-foreground">Display Name</Label>
                        <Input 
                          value={editedUser.name} 
                          onChange={(e) => setEditedUser(p => ({ ...p, name: e.target.value }))}
                          className="text-center font-semibold"
                        />
                      </div>
                      <div className="space-y-1 text-left">
                        <Label className="text-xs text-muted-foreground">Bio</Label>
                        <Textarea 
                          value={editedUser.bio} 
                          onChange={(e) => setEditedUser(p => ({ ...p, bio: e.target.value }))}
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button onClick={handleSave} className="flex-1" size="sm">
                          <Save className="w-4 h-4 mr-2" /> Save
                        </Button>
                        <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight flex items-center justify-center gap-2">
                          {user?.name}
                          {user?.role === 'admin' && <Badge variant="secondary" className="text-xs">PRO</Badge>}
                        </h2>
                        <p className="text-muted-foreground flex items-center justify-center gap-1.5 mt-1 text-sm">
                          <Mail className="w-3.5 h-3.5" /> {user?.email}
                        </p>
                      </div>

                      <p className="text-sm text-foreground/80 leading-relaxed px-2">
                        {user?.bio || "No bio added yet. Tell the world who you are!"}
                      </p>

                      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-4 border-t w-full">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Joined {new Date(user?.createdAt || '').toLocaleDateString()}
                        </span>
                      </div>

                      <div className="pt-4 flex flex-col gap-2 w-full">
                        <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full justify-between group">
                          Edit Profile <Edit2 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Button>
                        <Button onClick={logout} variant="ghost" className="w-full justify-between text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                          Sign Out <LogOut className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mini Stats Card (Mobile only, or extra info) */}
            <div className="mt-6 grid grid-cols-2 gap-4">
               <Card className="bg-primary/5 border-primary/10">
                 <CardContent className="p-4 text-center">
                   <div className="text-3xl font-bold text-primary">{stats.totalPosts}</div>
                   <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Stories</div>
                 </CardContent>
               </Card>
               <Card className="bg-primary/5 border-primary/10">
                 <CardContent className="p-4 text-center">
                   <div className="text-3xl font-bold text-primary">{stats.totalLikes}</div>
                   <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Likes</div>
                 </CardContent>
               </Card>
            </div>
          </div>

          {/* 3. Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Horizontal Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div whileHover={{ y: -5 }} className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                   <h3 className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</h3>
                 </div>
                 <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                   <Eye className="w-5 h-5" />
                 </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                   <h3 className="text-2xl font-bold">{stats.drafts}</h3>
                 </div>
                 <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400">
                   <FileText className="w-5 h-5" />
                 </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between cursor-pointer group" onClick={() => window.location.href='/create-post'}>
                 <div>
                   <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">Create New</p>
                   <h3 className="text-lg font-bold text-primary">Write Story &rarr;</h3>
                 </div>
                 <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                   <PenTool className="w-5 h-5" />
                 </div>
              </motion.div>
            </div>

            {/* Tabs & Content */}
            <Tabs defaultValue="published" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="bg-muted/50 p-1">
                  <TabsTrigger value="published" className="px-6">Published</TabsTrigger>
                  <TabsTrigger value="drafts" className="px-6">Drafts</TabsTrigger>
                  <TabsTrigger value="likes" className="px-6">Liked</TabsTrigger>
                </TabsList>
              </div>

              <AnimatePresence mode="wait">
                <TabsContent value="published" className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {publishedPosts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {publishedPosts.map((post, idx) => (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <BlogCard post={post} manageMode={true} />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState 
                        icon={<BarChart2 className="w-12 h-12 text-muted-foreground/50" />}
                        title="No published stories"
                        description="Your published work will appear here for the world to see."
                        actionLabel="Write your first story"
                        actionLink="/create-post"
                      />
                    )}
                  </motion.div>
                </TabsContent>

                <TabsContent value="drafts">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                  >
                     {draftPosts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {draftPosts.map(post => (
                          <BlogCard key={post.id} post={post} manageMode={true} />
                        ))}
                      </div>
                    ) : (
                      <EmptyState 
                        icon={<FileText className="w-12 h-12 text-muted-foreground/50" />}
                        title="No drafts yet"
                        description="Capture your ideas before they fly away."
                        actionLabel="Start a draft"
                        actionLink="/create-post"
                      />
                    )}
                  </motion.div>
                </TabsContent>

                <TabsContent value="likes">
                   <EmptyState 
                      icon={<Heart className="w-12 h-12 text-muted-foreground/50" />}
                      title="No liked posts"
                      description="Stories you like will appear here."
                    />
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Component for Empty States
const EmptyState = ({ icon, title, description, actionLabel, actionLink }: any) => (
  <Card className="border-dashed bg-muted/30">
    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-background p-4 rounded-full shadow-sm mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && (
        <Button asChild>
          <a href={actionLink}>{actionLabel}</a>
        </Button>
      )}
    </CardContent>
  </Card>
)

export default ProfilePage