import OpenAI from 'openai'

class AIPortfolioService {
  constructor() {
    this.openai = process.env.OPENAI_API_KEY 
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null
    
    this.model = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview'
  }

  /**
   * Generate portfolio content based on user details
   * @param {object} userDetails - User information
   */
  async generatePortfolioContent(userDetails) {
    try {
      if (!this.openai) {
        return this.getMockPortfolioContent(userDetails)
      }

      const { name, profession, skills, experience, bio } = userDetails

      const prompt = `Generate professional portfolio content for:
Name: ${name}
Profession: ${profession}
Skills: ${skills.join(', ')}
Years of Experience: ${experience}
Bio: ${bio || 'Not provided'}

Generate the following sections in JSON format:
1. A compelling professional headline (max 100 chars)
2. An engaging "About Me" section (150-200 words)
3. A professional summary (50-75 words)
4. 3-5 key achievements
5. 5 suggested portfolio project titles relevant to their profession
6. SEO-optimized meta description

Return as JSON with keys: headline, about, summary, achievements, projectSuggestions, metaDescription`

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional portfolio content writer. Generate compelling, SEO-optimized content that highlights the professional\'s strengths and expertise.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })

      const content = JSON.parse(completion.choices[0].message.content)

      return {
        success: true,
        content,
        tokensUsed: completion.usage.total_tokens
      }
    } catch (error) {
      console.error('AI portfolio generation error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Generate project descriptions
   * @param {object} projectDetails - Project information
   */
  async generateProjectDescription(projectDetails) {
    try {
      if (!this.openai) {
        return this.getMockProjectDescription(projectDetails)
      }

      const { title, technologies, role, duration } = projectDetails

      const prompt = `Generate a professional project description for a portfolio:
Project Title: ${title}
Technologies Used: ${technologies.join(', ')}
Your Role: ${role}
Duration: ${duration}

Generate:
1. A compelling project description (100-150 words)
2. Key features/highlights (3-5 bullet points)
3. Technical challenges overcome
4. Impact/results achieved

Return as JSON with keys: description, features, challenges, impact`

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a technical writer specializing in project documentation for portfolios. Focus on achievements, technical skills, and measurable impact.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })

      const content = JSON.parse(completion.choices[0].message.content)

      return {
        success: true,
        content,
        tokensUsed: completion.usage.total_tokens
      }
    } catch (error) {
      console.error('AI project description error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Suggest portfolio layout and color scheme
   * @param {object} preferences - User preferences
   */
  async suggestDesign(preferences) {
    try {
      if (!this.openai) {
        return this.getMockDesignSuggestion(preferences)
      }

      const { profession, style, targetAudience } = preferences

      const prompt = `Suggest a portfolio design for:
Profession: ${profession}
Preferred Style: ${style || 'modern'}
Target Audience: ${targetAudience || 'potential employers'}

Provide design suggestions in JSON format:
1. color palette (primary, secondary, accent colors with hex codes)
2. recommended template type (minimal, creative, professional, bold)
3. layout structure (sections to include and their order)
4. typography suggestions (font pairings)
5. design rationale (why these choices work)

Return as JSON with keys: colorPalette, templateType, layoutStructure, typography, rationale`

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional UI/UX designer specializing in portfolio websites. Provide modern, accessible, and conversion-optimized design suggestions.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' }
      })

      const design = JSON.parse(completion.choices[0].message.content)

      return {
        success: true,
        design,
        tokensUsed: completion.usage.total_tokens
      }
    } catch (error) {
      console.error('AI design suggestion error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * AI Portfolio Assistant - Chat interface
   * @param {string} message - User message
   * @param {array} conversationHistory - Previous messages
   */
  async chatAssistant(message, conversationHistory = []) {
    try {
      if (!this.openai) {
        return this.getMockAssistantResponse(message)
      }

      const messages = [
        {
          role: 'system',
          content: `You are an AI portfolio assistant for E-Folio. You help users:
- Create and improve their portfolios
- Write compelling content
- Choose the right design and layout
- Optimize for SEO
- Showcase their work effectively
- Answer questions about portfolio best practices

Be helpful, encouraging, and provide actionable advice.`
        },
        ...conversationHistory,
        { role: 'user', content: message }
      ]

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 500
      })

      const response = completion.choices[0].message.content

      return {
        success: true,
        response,
        tokensUsed: completion.usage.total_tokens
      }
    } catch (error) {
      console.error('AI assistant error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Improve existing content
   * @param {string} content - Original content
   * @param {string} improvementType - Type of improvement needed
   */
  async improveContent(content, improvementType = 'general') {
    try {
      if (!this.openai) {
        return { success: true, improved: content, suggestions: ['Consider adding more specific details', 'Use active voice', 'Add measurable results'] }
      }

      let instructions = ''
      switch (improvementType) {
        case 'seo':
          instructions = 'Optimize for SEO while maintaining natural language. Add relevant keywords and improve readability.'
          break
        case 'professional':
          instructions = 'Make it more professional and impactful. Use strong action verbs and quantify achievements.'
          break
        case 'concise':
          instructions = 'Make it more concise while retaining key information. Remove redundancy.'
          break
        case 'detailed':
          instructions = 'Add more detail and context. Expand on key points with specific examples.'
          break
        default:
          instructions = 'Improve overall quality, clarity, and impact. Make it more engaging and professional.'
      }

      const prompt = `Improve this portfolio content:\n\n${content}\n\nInstructions: ${instructions}\n\nProvide the improved version and 3-5 specific suggestions for further enhancement.`

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional portfolio content editor. Improve content while maintaining the user\'s voice and key messages.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })

      const response = completion.choices[0].message.content
      
      // Parse the response to extract improved content and suggestions
      const improved = response.split('Suggestions:')[0].trim()
      const suggestionsText = response.split('Suggestions:')[1] || ''
      const suggestions = suggestionsText.split('\n').filter(s => s.trim()).map(s => s.replace(/^\d+\.\s*/, ''))

      return {
        success: true,
        improved,
        suggestions,
        tokensUsed: completion.usage.total_tokens
      }
    } catch (error) {
      console.error('AI content improvement error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Generate SEO keywords and metadata
   * @param {object} portfolioData - Portfolio information
   */
  async generateSEO(portfolioData) {
    try {
      if (!this.openai) {
        return this.getMockSEO(portfolioData)
      }

      const { profession, skills, location } = portfolioData

      const prompt = `Generate SEO optimization for a portfolio:
Profession: ${profession}
Skills: ${skills.join(', ')}
Location: ${location || 'Global'}

Provide:
1. 10-15 relevant keywords
2. Meta title (60 chars max)
3. Meta description (155 chars max)
4. Open Graph title and description
5. Suggested URL slug

Return as JSON with keys: keywords, metaTitle, metaDescription, ogTitle, ogDescription, urlSlug`

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an SEO specialist. Generate optimization suggestions that will improve portfolio visibility in search engines.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        response_format: { type: 'json_object' }
      })

      const seo = JSON.parse(completion.choices[0].message.content)

      return {
        success: true,
        seo,
        tokensUsed: completion.usage.total_tokens
      }
    } catch (error) {
      console.error('AI SEO generation error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Analyze portfolio and provide feedback
   * @param {object} portfolioData - Complete portfolio data
   */
  async analyzePortfolio(portfolioData) {
    try {
      if (!this.openai) {
        return this.getMockAnalysis()
      }

      const prompt = `Analyze this portfolio and provide constructive feedback:

${JSON.stringify(portfolioData, null, 2)}

Provide analysis in JSON format:
1. Overall rating (1-10)
2. Strengths (3-5 points)
3. Areas for improvement (3-5 points)
4. Content quality score (1-10)
5. Design score (1-10)
6. SEO score (1-10)
7. Actionable recommendations (5-7 specific suggestions)

Return as JSON with keys: rating, strengths, improvements, contentScore, designScore, seoScore, recommendations`

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a portfolio review expert. Provide honest, constructive feedback that helps users improve their portfolios.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })

      const analysis = JSON.parse(completion.choices[0].message.content)

      return {
        success: true,
        analysis,
        tokensUsed: completion.usage.total_tokens
      }
    } catch (error) {
      console.error('AI portfolio analysis error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Mock responses for when OpenAI is not configured
  getMockPortfolioContent(userDetails) {
    return {
      success: true,
      content: {
        headline: `${userDetails.profession} | Building Innovative Solutions`,
        about: `As a passionate ${userDetails.profession} with ${userDetails.experience} years of experience, I specialize in ${userDetails.skills.slice(0, 3).join(', ')}. My work focuses on creating user-centric solutions that solve real-world problems. I bring a unique blend of technical expertise and creative thinking to every project.`,
        summary: `Experienced ${userDetails.profession} skilled in ${userDetails.skills[0]} and ${userDetails.skills[1]}. Proven track record of delivering high-quality work.`,
        achievements: [
          `Successfully delivered ${userDetails.experience * 10}+ projects`,
          `Expert in ${userDetails.skills[0]} and ${userDetails.skills[1]}`,
          'Recognized for exceptional problem-solving skills'
        ],
        projectSuggestions: userDetails.skills.slice(0, 5).map(skill => `${skill} Implementation Project`),
        metaDescription: `Portfolio of ${userDetails.name}, ${userDetails.profession} specializing in ${userDetails.skills.slice(0, 3).join(', ')}.`
      },
      mock: true
    }
  }

  getMockProjectDescription(projectDetails) {
    return {
      success: true,
      content: {
        description: `${projectDetails.title} is a comprehensive project utilizing ${projectDetails.technologies.join(', ')}. As ${projectDetails.role}, I led the development and implementation over ${projectDetails.duration}, focusing on delivering a robust and scalable solution.`,
        features: [
          'Modern and responsive user interface',
          `Implemented using ${projectDetails.technologies[0]}`,
          'Optimized for performance and scalability'
        ],
        challenges: 'Overcame complex technical challenges through innovative problem-solving',
        impact: 'Delivered significant value and improved user experience'
      },
      mock: true
    }
  }

  getMockDesignSuggestion(preferences) {
    return {
      success: true,
      design: {
        colorPalette: {
          primary: '#3B82F6',
          secondary: '#1F2937',
          accent: '#10B981'
        },
        templateType: 'modern',
        layoutStructure: ['hero', 'about', 'projects', 'skills', 'contact'],
        typography: {
          heading: 'Inter',
          body: 'Open Sans'
        },
        rationale: 'Modern, clean design that highlights your work professionally'
      },
      mock: true
    }
  }

  getMockAssistantResponse(message) {
    return {
      success: true,
      response: 'I\'m here to help you create an amazing portfolio! What would you like to work on? I can help with content writing, design suggestions, SEO optimization, and more.',
      mock: true
    }
  }

  getMockSEO(portfolioData) {
    return {
      success: true,
      seo: {
        keywords: portfolioData.skills,
        metaTitle: `${portfolioData.profession} Portfolio`,
        metaDescription: `Professional portfolio showcasing ${portfolioData.profession} work and expertise`,
        ogTitle: `${portfolioData.profession} - Portfolio`,
        ogDescription: `View my professional portfolio and projects`,
        urlSlug: portfolioData.profession.toLowerCase().replace(/\s+/g, '-')
      },
      mock: true
    }
  }

  getMockAnalysis() {
    return {
      success: true,
      analysis: {
        rating: 8,
        strengths: [
          'Clear presentation of skills and experience',
          'Professional design and layout',
          'Good content quality'
        ],
        improvements: [
          'Add more specific project details',
          'Include measurable achievements',
          'Optimize for SEO'
        ],
        contentScore: 7,
        designScore: 8,
        seoScore: 6,
        recommendations: [
          'Add testimonials from clients or colleagues',
          'Include metrics and quantifiable results',
          'Optimize page load speed',
          'Add a blog section',
          'Improve mobile responsiveness'
        ]
      },
      mock: true
    }
  }
}

export const aiPortfolioService = new AIPortfolioService()
export default aiPortfolioService
