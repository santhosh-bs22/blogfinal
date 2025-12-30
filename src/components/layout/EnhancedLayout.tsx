import React from 'react'
import EnhancedHeader from './EnhancedHeader'
import Footer from './Footer'
import ParticlesBackground from '../ui/ParticlesBackground' // Import the particles component

interface EnhancedLayoutProps {
  children: React.ReactNode
}

const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Add the Particles Background here. 
          It acts as a fixed layer behind everything else. */}
      <ParticlesBackground />
      
      <EnhancedHeader />
      
      {/* Added z-10 relative to ensure content stays above particles */}
      <main className="flex-1 relative z-10">
        {children}
      </main>
      
      <Footer />
    </div>
  )
}

export default EnhancedLayout