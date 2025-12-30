import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Label } from '../components/ui/Label'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs'
import { Badge } from '../components/ui/Badge'
import { 
  User, Mail, Calendar, FileText, Heart, MessageSquare, 
  Edit, Save, X, Upload, BarChart, TrendingUp 
} from 'lucide-react'
import BlogCard from '../components/blog/BlogCard'
import { toast } from 'sonner'

const ProfilePage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  })
  const { data: userPosts } = useBlogPosts(undefined, undefined)

  // Filter posts by current user
  const myPosts = userPosts?.filter(post => post.authorId === user?.id) || []

  const handleSave = async () => {
    try {
      await updateProfile(editedUser)
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
    })
    setIsEditing(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedUser(prev => ({
          ...prev,
          avatar: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const stats = {
    totalPosts: myPosts.length,
    totalLikes: myPosts.reduce((acc, post) => acc + post.likes, 0),
    totalViews: myPosts.reduce((acc, post) => acc + (post as any).views || 0, 0),
    totalComments: myPosts.reduce((acc, post) => acc + (post as any).comments || 0, 0),
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="relative inline-block">
                <Avatar className="h-32 w-32 mx-auto">
                  <AvatarImage src={isEditing ? editedUser.avatar : user?.avatar} />
                  <AvatarFallback>
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                    <Upload className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              <CardTitle className="mt-4">
                {isEditing ? (
                  <Input
                    value={editedUser.name}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                    className="text-center text-xl"
                  />
                ) : (
                  user?.name
                )}
              </CardTitle>
              <CardDescription className="flex items-center justify-center gap-1">
                <Mail className="h-4 w-4" />
                {user?.email}
              </CardDescription>
              {user?.role === 'admin' && (
                <Badge className="w-fit mx-auto">Admin</Badge>
              )}
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Bio</Label>
                  {isEditing ? (
                    <Textarea
                      value={editedUser.bio}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      {user?.bio || 'No bio yet.'}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(user?.createdAt || '').toLocaleDateString()}</span>
                </div>

                {isEditing ? (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Posts</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalPosts}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">Likes</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalLikes}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Views</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalViews}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Comments</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalComments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" onClick={logout} className="w-full">
            Logout
          </Button>
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="posts">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts">My Posts</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Published Posts ({myPosts.length})</h3>
                <Button asChild>
                  <a href="/create-post">Create New Post</a>
                </Button>
              </div>
              
              {myPosts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {myPosts.map(post => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start sharing your thoughts with the community!
                    </p>
                    <Button asChild>
                      <a href="/create-post">Create your first post</a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="drafts">
              <Card>
                <CardContent className="py-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No drafts</h3>
                  <p className="text-muted-foreground">
                    Your unpublished posts will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardContent className="py-8 text-center">
                  <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Activity Feed</h3>
                  <p className="text-muted-foreground">
                    Your recent activity will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage