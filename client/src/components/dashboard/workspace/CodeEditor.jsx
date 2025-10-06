import React, { useState, useEffect, useRef } from 'react'
import { 
  Play, 
  Save, 
  Download, 
  Copy, 
  Settings, 
  Maximize2, 
  Minimize2,
  Eye,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Button from '../../common/Button/Button'
import { storageService } from '../../../services/storage'

const CodeEditor = ({ 
  file = null, 
  onSave = null, 
  onRun = null, 
  readOnly = false,
  language = 'html',
  theme = 'light'
}) => {
  const [code, setCode] = useState('')
  const [isDirty, setIsDirty] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState([])
  const [warnings, setWarnings] = useState([])
  const textareaRef = useRef(null)
  const previewRef = useRef(null)

  // Supported languages and their extensions
  const languages = {
    html: { name: 'HTML', extension: '.html', mode: 'html' },
    css: { name: 'CSS', extension: '.css', mode: 'css' },
    javascript: { name: 'JavaScript', extension: '.js', mode: 'javascript' },
    typescript: { name: 'TypeScript', extension: '.ts', mode: 'typescript' },
    python: { name: 'Python', extension: '.py', mode: 'python' },
    json: { name: 'JSON', extension: '.json', mode: 'json' },
    markdown: { name: 'Markdown', extension: '.md', mode: 'markdown' }
  }

  useEffect(() => {
    if (file) {
      loadFileContent()
    } else {
      setCode('// Start coding here...\n')
    }
  }, [file])

  useEffect(() => {
    updatePreview()
  }, [code, language])

  const loadFileContent = async () => {
    if (!file) return

    try {
      const response = await storageService.getFile(file.id)
      if (response.success) {
        setCode(response.data.content || '')
        setIsDirty(false)
      }
    } catch (error) {
      console.error('Error loading file:', error)
      setErrors([`Failed to load file: ${error.message}`])
    }
  }

  const handleCodeChange = (e) => {
    const newCode = e.target.value
    setCode(newCode)
    setIsDirty(true)
    updateCursorPosition(e.target)
    validateCode(newCode)
  }

  const updateCursorPosition = (textarea) => {
    const lines = code.substring(0, textarea.selectionStart).split('\n')
    const line = lines.length
    const column = lines[lines.length - 1].length + 1
    setCursorPosition({ line, column })
  }

  const validateCode = (codeToValidate) => {
    // Basic validation based on language
    const newErrors = []
    const newWarnings = []

    switch (language) {
      case 'html':
        if (!codeToValidate.includes('<html') && !codeToValidate.includes('<!DOCTYPE')) {
          newWarnings.push('Consider adding HTML doctype and structure')
        }
        break
      case 'css':
        if (codeToValidate.includes('!important')) {
          newWarnings.push('Avoid using !important in CSS')
        }
        break
      case 'javascript':
        // Basic syntax check
        try {
          new Function(codeToValidate)
        } catch (e) {
          newErrors.push(`Syntax error: ${e.message}`)
        }
        break
      case 'json':
        try {
          JSON.parse(codeToValidate)
        } catch (e) {
          newErrors.push(`JSON error: ${e.message}`)
        }
        break
    }

    setErrors(newErrors)
    setWarnings(newWarnings)
  }

  const handleSave = async () => {
    if (!file && !onSave) return

    setSaving(true)
    try {
      if (file) {
        // Save to existing file
        const response = await storageService.updateFile(file.id, { content: code })
        if (response.success) {
          setIsDirty(false)
        }
      } else if (onSave) {
        // Use callback for new files
        await onSave(code)
        setIsDirty(false)
      }
    } catch (error) {
      console.error('Error saving file:', error)
      setErrors([`Failed to save file: ${error.message}`])
    } finally {
      setSaving(false)
    }
  }

  const handleRun = () => {
    if (onRun) {
      onRun(code)
    } else {
      // Default run behavior
      if (language === 'html') {
        updatePreview()
        setIsPreview(true)
      }
    }
  }

  const updatePreview = () => {
    if (previewRef.current && language === 'html') {
      const iframe = previewRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
      iframeDoc.open()
      iframeDoc.write(code)
      iframeDoc.close()
    }
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      // Show temporary success feedback
      const copyBtn = document.querySelector('[data-copy-btn]')
      if (copyBtn) {
        const originalText = copyBtn.textContent
        copyBtn.textContent = 'Copied!'
        setTimeout(() => {
          copyBtn.textContent = originalText
        }, 2000)
      }
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file?.name || `code${languages[language]?.extension || '.txt'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleKeyDown = (e) => {
    // Tab key support
    if (e.key === 'Tab' && !readOnly) {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      
      // Insert 2 spaces for tab
      const newCode = code.substring(0, start) + '  ' + code.substring(end)
      setCode(newCode)
      setIsDirty(true)
      
      // Set cursor position after tab
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2
      }, 0)
    }

    // Save with Ctrl+S
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  }

  const getLineNumbers = () => {
    const lines = code.split('\n')
    return lines.map((_, index) => index + 1).join('\n')
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 flex flex-col ${
      isFullscreen ? 'fixed inset-0 z-50 m-4' : 'h-full'
    }`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary-600" />
            <span className="font-medium text-gray-900">
              {file?.name || `Untitled${languages[language]?.extension}`}
            </span>
            {isDirty && <span className="text-orange-500 text-sm">•</span>}
          </div>
          
          <select
            value={language}
            onChange={(e) => {
              // Language change handler would be passed as prop
              console.log('Language changed to:', e.target.value)
            }}
            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
            disabled={readOnly}
          >
            {Object.entries(languages).map(([key, lang]) => (
              <option key={key} value={key}>{lang.name}</option>
            ))}
          </select>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
            <span>{code.length} chars</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Status Indicators */}
          {errors.length === 0 && warnings.length === 0 && !isDirty && (
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              Saved
            </div>
          )}
          
          {errors.length > 0 && (
            <div className="flex items-center text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.length} error{errors.length !== 1 ? 's' : ''}
            </div>
          )}

          {warnings.length > 0 && (
            <div className="flex items-center text-yellow-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              {warnings.length} warning{warnings.length !== 1 ? 's' : ''}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            icon={isPreview ? Eye : Play}
            onClick={() => language === 'html' ? setIsPreview(!isPreview) : handleRun()}
          >
            {language === 'html' ? (isPreview ? 'Code' : 'Preview') : 'Run'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Copy}
            onClick={handleCopyCode}
            data-copy-btn
          >
            Copy
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={handleDownload}
          >
            Download
          </Button>

          {!readOnly && (
            <Button
              variant="primary"
              size="sm"
              icon={Save}
              loading={saving}
              onClick={handleSave}
              disabled={!isDirty}
            >
              Save
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            icon={isFullscreen ? Minimize2 : Maximize2}
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        {isPreview && language === 'html' ? (
          // Preview Mode
          <div className="flex-1 bg-white">
            <iframe
              ref={previewRef}
              title="Code Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ) : (
          // Code Editor Mode
          <div className="flex-1 flex overflow-hidden bg-gray-900 text-gray-100">
            {/* Line Numbers */}
            <div className="w-16 bg-gray-800 text-right py-2 px-3 text-gray-500 text-sm font-mono overflow-hidden select-none">
              <pre>{getLineNumbers()}</pre>
            </div>

            {/* Code Textarea */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={handleCodeChange}
                onKeyDown={handleKeyDown}
                onClick={(e) => updateCursorPosition(e.target)}
                onKeyUp={(e) => updateCursorPosition(e.target)}
                className="w-full h-full bg-transparent text-gray-100 font-mono text-sm resize-none outline-none p-2 absolute inset-0"
                spellCheck="false"
                readOnly={readOnly}
                placeholder={`Start writing your ${languages[language]?.name} code...`}
                style={{
                  lineHeight: '1.5',
                  tabSize: 2
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Editor Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>{languages[language]?.name} • UTF-8</span>
            {errors.length > 0 && (
              <span className="text-red-600">
                Errors: {errors.join(', ')}
              </span>
            )}
            {warnings.length > 0 && (
              <span className="text-yellow-600">
                Warnings: {warnings.join(', ')}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span>Spaces: 2</span>
            <span>LF</span>
          </div>
        </div>
      </div>

      {/* Error/Warning Panel */}
      {(errors.length > 0 || warnings.length > 0) && (
        <div className="border-t border-gray-200 max-h-32 overflow-y-auto">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center px-4 py-2 bg-red-50 border-b border-red-100">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          ))}
          {warnings.map((warning, index) => (
            <div key={index} className="flex items-center px-4 py-2 bg-yellow-50 border-b border-yellow-100">
              <AlertCircle className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-yellow-700">{warning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CodeEditor