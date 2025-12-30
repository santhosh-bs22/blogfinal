import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  BookOpen, User, LogOut, PlusCircle, Search, 
  Bell, Menu, X, Home, Compass, PenSquare,
  TrendingUp, Users, Sparkles, Zap
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from './ThemeToggle'

const EnhancedHeader: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const navItems = [
    { label: 'Home', icon: <Home className="h-4 w-4" />, path: '/' },
    { label: 'Explore', icon: <Compass className="h-4 w-4" />, path: '/explore' },
    { label: 'Trending', icon: <TrendingUp className="h-4 w-4" />, path: '/trending' },
    { label: 'Community', icon: <Users className="h-4 w-4" />, path: '/community' },
  ]

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-xl border-b shadow-lg'
            : 'bg-gradient-to-b from-background via-background/95 to-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur group-hover:blur-xl transition-all duration-300" />
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-background">
                  <BookOpen className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  BlogSphere
                </span>
                <span className="text-xs text-muted-foreground">Share Your Story</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant={location.pathname === item.path ? "secondary" : "ghost"}
                  className="gap-2"
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  {item.label}
                </Button>
              ))}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  className="gap-2"
                  onClick={() => navigate('/create-post')}
                >
                  <PenSquare className="h-4 w-4" />
                  Write
                </Button>
              )}
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-10 border-2 focus:w-80 transition-all duration-300"
                  />
                </div>
              </form>

              {/* Notifications */}
              {isAuthenticated && (
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
                </Button>
              )}

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Auth Buttons / User Menu */}
              {isAuthenticated ? (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    className="hidden sm:flex gap-2 bg-gradient-to-r from-primary to-purple-600"
                    onClick={() => navigate('/create-post')}
                  >
                    <Sparkles className="h-4 w-4" />
                    New Post
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-9 w-9 border-2 border-primary/20">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user?.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/bookmarks')}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Bookmarks</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="ghost" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate('/register')}
                    className="bg-gradient-to-r from-primary to-purple-600"
                  >
                    Get Started
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    variant={location.pathname === item.path ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3"
                    onClick={() => {
                      navigate(item.path)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                ))}
                {isAuthenticated && (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3"
                      onClick={() => {
                        navigate('/create-post')
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <PenSquare className="h-4 w-4" />
                      Write
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3"
                      onClick={() => {
                        navigate('/profile')
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Button>
                  </>
                )}
                {!isAuthenticated && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        navigate('/login')
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-primary to-purple-600"
                      onClick={() => {
                        navigate('/register')
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

export default EnhancedHeader