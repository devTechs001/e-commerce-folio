import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Minimize2, Maximize2, Paperclip, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { socketService } from '../../services/socket'
import uploadService from '../../services/upload'
import toast from 'react-hot-toast'

const LiveChatWidget = () => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isAgentOnline, setIsAgentOnline] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          type: 'agent',
          content: 'Hello! 👋 How can I help you today?',
          timestamp: new Date(),
          sender: 'Support Agent'
        }
      ])
    }

    // Socket listeners for live chat
    socketService.on('support_message', handleSupportMessage)
    socketService.on('support_typing', handleSupportTyping)
    socketService.on('agent_status', (status) => setIsAgentOnline(status.online))

    return () => {
      socketService.off('support_message')
      socketService.off('support_typing')
      socketService.off('agent_status')
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!isOpen && unreadCount > 0) {
      // Show notification
      toast('New message from support!', {
        icon: '💬',
        duration: 3000
      })
    }
  }, [unreadCount, isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSupportMessage = (message) => {
    setMessages(prev => [...prev, message])
    if (!isOpen) {
      setUnreadCount(prev => prev + 1)
    }
    setIsTyping(false)
  }

  const handleSupportTyping = (data) => {
    setIsTyping(data.isTyping)
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now(),
      type: 'user',
      content: newMessage,
      timestamp: new Date(),
      sender: user?.name || 'You'
    }

    setMessages(prev => [...prev, message])
    socketService.emit('support_message', {
      userId: user?.id,
      message: newMessage
    })

    setNewMessage('')

    // Simulate agent response (replace with real backend)
    setTimeout(() => {
      const autoResponses = [
        "Thank you for your message! Our team is reviewing it and will respond shortly.",
        "I understand your concern. Let me check that for you.",
        "Great question! Let me get you the information you need.",
        "I'm here to help! Could you provide more details?"
      ]
      
      const response = {
        id: Date.now() + 1,
        type: 'agent',
        content: autoResponses[Math.floor(Math.random() * autoResponses.length)],
        timestamp: new Date(),
        sender: 'Support Agent'
      }
      
      setMessages(prev => [...prev, response])
    }, 2000)
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      let uploadedFile = file
      
      if (file.type.startsWith('image/')) {
        uploadedFile = await uploadService.compressImage(file)
      }
      
      const result = await uploadService.uploadImage(uploadedFile)
      
      const message = {
        id: Date.now(),
        type: 'user',
        content: 'Shared a file',
        timestamp: new Date(),
        sender: user?.name || 'You',
        attachment: {
          url: result.url,
          name: file.name,
          type: file.type
        }
      }
      
      setMessages(prev => [...prev, message])
      socketService.emit('support_message', {
        userId: user?.id,
        message: 'Shared a file',
        attachment: message.attachment
      })
      
      toast.success('File uploaded!')
    } catch (error) {
      toast.error('Failed to upload file')
    }
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setUnreadCount(0)
      setIsMinimized(false)
    }
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
        >
          <MessageCircle className="w-7 h-7" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-[600px]'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                {isAgentOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold">Support Chat</h3>
                <p className="text-xs text-white/80">
                  {isAgentOnline ? 'We\'re online' : 'We\'ll respond soon'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleOpen}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.type === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      {message.type === 'agent' && (
                        <p className="text-xs font-semibold mb-1 opacity-70">
                          {message.sender}
                        </p>
                      )}
                      <p className="text-sm">{message.content}</p>
                      
                      {message.attachment && (
                        <div className="mt-2 p-2 bg-black/10 rounded-lg flex items-center space-x-2">
                          <Paperclip className="w-4 h-4" />
                          <span className="text-xs truncate">{message.attachment.name}</span>
                        </div>
                      )}
                      
                      <p
                        className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex items-center space-x-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default LiveChatWidget
