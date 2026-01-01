import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, Lock, User, Eye, EyeOff, Github, ArrowRight,
  Sparkles, Key, Shield, CheckCircle2, Globe 
} from 'lucide-react'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { Separator } from '../ui/Separator'

interface AnimatedAuthCardProps {
  type: 'login' | 'register'
  onSubmit: (data: any) => Promise<void>
  isLoading: boolean
  toggleType: () => void
}

const AnimatedAuthCard: React.FC<AnimatedAuthCardProps> = ({
  type,
  onSubmit,
  isLoading,
  toggleType,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isLogin = type === 'login'

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 lg:p-0 bg-background overflow-hidden relative">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 z-10">
        
        {/* Left Side - Visuals (Hidden on Mobile) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col justify-center p-12 space-y-8"
        >
          <div className="relative">
             <div className="absolute -left-4 -top-4 w-12 h-12 bg-primary/20 rounded-full blur-xl" />
             <Globe className="h-12 w-12 text-primary relative z-10" />
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight leading-tight">
            Share your story <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
              with the world.
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-md">
            Join a community of writers and thinkers. Create, share, and grow with our modern blogging platform.
          </p>

          <div className="flex gap-4 pt-4">
             <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold">
                   {String.fromCharCode(64+i)}
                 </div>
               ))}
             </div>
             <div className="flex flex-col justify-center">
               <span className="font-bold">10k+</span>
               <span className="text-xs text-muted-foreground">Active Writers</span>
             </div>
          </div>
        </motion.div>

        {/* Right Side - Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center lg:justify-start"
        >
          <Card className="w-full max-w-md border-border/50 shadow-2xl backdrop-blur-xl bg-card/50">
            <CardContent className="p-8">
              <div className="mb-8 text-center lg:text-left">
                <h2 className="text-2xl font-bold">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {isLogin ? 'Enter your details to access your account' : 'Start your 30-day free trial today'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence mode="popLayout">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label>Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="John Doe" 
                          className="pl-10 bg-background/50"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          required={!isLogin}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="email" 
                      placeholder="name@example.com" 
                      className="pl-10 bg-background/50"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="pl-10 bg-background/50 pr-10"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="popLayout">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label>Confirm Password</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10 bg-background/50"
                          value={formData.confirmPassword}
                          onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                          required={!isLogin}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                       <Sparkles className="h-4 w-4 animate-spin" /> Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground uppercase">Or continue with</span>
                <Separator className="flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-11 bg-background/50 hover:bg-background">
                  <Github className="mr-2 h-4 w-4" /> Github
                </Button>
                <Button variant="outline" className="h-11 bg-background/50 hover:bg-background">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg> 
                  Google
                </Button>
              </div>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </span>
                <button 
                  onClick={toggleType}
                  className="ml-2 font-semibold text-primary hover:underline"
                >
                  {isLogin ? "Sign up now" : "Log in"}
                </button>
              </div>

            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default AnimatedAuthCard