import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface PageTransitionProps {
  children: React.ReactNode
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 300)
    return () => clearTimeout(timer)
  }, [location.key])

  if (!isAnimating) {
    return <>{children}</>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Alternative simpler version without framer-motion
export const SimplePageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState("fadeIn")

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut")
      
      const timer = setTimeout(() => {
        setTransitionStage("fadeIn")
        setDisplayLocation(location)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [location, displayLocation])

  return (
    <div
      className={`
        transition-opacity duration-300
        ${transitionStage === "fadeOut" ? "opacity-0" : "opacity-100"}
      `}
    >
      {children}
    </div>
  )
}

export default PageTransition