import React, { useState } from 'react'
import { Search, MessageCircle, Book, Mail, Phone, ChevronDown, ChevronRight } from 'lucide-react'

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const faqs = [
    {
      id: 1,
      question: 'How do I create my first portfolio?',
      answer: 'Getting started is easy! Simply sign up for an account, choose a template from our marketplace, and use our drag-and-drop editor to customize it with your content. You can also use our AI generator to create content automatically.'
    },
    {
      id: 2,
      question: 'Can I use my own domain name?',
      answer: 'Yes! With our Pro and Enterprise plans, you can connect your custom domain. Go to Settings > Domain and follow the instructions to set up your custom domain.'
    },
    {
      id: 3,
      question: 'How does the AI content generator work?',
      answer: 'Our AI generator analyzes your input (skills, experience, projects) and creates professional content for your portfolio including bio, project descriptions, and skill assessments. You can customize the tone and regenerate content as needed.'
    },
    {
      id: 4,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express) through Stripe. All payments are secure and encrypted.'
    },
    {
      id: 5,
      question: 'Can I collaborate with others on my portfolio?',
      answer: 'Yes! Our collaboration features allow you to invite team members to review and edit your portfolio in real-time. You can set different permission levels for each collaborator.'
    },
    {
      id: 6,
      question: 'How do I export my portfolio?',
      answer: 'You can export your portfolio as a PDF or publish it to the web with a custom URL. Premium users can also download the source code.'
    }
  ]

  const supportOptions = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: <MessageCircle className="h-6 w-6" />,
      action: 'Start Chat',
      available: 'Available 24/7'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: <Mail className="h-6 w-6" />,
      action: 'Send Email',
      available: 'Response within 24h'
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our team',
      icon: <Phone className="h-6 w-6" />,
      action: 'Call Now',
      available: 'Mon-Fri 9AM-6PM EST'
    }
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-xl text-primary-100 mb-8">
            Find answers to common questions or get in touch with our support team
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Book className="h-6 w-6 mr-3 text-primary-600" />
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedFaq === faq.id ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFaqs.length === 0 && searchQuery && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No results found for "{searchQuery}"</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Try different keywords or contact our support team
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Support Options */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need More Help?</h3>
              <div className="space-y-4">
                {supportOptions.map((option, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-200 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="text-primary-600 mt-1">
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{option.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                        <p className="text-xs text-gray-500 mt-2">{option.available}</p>
                        <button className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700">
                          {option.action}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="/templates" className="block text-sm text-primary-600 hover:text-primary-700">
                  Browse Templates
                </a>
                <a href="/ai-generator" className="block text-sm text-primary-600 hover:text-primary-700">
                  AI Portfolio Generator
                </a>
                <a href="/pricing" className="block text-sm text-primary-600 hover:text-primary-700">
                  Pricing Plans
                </a>
                <a href="/dashboard" className="block text-sm text-primary-600 hover:text-primary-700">
                  Dashboard
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-6 border border-primary-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Still need help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is here to help you succeed with your portfolio.
              </p>
              <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpPage
