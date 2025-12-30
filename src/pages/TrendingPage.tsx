import React from 'react'
import { TrendingUp, Flame, Zap, Rocket } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const TrendingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 mb-4">
          <Flame className="h-8 w-8 text-orange-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Trending Now
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover what the community is talking about right now
        </p>
      </div>
      
      <Card className="mb-8">
        <CardContent className="p-8 text-center">
          <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Trending Page</h2>
          <p className="text-muted-foreground mb-4">
            This page will show trending articles based on views, likes, and comments
          </p>
          <Button className="gap-2">
            <Zap className="h-4 w-4" />
            Coming Soon
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default TrendingPage