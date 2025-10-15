import React, { useState, useRef, useEffect } from 'react'
import { 
  MessageCircle, Send, X, Minimize2, Maximize2, Sparkles,
  Bot, User, Crown, Zap, AlertCircle, CheckCircle, Loader
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { subscriptionService } from '../../../services/subscription'
import Button from '../Button/Button'

const AIAssistantChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [userTier, setUserTier] = useState('free')
  const [messageCount, setMessageCount] = useState(0)
  const messagesEndRef = useRef(null)

  // Check user subscription tier
  useEffect(() => {
    const checkTier = async () => {
      const tier = await subscriptionService.getUserTier()
      setUserTier(tier)
    }
    checkTier()
  }, [])

  // Premium check
  const isPremiumUser = userTier === 'premium' || userTier === 'professional' || userTier === 'enterprise'
  const messageLimit = isPremiumUser ? Infinity : 10 // Free users: 10 messages, Premium: unlimited

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim()) return

    // Check message limit
    if (messageCount >= messageLimit) {
      alert('You\'ve reached your message limit. Upgrade to Premium for unlimited messages!')
      return
    }

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setMessageCount(prev => prev + 1)

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.text)
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date()
      }])
      setLoading(false)
    }, 1500)
  }

  const generateAIResponse = (question) => {
    // Mock AI responses based on question keywords
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes('portfolio')) {
      return 'I can help you create and customize your portfolio! You can use our AI Portfolio Builder to generate content, or manually customize your portfolio with our advanced editor. Would you like me to guide you through the process?'
    }
    
    if (lowerQuestion.includes('template')) {
      return 'We have a wide variety of templates available! Professional users get access to all premium templates. Would you like to browse our template gallery or create a custom template?'
    }

    if (lowerQuestion.includes('price') || lowerQuestion.includes('cost') || lowerQuestion.includes('premium')) {
      return 'We offer several pricing plans:\n\n- **Free**: $0/month - 1 portfolio, basic features\n- **Professional**: $19/month - 5 portfolios, premium features\n- **Enterprise**: $49/month - Unlimited portfolios, all features\n\nUpgrade anytime from your billing settings!'
    }

    if (lowerQuestion.includes('upload') || lowerQuestion.includes('image')) {
      return 'You can upload images to your portfolio using our image editor. Premium users get advanced editing features including filters, cropping, and adjustments. The maximum file size is 10MB for free users and 50MB for premium users.'
    }

    if (lowerQuestion.includes('help') || lowerQuestion.includes('support')) {
      return 'I\'m here to help! You can also:\n\n- Check our Help Center for FAQs\n- Contact support via live chat (Mon-Fri, 9AM-6PM EST)\n- Email us at support@example.com\n- Premium users get priority support!\n\nWhat specific issue can I help you with?'
    }

    if (lowerQuestion.includes('analytics')) {
      return 'Our analytics dashboard provides insights into your portfolio performance. You can track:\n\n- Visitor statistics\n- Traffic sources\n- Engagement metrics\n- Revenue (Premium)\n- Conversion rates (Premium)\n\nPremium users get advanced analytics with real-time data!'
    }

    // Default response
    return 'That\'s a great question! Let me help you with that. For specific assistance, you can:\n\n1. Browse our Help Center\n2. Check the documentation\n3. Contact our support team\n\nIs there anything specific you\'d like to know more about?'
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickActions = [
    { text: 'Create Portfolio', icon: Sparkles },
    { text: 'Browse Templates', icon: Zap },
    { text: 'Upload Image', icon: Crown },
    { text: 'View Analytics', icon: CheckCircle }
  ]

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-primary-600 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '60px' : '600px' 
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: '600px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">AI Assistant</h3>
                  <p className="text-xs text-primary-100">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Message Limit Banner */}
                {!isPremiumUser && (
                  <div className="bg-yellow-50 border-b border-yellow-100 p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-yellow-800">
                      <AlertCircle className="h-4 w-4" />
                      <span>{messageLimit - messageCount} messages remaining</span>
                    </div>
                    <button
                      onClick={() => window.location.href = '/pricing'}
                      className="text-xs text-yellow-800 hover:text-yellow-900 font-medium underline"
                    >
                      Upgrade
                    </button>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${
                        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'ai' 
                            ? 'bg-gradient-to-br from-primary-500 to-blue-500' 
                            : 'bg-gray-300'
                        }`}>
                          {message.sender === 'ai' ? (
                            <Bot className="h-5 w-5 text-white" />
                          ) : (
                            <User className="h-5 w-5 text-gray-600" />
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div className={`rounded-2xl px-4 py-2 ${
                          message.sender === 'ai'
                            ? 'bg-white shadow-sm border border-gray-200'
                            : 'bg-gradient-to-r from-primary-600 to-blue-600 text-white'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          <span className={`text-xs mt-1 block ${
                            message.sender === 'ai' ? 'text-gray-500' : 'text-primary-100'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="flex items-center space-x-2 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                        <Loader className="h-4 w-4 animate-spin text-primary-600" />
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div className="border-t border-gray-200 p-3 bg-white">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon
                      return (
                        <button
                          key={index}
                          onClick={() => setInput(action.text)}
                          className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <Icon className="h-3 w-3" />
                          <span>{action.text}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 p-4 bg-white">
                  <div className="flex items-end space-x-2">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      rows="2"
                      disabled={messageCount >= messageLimit}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || loading || messageCount >= messageLimit}
                      className="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-3 rounded-lg hover:from-primary-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                  {messageCount >= messageLimit && (
                    <p className="text-xs text-red-600 mt-2">
                      Message limit reached. <a href="/pricing" className="underline font-medium">Upgrade to Premium</a> for unlimited messages.
                    </p>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIAssistantChat
