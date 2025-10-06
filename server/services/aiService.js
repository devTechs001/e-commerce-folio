import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const generatePortfolioContent = async (userData, sectionType) => {
  if (!process.env.OPENAI_API_KEY) {
    return getDefaultContent(sectionType)
  }

  try {
    const prompt = createPrompt(userData, sectionType)
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional portfolio content writer. Create engaging, professional content for portfolio sections."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    return completion.choices[0].message.content
  } catch (error) {
    console.error('AI content generation error:', error)
    return getDefaultContent(sectionType)
  }
}

const createPrompt = (userData, sectionType) => {
  const baseInfo = `
    User: ${userData.profile.firstName} ${userData.profile.lastName}
    Title: ${userData.profile.title || 'Professional'}
    Bio: ${userData.profile.bio || 'No bio provided'}
  `

  const sectionPrompts = {
    hero: `Create an engaging hero section introduction for a portfolio. ${baseInfo} Make it welcoming and professional.`,
    about: `Write a compelling about section for a portfolio. ${baseInfo} Highlight their background, skills, and passion.`,
    skills: `Create a skills section description. ${baseInfo} Focus on their expertise and capabilities.`
  }

  return sectionPrompts[sectionType] || 'Create professional portfolio content.'
}

const getDefaultContent = (sectionType) => {
  const defaults = {
    hero: "Welcome to my portfolio. I'm passionate about creating amazing work and solving complex problems.",
    about: "I'm a dedicated professional with a passion for excellence. I believe in continuous learning and pushing boundaries to deliver outstanding results.",
    skills: "I bring a diverse set of skills and expertise to every project. My focus is on delivering high-quality solutions that make a real impact."
  }

  return defaults[sectionType] || "Professional portfolio content."
}

export const optimizeSEOText = async (text, keywords = []) => {
  if (!process.env.OPENAI_API_KEY) {
    return text
  }

  try {
    const prompt = `
      Optimize the following text for SEO. Include these keywords naturally: ${keywords.join(', ')}
      
      Original text: ${text}
      
      Provide the optimized version while maintaining the original meaning and professional tone.
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert. Optimize text for search engines while maintaining readability and professionalism."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.5,
    })

    return completion.choices[0].message.content
  } catch (error) {
    console.error('SEO optimization error:', error)
    return text
  }
}