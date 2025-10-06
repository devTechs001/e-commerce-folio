import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Zap, 
  Palette, 
  BarChart3, 
  Users, 
  Globe, 
  Shield,
  Code,
  Smartphone,
  Rocket,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button/Button'

const Features = () => {
  const { user } = useAuth()

  const mainFeatures = [
    {
      icon: <Palette className="h-12 w-12" />,
      title: 'Beautiful Templates',
      description: 'Choose from dozens of professionally designed templates that are fully customizable to match your brand.',
      features: ['50+ Templates', 'Mobile Optimized', 'Custom Colors', 'Font Selection']
    },
    {
      icon: <Zap className="h-12 w-12" />,
      title: 'AI-Powered Content',
      description: 'Let our AI help you write compelling content, optimize for SEO, and suggest improvements.',
      features: ['Content Generation', 'SEO Optimization', 'Grammar Check', 'Style Suggestions']
    },
    {
      icon: <Code className="h-12 w-12" />,
      title: 'No-Code Builder',
      description: 'Drag and drop interface makes it easy to create stunning portfolios without any technical skills.',
      features: ['Drag & Drop', 'Live Preview', 'Component Library', 'Undo/Redo']
    },
    {
      icon: <BarChart3 className="h-12 w-12" />,
      title: 'Advanced Analytics',
      description: 'Track your portfolio performance with detailed analytics and visitor insights.',
      features: ['Visitor Tracking', 'Traffic Sources', 'Engagement Metrics', 'Conversion Tracking']
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: 'Team Collaboration',
      description: 'Invite team members to collaborate on your portfolio and get feedback in real-time.',
      features: ['Real-time Editing', 'Comment System', 'Version History', 'Role Management']
    },
    {
      icon: <Globe className="h-12 w-12" />,
      title: 'Custom Domains',
      description: 'Use your own domain name and customize every aspect of your portfolio.',
      features: ['Custom Domain', 'SSL Certificate', 'DNS Management', 'Brand Removal']
    }
  ]

  const technicalFeatures = [
    {
      category: 'Performance',
      features: [
        'Global CDN Delivery',
        'Automatic Image Optimization',
        'Lazy Loading',
        'Code Splitting'
      ]
    },
    {
      category: 'Security',
      features: [
        'SSL Certificates',
        'DDoS Protection',
        'Regular Backups',
        'GDPR Compliance'
      ]
    },
    {
      category: 'Integrations',
      features: [
        'Google Analytics',
        'Social Media',
        'Email Marketing',
        'CRM Systems'
      ]
    }
  ]

  const pricingComparison = [
    {
      feature: 'Number of Portfolios',
      free: '1',
      pro: '5',
      enterprise: 'Unlimited'
    },
    {
      feature: 'Custom Domain',
      free: 'No',
      pro: 'Yes',
      enterprise: 'Yes'
    },
    {
      feature: 'AI Content Generation',
      free: 'Limited',
      pro: 'Unlimited',
      enterprise: 'Unlimited'
    },
    {
      feature: 'Team Members',
      free: '1',
      pro: '3',
      enterprise: 'Unlimited'
    },
    {
      feature: 'Storage Space',
      free: '500MB',
      pro: '10GB',
      enterprise: '100GB'
    },
    {
      feature: 'Advanced Analytics',
      free: 'Basic',
      pro: 'Advanced',
      enterprise: 'Enterprise'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-primary-900 to-blue-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Powerful Features for 
              <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent"> Modern Portfolios</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Everything you need to create, manage, and grow your professional portfolio in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-white text-gray-900 px-8 py-4 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-primary-500 to-blue-500 text-white px-8 py-4 text-lg font-semibold rounded-xl hover:from-primary-600 hover:to-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center"
                  >
                    Start Free Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/templates"
                    className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300"
                  >
                    Browse Templates
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From stunning designs to powerful analytics, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl hover:border-primary-200 transition-all duration-300 group"
              >
                <div className="text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enterprise-grade infrastructure for maximum performance and reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {technicalFeatures.map((section, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-gray-200">
                <div className="flex items-center mb-6">
                  {section.category === 'Performance' && <Rocket className="h-6 w-6 text-blue-600 mr-3" />}
                  {section.category === 'Security' && <Shield className="h-6 w-6 text-green-600 mr-3" />}
                  {section.category === 'Integrations' && <Code className="h-6 w-6 text-purple-600 mr-3" />}
                  <h3 className="text-xl font-semibold text-gray-900">{section.category}</h3>
                </div>
                <ul className="space-y-3">
                  {section.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Compare Plans & Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your needs.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Free</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Professional</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pricingComparison.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{row.free}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{row.pro}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/pricing"
              className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center"
            >
              See detailed pricing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Perfect on Every Device
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Your portfolio will look amazing on desktops, tablets, and mobile devices. 
                Our templates are fully responsive and optimized for all screen sizes.
              </p>
              <div className="space-y-4">
                {[
                  'Responsive Design',
                  'Touch-Optimized Interface',
                  'Fast Mobile Performance',
                  'Offline Capabilities'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Smartphone className="h-5 w-5 text-primary-600 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="bg-gray-800 rounded p-6 text-white">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                      <div className="h-20 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of professionals who have already created their dream portfolios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user && (
              <Link
                to="/register"
                className="bg-white text-primary-600 px-8 py-4 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center"
              >
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            )}
            <Link
              to="/templates"
              className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-xl hover:bg-white hover:text-primary-600 transition-all duration-300"
            >
              Browse Templates
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Features