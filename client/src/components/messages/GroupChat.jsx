import React, { useState, useEffect, useRef } from 'react'
import { Send, Users, Settings, UserPlus, Image as ImageIcon, Paperclip, Smile, MoreVertical, X, Crown, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { socketService } from '../../services/socket'
import uploadService from '../../services/upload'
import VoiceMessagePlayer from './VoiceMessagePlayer'
import toast from 'react-hot-toast'

const GroupChat = ({ groupId, onClose }) => {
  const { user } = useAuth()
  const [group, setGroup] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [members, setMembers] = useState([])
  const [showMembersList, setShowMembersList] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [typing, setTyping] = useState([])
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadGroup()
    loadMessages()
    
    // Socket listeners
    socketService.on('group_message', handleGroupMessage)
    socketService.on('user_typing_group', handleTyping)
    socketService.on('member_joined', handleMemberJoined)
    socketService.on('member_left', handleMemberLeft)

    // Join group room
    socketService.emit('join_group', groupId)

    return () => {
      socketService.off('group_message')
      socketService.off('user_typing_group')
      socketService.off('member_joined')
      socketService.off('member_left')
      socketService.emit('leave_group', groupId)
    }
  }, [groupId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadGroup = () => {
    // Mock group data
    const mockGroup = {
      id: groupId,
      name: 'Project Team',
      description: 'Main discussion group for the project',
      avatar: null,
      createdBy: 'user1',
      createdAt: new Date(Date.now() - 86400000 * 7),
      members: ['user1', 'user2', 'user3', user.id]
    }
    setGroup(mockGroup)

    // Mock members
    const mockMembers = [
      { id: 'user1', name: 'Alice Johnson', role: 'admin', avatar: null, online: true },
      { id: 'user2', name: 'Bob Smith', role: 'moderator', avatar: null, online: true },
      { id: 'user3', name: 'Carol Williams', role: 'member', avatar: null, online: false },
      { id: user.id, name: user.name, role: 'member', avatar: null, online: true }
    ]
    setMembers(mockMembers)
  }

  const loadMessages = () => {
    // Mock messages
    const mockMessages = [
      {
        id: 1,
        senderId: 'user1',
        senderName: 'Alice Johnson',
        content: 'Hey team! How is everyone doing?',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text'
      },
      {
        id: 2,
        senderId: 'user2',
        senderName: 'Bob Smith',
        content: 'Going great! Just finished the dashboard mockups.',
        timestamp: new Date(Date.now() - 3500000),
        type: 'text'
      },
      {
        id: 3,
        senderId: 'user3',
        senderName: 'Carol Williams',
        content: '@Alice Can you review the latest designs?',
        timestamp: new Date(Date.now() - 3400000),
        type: 'text',
        mentions: ['user1']
      }
    ]
    setMessages(mockMessages)
  }

  const handleGroupMessage = (message) => {
    if (message.groupId === groupId) {
      setMessages(prev => [...prev, message])
      
      // Remove user from typing list
      setTyping(prev => prev.filter(id => id !== message.senderId))
    }
  }

  const handleTyping = ({ userId, isTyping: isTypingValue }) => {
    if (userId === user.id) return

    setTyping(prev => {
      if (isTypingValue && !prev.includes(userId)) {
        return [...prev, userId]
      } else if (!isTypingValue) {
        return prev.filter(id => id !== userId)
      }
      return prev
    })
  }

  const handleMemberJoined = ({ groupId: gId, member }) => {
    if (gId === groupId) {
      setMembers(prev => [...prev, member])
      toast.success(`${member.name} joined the group`)
    }
  }

  const handleMemberLeft = ({ groupId: gId, memberId }) => {
    if (gId === groupId) {
      const member = members.find(m => m.id === memberId)
      setMembers(prev => prev.filter(m => m.id !== memberId))
      if (member) {
        toast(`${member.name} left the group`)
      }
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now(),
      groupId,
      senderId: user.id,
      senderName: user.name,
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      mentions: extractMentions(newMessage)
    }

    setMessages(prev => [...prev, message])
    socketService.emit('group_message', message)
    setNewMessage('')

    // Stop typing indicator
    socketService.emit('typing_group', { groupId, userId: user.id, isTyping: false })
  }

  const extractMentions = (text) => {
    const mentionRegex = /@(\w+)/g
    const mentions = []
    let match

    while ((match = mentionRegex.exec(text)) !== null) {
      const mentionedName = match[1]
      const mentionedMember = members.find(m => 
        m.name.toLowerCase().includes(mentionedName.toLowerCase())
      )
      if (mentionedMember) {
        mentions.push(mentionedMember.id)
      }
    }

    return mentions
  }

  const handleTypingIndicator = () => {
    socketService.emit('typing_group', { groupId, userId: user.id, isTyping: true })
    
    setTimeout(() => {
      socketService.emit('typing_group', { groupId, userId: user.id, isTyping: false })
    }, 1000)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      let processedFile = file
      
      if (file.type.startsWith('image/')) {
        processedFile = await uploadService.compressImage(file)
      }
      
      const result = await uploadService.uploadImage(processedFile)
      
      const message = {
        id: Date.now(),
        groupId,
        senderId: user.id,
        senderName: user.name,
        content: file.name,
        timestamp: new Date(),
        type: file.type.startsWith('image/') ? 'image' : 'file',
        attachment: {
          url: result.url,
          name: file.name,
          type: file.type,
          size: file.size
        }
      }
      
      setMessages(prev => [...prev, message])
      socketService.emit('group_message', message)
      toast.success('File uploaded!')
    } catch (error) {
      toast.error('Failed to upload file')
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getMemberRole = (memberId) => {
    const member = members.find(m => m.id === memberId)
    return member?.role || 'member'
  }

  const getRoleIcon = (role) => {
    if (role === 'admin') return <Crown className="w-3 h-3 text-yellow-500" />
    if (role === 'moderator') return <Shield className="w-3 h-3 text-blue-500" />
    return null
  }

  if (!group) return null

  return (
    <div className="h-full flex flex-col">
      {/* Group Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{group.name}</h3>
              <p className="text-sm text-gray-600">{members.length} members</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMembersList(!showMembersList)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Users className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {message.senderName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{message.senderName}</span>
                    {getRoleIcon(getMemberRole(message.senderId))}
                    <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                  </div>
                  
                  {message.type === 'text' && (
                    <div className="bg-white rounded-lg px-4 py-2 inline-block">
                      <p className="text-sm text-gray-900">{message.content}</p>
                    </div>
                  )}
                  
                  {message.type === 'image' && (
                    <div className="mt-2">
                      <img
                        src={message.attachment.url}
                        alt={message.attachment.name}
                        className="rounded-lg max-w-sm cursor-pointer"
                      />
                    </div>
                  )}
                  
                  {message.type === 'voice' && (
                    <div className="mt-2">
                      <VoiceMessagePlayer
                        audioUrl={message.attachment.url}
                        duration={message.attachment.duration}
                      />
                    </div>
                  )}
                  
                  {message.type === 'file' && (
                    <div className="mt-2 flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-200">
                      <Paperclip className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{message.attachment.name}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>
                  {typing.length === 1
                    ? `${members.find(m => m.id === typing[0])?.name} is typing...`
                    : `${typing.length} people are typing...`}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ImageIcon className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value)
                  handleTypingIndicator()
                }}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Type a message... (@mention members)"
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
        </div>

        {/* Members Sidebar */}
        {showMembersList && (
          <div className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Members ({members.length})</h3>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <UserPlus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="space-y-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {member.name.charAt(0)}
                      </div>
                      {member.online && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  {getRoleIcon(member.role)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupChat
