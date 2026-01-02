import React from 'react'
import { BookOpen, Github, Twitter } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="border-t mt-10 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Blogora AI</span>
          </div>
          </div>
      </div>
    </footer>
  )
}
export default Footer