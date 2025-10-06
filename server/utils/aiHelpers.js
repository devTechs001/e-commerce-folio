import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const analyzePortfolioContent = async (content) => {
  if (!process.env.OPENAI_API_KEY) {
    return getDefaultAnalysis()
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a portfolio content analyzer. Provide constructive feedback and suggestions for improvement."
        },
        {
          role: "user",
          content: `Analyze this portfolio content and provide suggestions: ${JSON.stringify(content)}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    return parseAnalysisResponse(completion.choices[0].message.content)
  } catch (error) {
    console.error('Portfolio analysis error:', error)
    return getDefaultAnalysis()
  }
}

export const generateKeywords = async (text, count = 10) => {
  if (!process.env.OPENAI_API_KEY) {
    return getDefaultKeywords(text)
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert. Generate relevant keywords for the given text."
        },
        {
          role: "user",
          content: `Generate ${count} relevant SEO keywords for: ${text}`
        }
      ],
      max_tokens: 200,
      temperature: 0.5,
    })

    return completion.choices[0].message.content.split(',').map(k => k.trim()).slice(0, count)
  } catch (error) {
    console.error('Keyword generation error:', error)
    return getDefaultKeywords(text)
  }
}

export const checkGrammar = async (text) => {
  if (!process.env.OPENAI_API_KEY) {
    return { corrected: text, suggestions: [] }
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a grammar checker. Correct any grammatical errors and provide suggestions."
        },
        {
          role: "user",
          content: `Check and correct grammar for: ${text}`
        }
      ],
      max_tokens: 300,
      temperature: 0.3,
    })

    return {
      original: text,
      corrected: completion.choices[0].message.content,
      suggestions: extractGrammarSuggestions(text, completion.choices[0].message.content)
    }
  } catch (error) {
    console.error('Grammar check error:', error)
    return { corrected: text, suggestions: [] }
  }
}

// Helper functions
const getDefaultAnalysis = () => ({
  readability: 'Good',
  suggestions: [
    'Consider adding more specific achievements',
    'Include metrics to quantify your impact',
    'Add a clear call to action'
  ],
  score: 7.5
})

const getDefaultKeywords = (text) => {
  const words = text.toLowerCase().split(/\s+/)
  const filtered = words.filter(word => word.length > 3)
  return [...new Set(filtered)].slice(0, 10)
}

const parseAnalysisResponse = (response) => {
  // Simple parsing of AI response
  return {
    readability: response.includes('excellent') ? 'Excellent' : 
                response.includes('good') ? 'Good' : 'Needs Improvement',
    suggestions: response.split('\n').filter(line => line.includes('-') || line.includes('•')),
    score: 8.0 // Default score
  }
}

const extractGrammarSuggestions = (original, corrected) => {
  const suggestions = []
  
  if (original !== corrected) {
    suggestions.push('Text has been improved for better readability')
  }
  
  return suggestions
}