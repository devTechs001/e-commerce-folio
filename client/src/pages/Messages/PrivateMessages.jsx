import React, { useState, useEffect, useRef } from 'react'
import { Send, Paperclip, Image, Smile, Search, Phone, Video, MoreVertical } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { socketService } from '../../services/socket'
import toast from 'react-hot-toast'

const PrivateMessages = () => {
  const { userId: chatUserId } = useParams()
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [typing, setTyping] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchConversations()
    
    // Socket listeners
    socketService.on('private_message', handleNewMessage)
    socketService.on('user_typing', handleTyping)
    socketService.on('user_online', (userId) => {
      setOnlineUsers(prev => [...new Set([...prev, userId])])
    })
    socketService.on('user_offline', (userId) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId))
    })
    
    return () => {
      socketService.off('private_message')
      socketService.off('user_typing')
      socketService.off('user_online')
      socketService.off('user_offline')
    }
  }, [])

  useEffect(() => {
    if (chatUserId) {
      const chat = conversations.find(c => c.userId === chatUserId)
      if (chat) {
        setActiveChat(chat)
        loadMessages(chatUserId)
      }
    }
  }, [chatUserId, conversations])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchConversations = () => {
    // Mock conversations
    setConversations([
      {
        userId: '1',
        name: 'Sarah Johnson',
        avatar: null,
        lastMessage: 'Thanks for the quick response!',
        lastMessageTime: '5 min ago',
        unread: 2,
        isOnline: true
      },
      {
        userId: '2',
        name: 'Mike Chen',
        avatar: null,
        lastMessage: 'Can we schedule a call?',
        lastMessageTime: '1 hour ago',
        unread: 0,
        isOnline: true
      },
      {
        userId: '3',
        name: 'Emily Davis',
        avatar: null,
        lastMessage: 'Project looks great!',
        lastMessageTime: '2 hours ago',
        unread: 1,
        isOnline: false
      }
    ])
  }

  const loadMessages = (userId) => {
    // Mock messages
    setMessages([
      {
        id: 1,
        senderId: userId,
        content: 'Hi! I saw your portfolio and I\'m interested in working with you.',
        timestamp: new Date(Date.now() - 3600000),
        isOwn: false
      },
      {
        id: 2,
        senderId: user.id,
        content: 'Thank you! I\'d love to discuss your project. What are you looking for?',
        timestamp: new Date(Date.now() - 3500000),
        isOwn: true
      },
      {
        id: 3,
        senderId: userId,
        content: 'I need a full-stack developer for a web application. Do you have experience with React and Node.js?',
        timestamp: new Date(Date.now() - 3400000),
        isOwn: false
      },
      {
        id: 4,
        senderId: user.id,
        content: 'Yes, I have 5 years of experience with both. I can definitely help you with that.',
        timestamp: new Date(Date.now() - 3300000),
        isOwn: true
      }
    ])
  }

  const handleNewMessage = (message) => {
    if (message.conversationId === activeChat?.userId) {
      setMessages(prev => [...prev, message])
    }
    
    // Update conversation list
    setConversations(prev => prev.map(conv => 
      conv.userId === message.senderId
        ? { ...conv, lastMessage: message.content, unread: conv.unread + 1 }
        : conv
    ))
  }

  const handleTyping = ({ userId, isTyping }) => {
    if (userId === activeChat?.userId) {
      setTyping(isTyping)
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return

    const message = {
      id: Date.now(),
      senderId: user.id,
      receiverId: activeChat.userId,
      content: newMessage,
      timestamp: new Date(),
      isOwn: true
    }

    setMessages(prev => [...prev, message])
    socketService.emit('private_message', message)
    setNewMessage('')
  }

  const handleTypingIndicator = () => {
    socketService.emit('typing', {
      userId: user.id,
      conversationId: activeChat?.userId,
      isTyping: true
    })
    
    setTimeout(() => {
      socketService.emit('typing', {
        userId: user.id,
        conversationId: activeChat?.userId,
        isTyping: false
      })
    }, 1000)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.userId}
              onClick={() => {
                setActiveChat(conv)
                loadMessages(conv.userId)
              }}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                activeChat?.userId === conv.userId ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                    {conv.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {conv.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                    <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    {conv.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                      {activeChat.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {activeChat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{activeChat.name}</h3>
                    <p className="text-sm text-gray-600">{activeChat.isOnline ? 'Online' : 'Offline'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md rounded-2xl px-4 py-2 ${
                    message.isOwn
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              {typing && (
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
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Image className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value)
                    handleTypingIndicator()
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
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
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PrivateMessages
