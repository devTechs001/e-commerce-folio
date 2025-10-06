/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your custom CSS variables converted to Tailwind
        bgColor: '#1f242d',
        sbgColor: '#323946',
        textColor: '#fff',
        mainColor: '#0ef',
        altColor: '#1a2b3c',
        olColor: '#0e1022',
        
        // Your existing primary colors
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundColor: {
        'dark-bg': '#1f242d',
        'dark-secondary': '#323946',
        'dark-alt': '#1a2b3c',
        'dark-ol': '#0e1022',
      },
      textColor: {
        'neon': '#0ef',
      }
    },
  },
  plugins: [],
}

