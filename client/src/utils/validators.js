export const validateRequired = (value) => {
    if (!value || value.toString().trim() === '') {
      return 'This field is required'
    }
    return null
  }
  
  export const validateEmail = (email) => {
    if (!email) {
      return 'Email is required'
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }
    
    return null
  }
  
  export const validatePassword = (password) => {
    if (!password) {
      return 'Password is required'
    }
    
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter'
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number'
    }
    
    return null
  }
  
  export const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return 'Passwords do not match'
    }
    return null
  }
  
  export const validateUrl = (url) => {
    if (!url) return null
    
    try {
      new URL(url)
      return null
    } catch {
      return 'Please enter a valid URL'
    }
  }
  
  export const validatePhone = (phone) => {
    if (!phone) return null
    
    const phoneRegex = /^\+?[\d\s-()]{10,}$/
    if (!phoneRegex.test(phone)) {
      return 'Please enter a valid phone number'
    }
    
    return null
  }