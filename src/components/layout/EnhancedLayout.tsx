import React from 'react'
import EnhancedHeader from './EnhancedHeader'
import Footer from './Footer'

interface EnhancedLayoutProps {
  children: React.ReactNode
}

const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default EnhancedLayout