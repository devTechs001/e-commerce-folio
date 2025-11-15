import React, { useState } from 'react'
import { Wand2, Copy, RefreshCw, Download } from 'lucide-react'
import Button from '../../common/Button/Button'
import Textarea from "../../common/Form/TextArea";

const ContentGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [tone, setTone] = useState('professional')

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'creative', label: 'Creative' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'technical', label: 'Technical' }
  ]

  const generateContent = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    
    // Simulate AI content generation
    setTimeout(() => {
      const sampleContent = `As a passionate ${prompt.toLowerCase()} with over 5 years of experience, I specialize in creating innovative solutions that drive business growth. My expertise spans multiple technologies and frameworks, allowing me to deliver robust, scalable applications that exceed client expectations.

I believe in continuous learning and staying updated with the latest industry trends. My approach combines technical excellence with creative problem-solving to deliver outstanding results.`
      
      setGeneratedContent(sampleContent)
      setIsGenerating(false)
    }, 2000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent)
  }

  const regenerateContent = () => {
    generateContent()
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Content Generator</h3>
          <p className="text-sm text-gray-500">Generate professional content for your portfolio</p>
        </div>
        <Wand2 className="h-6 w-6 text-primary-600" />
      </div>

      {/* Input Section */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What do you want to write about?
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., web developer, graphic designer, marketing specialist..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            {toneOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="primary"
          onClick={generateContent}
          loading={isGenerating}
          disabled={!prompt.trim()}
          icon={Wand2}
          className="w-full"
        >
          {isGenerating ? 'Generating...' : 'Generate Content'}
        </Button>
      </div>

      {/* Generated Content */}
      {generatedContent && (
        <div className="border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h4 className="font-medium text-gray-900">Generated Content</h4>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                icon={Copy}
                onClick={copyToClipboard}
              >
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={RefreshCw}
                onClick={regenerateContent}
              >
                Regenerate
              </Button>
            </div>
          </div>
          
          <div className="p-4">
            <Textarea
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">
                {generatedContent.length} characters
              </span>
              <Button
                variant="outline"
                size="sm"
                icon={Download}
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Prompts */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Prompts</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            'Professional bio for software engineer',
            'Project description for web app',
            'Skills section introduction',
            'About me paragraph'
          ].map((quickPrompt, index) => (
            <button
              key={index}
              onClick={() => setPrompt(quickPrompt)}
              className="text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <span className="text-sm text-gray-700">{quickPrompt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ContentGenerator