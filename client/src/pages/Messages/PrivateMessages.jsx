import React, { useState, useEffect, useRef } from 'react'
import { Send, Paperclip, Image, Smile, Search, Phone, Video, MoreVertical, X, Download, Edit2, Trash2, Check, Eye } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { socketService } from '../../services/socket'
import uploadService from '../../services/upload'
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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [editingMessage, setEditingMessage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [messageReactions, setMessageReactions] = useState({})
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)

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

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setSelectedFile(file)
    toast.loading('Uploading file...')
    
    try {
      let uploadedFile = file
      
      // Compress if image
      if (file.type.startsWith('image/')) {
        uploadedFile = await uploadService.compressImage(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920
        })
      }
      
      // Upload file
      const result = await uploadService.uploadImage(uploadedFile)
      
      // Send message with attachment
      const message = {
        id: Date.now(),
        senderId: user.id,
        receiverId: activeChat.userId,
        content: newMessage || 'Shared a file',
        timestamp: new Date(),
        isOwn: true,
        attachment: {
          url: result.url,
          name: file.name,
          type: file.type,
          size: file.size
        }
      }
      
      setMessages(prev => [...prev, message])
      socketService.emit('private_message', message)
      setNewMessage('')
      setSelectedFile(null)
      toast.dismiss()
      toast.success('File uploaded successfully!')
    } catch (error) {
      console.error('File upload error:', error)
      toast.dismiss()
      toast.error('Failed to upload file')
    }
  }

  const handleImageSelect = async (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith('image/')) return

    try {
      // Process and compress image
      const processed = await uploadService.processImage(file, {
        resize: { width: 1200 },
        compress: true,
        format: 'image/webp'
      })
      
      const result = await uploadService.uploadImage(processed)
      
      const message = {
        id: Date.now(),
        senderId: user.id,
        receiverId: activeChat.userId,
        content: newMessage || '📷 Image',
        timestamp: new Date(),
        isOwn: true,
        image: result.url
      }
      
      setMessages(prev => [...prev, message])
      socketService.emit('private_message', message)
      setNewMessage('')
      toast.success('Image sent!')
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error('Failed to send image')
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return

    if (editingMessage) {
      // Update existing message
      setMessages(prev => prev.map(msg => 
        msg.id === editingMessage.id 
          ? { ...msg, content: newMessage, edited: true }
          : msg
      ))
      socketService.emit('edit_message', { messageId: editingMessage.id, content: newMessage })
      setEditingMessage(null)
      setNewMessage('')
      return
    }

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

  const handleEditMessage = (message) => {
    setEditingMessage(message)
    setNewMessage(message.content)
  }

  const handleDeleteMessage = (messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
    socketService.emit('delete_message', { messageId })
    toast.success('Message deleted')
  }

  const handleReaction = (messageId, emoji) => {
    setMessageReactions(prev => ({
      ...prev,
      [messageId]: [...(prev[messageId] || []), emoji]
    }))
    socketService.emit('message_reaction', { messageId, emoji, userId: user.id })
  }

  const filteredMessages = messages.filter(msg => 
    !searchQuery || msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
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
              {filteredMessages.map((message) => (
                <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} group`}>
                  <div className="relative max-w-md">
                    <div className={`rounded-2xl px-4 py-2 ${
                      message.isOwn
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      {message.edited && (
                        <span className="text-xs opacity-70 italic"> (edited)</span>
                      )}
                      
                      {/* Image Attachment */}
                      {message.image && (
                        <div className="mt-2">
                          <img 
                            src={message.image} 
                            alt="Shared image" 
                            className="rounded-lg max-w-full h-auto cursor-pointer"
                            onClick={() => setPreviewImage(message.image)}
                          />
                        </div>
                      )}
                      
                      {/* File Attachment */}
                      {message.attachment && (
                        <div className="mt-2 flex items-center space-x-2 p-2 bg-black bg-opacity-10 rounded-lg">
                          <Paperclip className="w-4 h-4" />
                          <span className="text-xs flex-1 truncate">{message.attachment.name}</span>
                          <a href={message.attachment.url} download className="hover:opacity-70">
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-xs ${message.isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </p>
                        
                        {/* Message Actions */}
                        {message.isOwn && (
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditMessage(message)}
                              className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => handleDeleteMessage(message.id)}
                              className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Reactions */}
                    {messageReactions[message.id] && messageReactions[message.id].length > 0 && (
                      <div className="flex items-center space-x-1 mt-1 text-xs">
                        {messageReactions[message.id].map((emoji, idx) => (
                          <span key={idx} className="bg-white border border-gray-200 rounded-full px-2 py-0.5">
                            {emoji}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Quick Reactions */}
                    <div className="absolute -bottom-6 left-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm">
                      {['👍', '❤️', '😊', '🎉'].map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(message.id, emoji)}
                          className="hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
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
              {editingMessage && (
                <div className="mb-2 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <Edit2 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700">Editing message</span>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingMessage(null)
                      setNewMessage('')
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="*/*"
                />
                <input
                  ref={imageInputRef}
                  type="file"
                  onChange={handleImageSelect}
                  className="hidden"
                  accept="image/*"
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Send image"
                >
                  <Image className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value)
                    handleTypingIndicator()
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder={editingMessage ? "Edit message..." : "Type a message..."}
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
                  {editingMessage ? <Check className="w-5 h-5" /> : <Send className="w-5 h-5" />}
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
      
      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setPreviewImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={previewImage} 
            alt="Preview" 
            className="max-w-full max-h-full object-contain"
          />
          <a 
            href={previewImage} 
            download 
            className="absolute bottom-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
        </div>
      )}
    </div>
  )
}

export default PrivateMessages
