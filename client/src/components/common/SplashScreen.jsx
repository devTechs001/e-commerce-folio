import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    'Initializing application...',
    'Loading components...',
    'Setting up workspace...',
    'Almost ready...'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2
        
        // Update current step based on progress
        if (newProgress >= 25 && currentStep < 1) setCurrentStep(1)
        else if (newProgress >= 50 && currentStep < 2) setCurrentStep(2)
        else if (newProgress >= 75 && currentStep < 3) setCurrentStep(3)
        
        if (newProgress >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            onComplete?.()
          }, 500)
          return 100
        }
        return newProgress
      })
    }, 50)

    return () => clearInterval(timer)
  }, [currentStep, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-primary-900 to-blue-900 flex items-center justify-center z-50"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-primary-400 to-blue-400 rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-white font-bold text-4xl">E</span>
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            E-Folio
          </h1>
          <p className="text-primary-200 text-lg">
            Professional Portfolio Platform
          </p>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-80 mx-auto"
        >
          {/* Progress Bar */}
          <div className="relative mb-6">
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-400 to-blue-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            
            {/* Progress Percentage */}
            <div className="flex justify-between items-center mt-3">
              <span className="text-primary-200 text-sm">
                {steps[currentStep]}
              </span>
              <span className="text-white font-medium text-sm">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Loading Dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
                className="w-2 h-2 bg-primary-400 rounded-full"
              />
            ))}
          </div>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto"
        >
          {[
            { icon: '🎨', label: 'Templates' },
            { icon: '🤖', label: 'AI Generator' },
            { icon: '📊', label: 'Analytics' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              animate={{
                y: [0, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
                ease: "easeInOut"
              }}
              className="text-center"
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <div className="text-primary-200 text-xs">{feature.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <p className="text-primary-300 text-xs">
            © 2025 devtechs001. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default SplashScreen
