import React, { useState, useEffect, useRef } from 'react'
import { Send, Paperclip, Smile, MoreVertical, Search } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import { socketService } from '../../../services/socket'
import toast from 'react-hot-toast'

const RealTimeChat = ({ portfolioId }) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [typing, setTyping] = useState([])
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    // Join chat room
    if (portfolioId) {
      socketService.emit('join_chat', { portfolioId })
    }

    // Listen for messages
    socketService.on('chat_message', (message) => {
      setMessages(prev => [...prev, message])
      scrollToBottom()
    })

    // Listen for typing indicators
    socketService.on('user_typing', ({ userId, userName }) => {
      if (userId !== user.id) {
        setTyping(prev => [...new Set([...prev, userName])])
        setTimeout(() => {
          setTyping(prev => prev.filter(name => name !== userName))
        }, 3000)
      }
    })

    return () => {
      socketService.off('chat_message')
      socketService.off('user_typing')
    }
  }, [portfolioId, user])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: Date.now(),
      userId: user.id,
      userName: `${user.profile.firstName} ${user.profile.lastName}`,
      userAvatar: user.profile.avatar,
      content: newMessage,
      timestamp: new Date().toISOString(),
      portfolioId
    }

    socketService.emit('send_message', message)
    setMessages(prev => [...prev, message])
    setNewMessage('')
    scrollToBottom()
  }

  const handleTyping = () => {
    socketService.emit('typing', {
      portfolioId,
      userId: user.id,
      userName: `${user.profile.firstName} ${user.profile.lastName}`
    })
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-600">Start a conversation with your team</p>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.userId === user.id
              return (
                <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-3 max-w-lg ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {message.userName.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    
                    {/* Message */}
                    <div>
                      {!isOwn && (
                        <p className="text-sm font-medium text-gray-900 mb-1">{message.userName}</p>
                      )}
                      <div className={`rounded-2xl px-4 py-2 ${
                        isOwn 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{formatTime(message.timestamp)}</p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Typing Indicator */}
        {typing.length > 0 && (
          <div className="px-6 py-2 text-sm text-gray-600">
            {typing.join(', ')} {typing.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-200 bg-white p-4">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value)
                handleTyping()
              }}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
            
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Sidebar - Online Users */}
      <div className="w-64 bg-white border-l border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Team Members</h3>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Search className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        <div className="space-y-2">
          {[user, ...Array(3).fill(null)].map((member, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                  {index === 0 ? user.profile.firstName[0] + user.profile.lastName[0] : `U${index}`}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {index === 0 ? `${user.profile.firstName} ${user.profile.lastName}` : `User ${index}`}
                </p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RealTimeChat
