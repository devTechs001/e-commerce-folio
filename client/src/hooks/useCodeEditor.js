import { useState, useEffect, useCallback } from 'react'

export const useCodeEditor = (initialCode = '', initialLanguage = 'html') => {
  const [code, setCode] = useState(initialCode)
  const [language, setLanguage] = useState(initialLanguage)
  const [isDirty, setIsDirty] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const [errors, setErrors] = useState([])
  const [warnings, setWarnings] = useState([])

  // Update cursor position based on code and selection
  const updateCursorPosition = useCallback((selectionStart) => {
    const lines = code.substring(0, selectionStart).split('\n')
    const line = lines.length
    const column = lines[lines.length - 1].length + 1
    setCursorPosition({ line, column })
  }, [code])

  // Validate code based on language
  const validateCode = useCallback((codeToValidate, lang = language) => {
    const newErrors = []
    const newWarnings = []

    try {
      switch (lang) {
        case 'javascript':
          // Basic syntax validation
          new Function(codeToValidate)
          break
        case 'json':
          JSON.parse(codeToValidate)
          break
        case 'html':
          if (!codeToValidate.trim().startsWith('<!DOCTYPE') && 
              !codeToValidate.includes('<html')) {
            newWarnings.push('Missing HTML doctype or structure')
          }
          break
        case 'css':
          // Check for common issues
          if (codeToValidate.match(/!important/g)?.length > 3) {
            newWarnings.push('Too many !important declarations')
          }
          break
        default:
          // No validation for other languages
          break
      }
    } catch (error) {
      newErrors.push(`Syntax error: ${error.message}`)
    }

    setErrors(newErrors)
    setWarnings(newWarnings)
  }, [language])

  // Handle code changes
  const handleCodeChange = useCallback((newCode, selectionStart = 0) => {
    setCode(newCode)
    setIsDirty(true)
    updateCursorPosition(selectionStart)
    validateCode(newCode)
  }, [updateCursorPosition, validateCode])

  // Change language
  const changeLanguage = useCallback((newLanguage) => {
    setLanguage(newLanguage)
    validateCode(code, newLanguage)
  }, [code, validateCode])

  // Format code
  const formatCode = useCallback(() => {
    try {
      let formattedCode = code
      
      switch (language) {
        case 'json':
          formattedCode = JSON.stringify(JSON.parse(code), null, 2)
          break
        case 'javascript':
        case 'typescript':
          // Basic formatting - in a real app, you'd use a formatter like Prettier
          formattedCode = code
            .replace(/\s+/g, ' ')
            .replace(/([{])/g, '$1\n')
            .replace(/([}])/g, '\n$1')
            .replace(/(;)/g, '$1\n')
          break
        case 'html':
          // Basic HTML formatting
          formattedCode = code
            .replace(/(>)(<)(\/*)/g, '$1\n$2$3')
            .replace(/(\s+)</g, '<')
          break
        default:
          // No formatting for other languages
          break
      }
      
      setCode(formattedCode)
      setIsDirty(true)
    } catch (error) {
      console.error('Error formatting code:', error)
      setErrors([`Formatting error: ${error.message}`])
    }
  }, [code, language])

  // Reset to initial state
  const reset = useCallback(() => {
    setCode(initialCode)
    setLanguage(initialLanguage)
    setIsDirty(false)
    setErrors([])
    setWarnings([])
    setCursorPosition({ line: 1, column: 1 })
  }, [initialCode, initialLanguage])

  // Effect to validate when language changes
  useEffect(() => {
    validateCode(code, language)
  }, [language, validateCode, code])

  return {
    code,
    language,
    isDirty,
    cursorPosition,
    errors,
    warnings,
    setCode: handleCodeChange,
    setLanguage: changeLanguage,
    formatCode,
    reset,
    updateCursorPosition,
    validateCode,
    // Helper methods
    getLineCount: () => code.split('\n').length,
    getCharacterCount: () => code.length,
    hasErrors: () => errors.length > 0,
    hasWarnings: () => warnings.length > 0,
    canFormat: () => ['json', 'javascript', 'typescript', 'html'].includes(language)
  }
}