import React, { useState } from 'react'
import { 
  Search, HelpCircle, MessageCircle, Mail, Phone, BookOpen, 
  Video, FileText, ChevronDown, ChevronRight, ExternalLink,
  Clock, CheckCircle, Zap, Shield, Users, Settings
} from 'lucide-react'
import Button from '../../components/common/Button/Button'

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // FAQ Categories and Questions
  const faqCategories = [
    { id: 'all', name: 'All Topics', icon: BookOpen },
    { id: 'getting-started', name: 'Getting Started', icon: Zap },
    { id: 'account', name: 'Account & Billing', icon: Settings },
    { id: 'portfolios', name: 'Portfolios', icon: FileText },
    { id: 'payments', name: 'Payments', icon: Shield },
    { id: 'features', name: 'Features', icon: CheckCircle }
  ]

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I create my first portfolio?',
      answer: 'Creating your first portfolio is easy! Navigate to your dashboard and click on "Create Portfolio". You can either start from scratch or use one of our professionally designed templates. Follow the step-by-step wizard to add your content, customize the design, and publish when ready.'
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'Can I use AI to generate my portfolio?',
      answer: 'Yes! Our AI Portfolio Builder can create a complete portfolio for you. Just provide some basic information about yourself, your skills, and experience. The AI will generate professional content, suggest layouts, and even optimize for SEO. You can then customize everything to match your style.'
    },
    {
      id: 3,
      category: 'account',
      question: 'How do I upgrade to Premium?',
      answer: 'To upgrade to Premium, go to your Account Settings and click on "Upgrade Plan". Choose between Professional ($19/month) or Enterprise ($49/month) plans. We accept payments via Stripe, PayPal, and M-Pesa. You\'ll get instant access to all premium features once payment is confirmed.'
    },
    {
      id: 4,
      category: 'account',
      question: 'What payment methods do you accept?',
      answer: 'We accept multiple payment methods including: Credit/Debit Cards (via Stripe), PayPal, and M-Pesa (for Kenya). All payments are secure and encrypted. You can manage your payment methods in your billing settings.'
    },
    {
      id: 5,
      category: 'portfolios',
      question: 'Can I have multiple portfolios?',
      answer: 'Free users can create 1 portfolio. Professional plan users get up to 5 portfolios, and Enterprise users get unlimited portfolios. This is perfect if you want different portfolios for different purposes or clients.'
    },
    {
      id: 6,
      category: 'portfolios',
      question: 'How do I customize my portfolio design?',
      answer: 'You can customize your portfolio in the Portfolio Editor. Change colors, fonts, layouts, add/remove sections, upload images, and more. Premium users get access to advanced customization including custom CSS, animations, and premium themes.'
    },
    {
      id: 7,
      category: 'portfolios',
      question: 'Can I use my own domain?',
      answer: 'Yes! Premium users can connect their own custom domain. Go to Portfolio Settings > Domain and follow the instructions to connect your domain. We provide detailed documentation on setting up DNS records.'
    },
    {
      id: 8,
      category: 'payments',
      question: 'Is there a money-back guarantee?',
      answer: 'Absolutely! We offer a 30-day money-back guarantee on all plans. If you\'re not satisfied for any reason within the first 30 days, contact support for a full refund - no questions asked.'
    },
    {
      id: 9,
      category: 'payments',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription anytime from your billing settings. Your account will remain active until the end of your current billing period. There are no cancellation fees.'
    },
    {
      id: 10,
      category: 'features',
      question: 'What analytics are included?',
      answer: 'All users get basic analytics. Premium users get advanced analytics including: visitor demographics, traffic sources, real-time visitor tracking, conversion rates, and detailed engagement metrics. You can export all analytics data.'
    },
    {
      id: 11,
      category: 'features',
      question: 'How does the Freelancing Hub work?',
      answer: 'The Freelancing Hub connects you with clients and job opportunities. Create your freelancer profile, browse jobs, submit proposals, and manage projects all in one place. Premium users get advanced features like direct messaging and auto-apply.'
    },
    {
      id: 12,
      category: 'features',
      question: 'What integrations are available?',
      answer: 'We integrate with 15+ popular services including: Google Analytics, Mailchimp, Slack, GitHub, Figma, and more. Free users get basic integrations, while Premium users get access to all integrations including custom API access.'
    }
  ]

  // Support Channels
  const supportChannels = [
    {
      id: 'chat',
      name: 'Live Chat',
      description: 'Chat with our support team',
      icon: MessageCircle,
      availability: 'Mon-Fri, 9AM-6PM EST',
      color: 'blue',
      action: 'Start Chat'
    },
    {
      id: 'email',
      name: 'Email Support',
      description: 'Get help via email',
      icon: Mail,
      availability: '24/7 - Response within 24h',
      color: 'green',
      action: 'Send Email'
    },
    {
      id: 'phone',
      name: 'Phone Support',
      description: 'Talk to an expert',
      icon: Phone,
      availability: 'Premium users only',
      color: 'purple',
      action: 'Call Now'
    }
  ]

  // Quick Links
  const quickLinks = [
    { icon: Video, title: 'Video Tutorials', description: 'Step-by-step video guides', link: '/tutorials' },
    { icon: FileText, title: 'Documentation', description: 'Detailed product documentation', link: '/docs' },
    { icon: BookOpen, title: 'Blog & Guides', description: 'Tips, tricks, and best practices', link: '/blog' },
    { icon: Users, title: 'Community Forum', description: 'Connect with other users', link: '/community' }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  const getChannelColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white px-6 py-3 rounded-full mb-4">
            <HelpCircle className="h-5 w-5" />
            <span className="font-semibold">Help Center</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How can we help you today?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search our knowledge base or contact support for personalized assistance
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles, guides, or FAQs..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-lg"
            />
          </div>
        </div>

        {/* Support Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {supportChannels.map((channel) => {
            const Icon = channel.icon
            return (
              <div
                key={channel.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getChannelColor(channel.color)} flex items-center justify-center mb-4`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{channel.name}</h3>
                <p className="text-gray-600 mb-3">{channel.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{channel.availability}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  {channel.action}
                </Button>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {faqCategories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              )
            })}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No results found. Try a different search or category.</p>
              </div>
            ) : (
              filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary-300 transition-colors"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                    {expandedFAQ === faq.id ? (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-4 pb-4 pt-0 text-gray-600 border-t border-gray-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => {
            const Icon = link.icon
            return (
              <a
                key={index}
                href={link.link}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group"
              >
                <Icon className="h-8 w-8 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                  {link.title}
                  <ExternalLink className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-gray-600">{link.description}</p>
              </a>
            )
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Our support team is here to help. Contact us via live chat, email, or phone,
            and we'll get back to you as soon as possible.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="white" size="lg" icon={MessageCircle}>
              Start Live Chat
            </Button>
            <Button variant="outline" size="lg" icon={Mail} className="text-white border-white hover:bg-white hover:text-primary-600">
              Email Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpCenter
