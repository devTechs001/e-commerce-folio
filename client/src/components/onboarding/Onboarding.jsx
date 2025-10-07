import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Palette, 
  Zap, 
  Globe, 
  ArrowRight, 
  Check,
  Rocket,
  Target,
  TrendingUp
} from 'lucide-react'
import Button from '../common/Button/Button'

const steps = [
  {
    id: 1,
    title: 'Welcome to E-Folio',
    description: 'Create stunning portfolio websites in minutes with AI-powered design assistance',
    icon: Rocket,
    color: 'from-blue-500 to-cyan-500',
    features: [
      'Professional templates',
      'AI content generation',
      'Custom domain support'
    ]
  },
  {
    id: 2,
    title: 'Choose Your Template',
    description: 'Select from our curated collection of professional templates designed for your industry',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
    features: [
      'Modern designs',
      'Fully customizable',
      'Mobile responsive'
    ]
  },
  {
    id: 3,
    title: 'AI-Powered Content',
    description: 'Let our AI assistant help you create compelling content that showcases your skills',
    icon: Sparkles,
    color: 'from-orange-500 to-red-500',
    features: [
      'Smart suggestions',
      'SEO optimized',
      'Professional writing'
    ]
  },
  {
    id: 4,
    title: 'Go Live Instantly',
    description: 'Publish your portfolio with a single click and share it with the world',
    icon: Globe,
    color: 'from-green-500 to-teal-500',
    features: [
      'One-click publish',
      'Analytics dashboard',
      'Custom domains'
    ]
  }
]

const Onboarding = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const navigate = useNavigate()

  const goals = [
    { id: 'freelance', label: 'Freelancing', icon: Target },
    { id: 'job', label: 'Job Hunting', icon: TrendingUp },
    { id: 'business', label: 'Business', icon: Rocket }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true')
    if (selectedGoal) {
      localStorage.setItem('user_goal', selectedGoal)
    }
    if (onComplete) {
      onComplete()
    } else {
      navigate('/dashboard/templates')
    }
  }

  const currentStepData = steps[currentStep]
  const Icon = currentStepData.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip tour
            </button>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${currentStepData.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {currentStepData.title}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {currentStepData.description}
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {currentStepData.features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Goal Selection (only on first step) */}
            {currentStep === 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  What's your primary goal?
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {goals.map((goal) => {
                    const GoalIcon = goal.icon
                    return (
                      <button
                        key={goal.id}
                        onClick={() => setSelectedGoal(goal.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedGoal === goal.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <GoalIcon className={`w-6 h-6 mx-auto mb-2 ${
                          selectedGoal === goal.id ? 'text-primary-600' : 'text-gray-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          selectedGoal === goal.id ? 'text-primary-700' : 'text-gray-600'
                        }`}>
                          {goal.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Back
              </button>

              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                variant="primary"
                className="px-8"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    Get Started
                    <Rocket className="ml-2 w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Onboarding
