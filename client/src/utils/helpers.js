export const formatDate = (dateString) => {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }
  
  export const truncateText = (text, maxLength) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    
    return text.substring(0, maxLength) + '...'
  }
  
  export const generateId = () => {
    return Math.random().toString(36).substr(2, 9)
  }
  
  export const capitalizeFirst = (string) => {
    if (!string) return ''
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  
  export const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  }
  
  export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }
  
  export const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ')
  }