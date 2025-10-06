// Custom validators for express-validator
export const isValidHexColor = (value) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
}

export const isValidURL = (value) => {
  if (!value) return true // Optional field
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export const isValidSocialLink = (value, platform) => {
  if (!value) return true // Optional field
  
  const patterns = {
    linkedin: /^https?:\/\/(www\.)?linkedin\.com\/.+/,
    github: /^https?:\/\/(www\.)?github\.com\/.+/,
    twitter: /^https?:\/\/(www\.)?twitter\.com\/.+/,
    website: /^https?:\/\/.+\..+/
  }

  return patterns[platform] ? patterns[platform].test(value) : isValidURL(value)
}