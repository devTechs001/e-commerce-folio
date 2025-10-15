import React, { useState, useRef, useEffect } from 'react'
import { 
  Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon,
  Image as ImageIcon, Code, Quote, Heading1, Heading2, AlignLeft,
  AlignCenter, AlignRight, Undo, Redo, Save, Eye, Crown
} from 'lucide-react'
import { subscriptionService } from '../../../services/subscription'
import Button from '../Button/Button'

const RichTextEditor = ({ 
  value = '', 
  onChange, 
  onSave,
  placeholder = 'Start typing...',
  minHeight = '300px',
  maxHeight = '600px',
  requiresPremium = false 
}) => {
  const [content, setContent] = useState(value)
  const [history, setHistory] = useState([value])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [userTier, setUserTier] = useState('free')
  const editorRef = useRef(null)

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
  const canUse = !requiresPremium || isPremiumUser

  useEffect(() => {
    setContent(value)
  }, [value])

  const handleChange = (e) => {
    const newContent = e.target.innerHTML
    setContent(newContent)
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newContent)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    
    if (onChange) {
      onChange(newContent)
    }
  }

  const execCommand = (command, value = null) => {
    if (!canUse && requiresPremium) {
      alert('This feature requires a Premium subscription')
      return
    }

    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const previousContent = history[newIndex]
      setContent(previousContent)
      if (editorRef.current) {
        editorRef.current.innerHTML = previousContent
      }
      if (onChange) {
        onChange(previousContent)
      }
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const nextContent = history[newIndex]
      setContent(nextContent)
      if (editorRef.current) {
        editorRef.current.innerHTML = nextContent
      }
      if (onChange) {
        onChange(nextContent)
      }
    }
  }

  const insertLink = () => {
    if (!canUse && requiresPremium) {
      alert('Link insertion requires Premium subscription')
      return
    }

    const url = prompt('Enter URL:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  const insertImage = () => {
    if (!canUse && requiresPremium) {
      alert('Image insertion requires Premium subscription')
      return
    }

    const url = prompt('Enter image URL:')
    if (url) {
      execCommand('insertImage', url)
    }
  }

  const formatHeading = (level) => {
    if (!canUse && requiresPremium) {
      alert('Advanced formatting requires Premium subscription')
      return
    }

    execCommand('formatBlock', `h${level}`)
  }

  const handleSave = () => {
    if (onSave) {
      onSave(content)
    }
  }

  if (!canUse) {
    return (
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
        style={{ minHeight }}
      >
        <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Premium Feature</h3>
        <p className="text-gray-600 mb-4">
          Rich text editing is available for Premium users
        </p>
        <Button
          variant="primary"
          onClick={() => window.location.href = '/pricing'}
        >
          Upgrade to Premium
        </Button>
      </div>
    )
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1">
        {/* History Controls */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={undo}
            disabled={historyIndex === 0}
            className="p-2 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex === history.length - 1}
            className="p-2 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>

        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => execCommand('bold')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('italic')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('underline')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </button>
        </div>

        {/* Headings (Premium) */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => formatHeading(1)}
            className="p-2 hover:bg-gray-200 rounded relative"
            title="Heading 1 (Premium)"
          >
            <Heading1 className="h-4 w-4" />
            {!isPremiumUser && <Crown className="h-2 w-2 text-yellow-500 absolute top-0 right-0" />}
          </button>
          <button
            onClick={() => formatHeading(2)}
            className="p-2 hover:bg-gray-200 rounded relative"
            title="Heading 2 (Premium)"
          >
            <Heading2 className="h-4 w-4" />
            {!isPremiumUser && <Crown className="h-2 w-2 text-yellow-500 absolute top-0 right-0" />}
          </button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => execCommand('insertUnorderedList')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('insertOrderedList')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => execCommand('justifyLeft')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('justifyCenter')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('justifyRight')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </button>
        </div>

        {/* Insert (Premium) */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={insertLink}
            className="p-2 hover:bg-gray-200 rounded relative"
            title="Insert Link (Premium)"
          >
            <LinkIcon className="h-4 w-4" />
            {!isPremiumUser && <Crown className="h-2 w-2 text-yellow-500 absolute top-0 right-0" />}
          </button>
          <button
            onClick={insertImage}
            className="p-2 hover:bg-gray-200 rounded relative"
            title="Insert Image (Premium)"
          >
            <ImageIcon className="h-4 w-4" />
            {!isPremiumUser && <Crown className="h-2 w-2 text-yellow-500 absolute top-0 right-0" />}
          </button>
          <button
            onClick={() => execCommand('formatBlock', 'blockquote')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('formatBlock', 'pre')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Code Block"
          >
            <Code className="h-4 w-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 hover:bg-gray-200 rounded ${showPreview ? 'bg-gray-200' : ''}`}
            title="Toggle Preview"
          >
            <Eye className="h-4 w-4" />
          </button>
          {onSave && (
            <button
              onClick={handleSave}
              className="p-2 hover:bg-primary-100 text-primary-600 rounded"
              title="Save"
            >
              <Save className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Editor/Preview */}
      {showPreview ? (
        <div 
          className="p-4 prose max-w-none overflow-y-auto"
          style={{ minHeight, maxHeight }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleChange}
          className="p-4 focus:outline-none overflow-y-auto"
          style={{ minHeight, maxHeight }}
          placeholder={placeholder}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      {/* Word Count */}
      <div className="border-t border-gray-300 bg-gray-50 px-4 py-2 text-xs text-gray-600 flex justify-between">
        <span>
          {content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length} words
        </span>
        <span>
          {content.replace(/<[^>]*>/g, '').length} characters
        </span>
      </div>
    </div>
  )
}

export default RichTextEditor
