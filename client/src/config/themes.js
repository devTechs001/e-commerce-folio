// Portfolio Theme Configuration
export const themes = {
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with smooth animations',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      background: '#FFFFFF',
      text: '#1F2937',
      heading: '#111827'
    },
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif"
    },
    borderRadius: '12px',
    shadows: true,
    animations: 'smooth'
  },
  
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant with focus on content',
    colors: {
      primary: '#000000',
      secondary: '#4B5563',
      accent: '#6B7280',
      background: '#FFFFFF',
      text: '#374151',
      heading: '#000000'
    },
    fonts: {
      heading: "'Helvetica Neue', sans-serif",
      body: "'Helvetica Neue', sans-serif"
    },
    borderRadius: '4px',
    shadows: false,
    animations: 'subtle'
  },
  
  creative: {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and vibrant with artistic flair',
    colors: {
      primary: '#EC4899',
      secondary: '#F59E0B',
      accent: '#8B5CF6',
      background: '#FFF7ED',
      text: '#78350F',
      heading: '#92400E'
    },
    fonts: {
      heading: "'Poppins', sans-serif",
      body: "'Poppins', sans-serif"
    },
    borderRadius: '20px',
    shadows: true,
    animations: 'playful'
  },
  
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Business-focused with corporate aesthetics',
    colors: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      accent: '#60A5FA',
      background: '#F8FAFC',
      text: '#334155',
      heading: '#0F172A'
    },
    fonts: {
      heading: "'Roboto', sans-serif",
      body: "'Roboto', sans-serif"
    },
    borderRadius: '8px',
    shadows: true,
    animations: 'professional'
  },
  
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Sleek dark theme for modern portfolios',
    colors: {
      primary: '#60A5FA',
      secondary: '#818CF8',
      accent: '#A78BFA',
      background: '#0F172A',
      text: '#CBD5E1',
      heading: '#F1F5F9'
    },
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif"
    },
    borderRadius: '12px',
    shadows: true,
    animations: 'smooth'
  },
  
  vibrant: {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Energetic and colorful design',
    colors: {
      primary: '#10B981',
      secondary: '#06B6D4',
      accent: '#F59E0B',
      background: '#ECFDF5',
      text: '#065F46',
      heading: '#064E3B'
    },
    fonts: {
      heading: "'Montserrat', sans-serif",
      body: "'Open Sans', sans-serif"
    },
    borderRadius: '16px',
    shadows: true,
    animations: 'energetic'
  },
  
  elegant: {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated and refined',
    colors: {
      primary: '#7C3AED',
      secondary: '#A855F7',
      accent: '#C084FC',
      background: '#FAF5FF',
      text: '#581C87',
      heading: '#3B0764'
    },
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Lato', sans-serif"
    },
    borderRadius: '8px',
    shadows: true,
    animations: 'elegant'
  },
  
  tech: {
    id: 'tech',
    name: 'Tech',
    description: 'Futuristic tech-focused design',
    colors: {
      primary: '#06B6D4',
      secondary: '#14B8A6',
      accent: '#22D3EE',
      background: '#0F172A',
      text: '#94A3B8',
      heading: '#E2E8F0'
    },
    fonts: {
      heading: "'Fira Code', monospace",
      body: "'Roboto Mono', monospace"
    },
    borderRadius: '4px',
    shadows: true,
    animations: 'tech'
  },
  
  nature: {
    id: 'nature',
    name: 'Nature',
    description: 'Earth tones and organic feel',
    colors: {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#34D399',
      background: '#F0FDF4',
      text: '#064E3B',
      heading: '#022C22'
    },
    fonts: {
      heading: "'Merriweather', serif",
      body: "'Source Sans Pro', sans-serif"
    },
    borderRadius: '12px',
    shadows: true,
    animations: 'natural'
  },
  
  retro: {
    id: 'retro',
    name: 'Retro',
    description: 'Vintage-inspired nostalgic design',
    colors: {
      primary: '#DC2626',
      secondary: '#F59E0B',
      accent: '#FBBF24',
      background: '#FEF3C7',
      text: '#78350F',
      heading: '#451A03'
    },
    fonts: {
      heading: "'Courier New', monospace",
      body: "'Georgia', serif"
    },
    borderRadius: '0px',
    shadows: false,
    animations: 'retro'
  }
}

// Export theme list for selection
export const themeList = Object.values(themes)

// Get theme by ID
export const getTheme = (themeId) => {
  return themes[themeId] || themes.modern
}

// Apply theme to document
export const applyTheme = (themeId) => {
  const theme = getTheme(themeId)
  const root = document.documentElement
  
  // Apply CSS variables
  root.style.setProperty('--color-primary', theme.colors.primary)
  root.style.setProperty('--color-secondary', theme.colors.secondary)
  root.style.setProperty('--color-accent', theme.colors.accent)
  root.style.setProperty('--color-background', theme.colors.background)
  root.style.setProperty('--color-text', theme.colors.text)
  root.style.setProperty('--color-heading', theme.colors.heading)
  root.style.setProperty('--font-heading', theme.fonts.heading)
  root.style.setProperty('--font-body', theme.fonts.body)
  root.style.setProperty('--border-radius', theme.borderRadius)
  
  return theme
}

export default themes
