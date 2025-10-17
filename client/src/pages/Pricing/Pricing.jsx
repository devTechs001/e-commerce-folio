import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Star, Zap, Crown, HelpCircle, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext.jsx'
import Button from '../../components/common/Button/Button'

const Pricing = () => {
  const { user } = useAuth()
  const [billingPeriod, setBillingPeriod] = useState('monthly')

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      price: { monthly: 0, yearly: 0 },
      popular: false,
      features: [
        '1 Portfolio',
        'Basic Templates',
        'Standard Support',
        'Basic Analytics',
        '500MB Storage',
        'E-Folio Branding'
      ],
      limitations: {
        portfolios: 1,
        collaborators: 0,
        customDomain: false,
        advancedAnalytics: false,
        aiFeatures: false
      },
      cta: user ? 'Current Plan' : 'Get Started Free',
      href: user ? '/dashboard' : '/register'
    },
    {
      name: 'Professional',
      description: 'For serious professionals',
      price: { monthly: 19, yearly: 190 },
      popular: true,
      features: [
        '5 Portfolios',
        'All Templates',
        'Priority Support',
        'Advanced Analytics',
        '10GB Storage',
        'Custom Domain',
        'Team Collaboration (3 members)',
        'AI Content Generation',
        'No Branding'
      ],
      limitations: {
        portfolios: 5,
        collaborators: 3,
        customDomain: true,
        advancedAnalytics: true,
        aiFeatures: true
      },
      cta: 'Upgrade to Pro',
      href: user ? '/dashboard?upgrade=pro' : '/register'
    },
    {
      name: 'Enterprise',
      description: 'For teams and agencies',
      price: { monthly: 49, yearly: 490 },
      popular: false,
      features: [
        'Unlimited Portfolios',
        'All Templates + Custom',
        '24/7 Support',
        'Advanced Analytics',
        '100GB Storage',
        'Multiple Custom Domains',
        'Unlimited Collaboration',
        'AI Content Generation',
        'White-label Options',
        'API Access',
        'Custom Development'
      ],
      limitations: {
        portfolios: -1,
        collaborators: -1,
        customDomain: true,
        advancedAnalytics: true,
        aiFeatures: true
      },
      cta: 'Contact Sales',
      href: '/contact'
    }
  ]

  const savings = {
    professional: 20,
    enterprise: 17
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">Special offer: Get 20% off yearly plans</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Simple, <span className="text-primary-600">Transparent</span> Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your needs. All plans include our core features with no hidden fees.
          </p>

          {/* Billing Toggle */}
          <motion.div 
            className="inline-flex items-center bg-white rounded-xl p-1.5 border border-gray-200 shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                billingPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                billingPeriod === 'yearly'
                  ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>Yearly</span>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                Save {savings.professional}%
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative bg-white rounded-2xl border-2 transition-all duration-300 ${
                plan.popular
                  ? 'border-primary-500 shadow-2xl scale-105'
                  : 'border-gray-200 shadow-lg hover:border-primary-300 hover:shadow-xl'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <motion.div 
                    className="bg-gradient-to-r from-primary-500 to-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center shadow-lg"
                    animate={{ 
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    Most Popular
                  </motion.div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-2">
                    {plan.name === 'Professional' && <Zap className="h-5 w-5 text-yellow-500 mr-2" />}
                    {plan.name === 'Enterprise' && <Crown className="h-5 w-5 text-purple-500 mr-2" />}
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      ${billingPeriod === 'yearly' ? plan.price.yearly : plan.price.monthly}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-gray-600 ml-2">
                        /{billingPeriod === 'yearly' ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {billingPeriod === 'yearly' && plan.price.monthly > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      ${plan.price.monthly}/month billed annually
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <div className="mb-8">
                  <Link
                    to={plan.href}
                    className={`group inline-flex items-center justify-center w-full py-3 px-6 text-sm font-medium rounded-lg transition-all duration-200 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:from-primary-700 hover:to-blue-700 shadow-lg hover:shadow-xl' 
                        : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Features */}
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div 
          className="max-w-4xl mx-auto mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Compare <span className="text-primary-600">All Features</span>
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-700">Number of Portfolios</td>
                  {plans.map((plan) => (
                    <td key={plan.name} className="px-6 py-4 text-center text-sm text-gray-900">
                      {plan.limitations.portfolios === -1 ? 'Unlimited' : plan.limitations.portfolios}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-700">Team Collaborators</td>
                  {plans.map((plan) => (
                    <td key={plan.name} className="px-6 py-4 text-center text-sm text-gray-900">
                      {plan.limitations.collaborators === -1 ? 'Unlimited' : plan.limitations.collaborators}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-700">Custom Domain</td>
                  {plans.map((plan) => (
                    <td key={plan.name} className="px-6 py-4 text-center">
                      {plan.limitations.customDomain ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-700">Advanced Analytics</td>
                  {plans.map((plan) => (
                    <td key={plan.name} className="px-6 py-4 text-center">
                      {plan.limitations.advancedAnalytics ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-700">AI Features</td>
                  {plans.map((plan) => (
                    <td key={plan.name} className="px-6 py-4 text-center">
                      {plan.limitations.aiFeatures ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="max-w-4xl mx-auto mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked <span className="text-primary-600">Questions</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: "Can I change plans later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "Is there a free trial?",
                answer: "Our Free plan is always free. For paid plans, we offer a 14-day free trial with full features."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
              },
              {
                question: "Can I cancel anytime?",
                answer: "Yes, you can cancel your subscription at any time. No long-term contracts required."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <HelpCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Join thousands of professionals who trust E-Folio to showcase their work and advance their careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={user ? '/dashboard' : '/register'}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 bg-white text-primary-600 hover:bg-gray-50 shadow-lg hover:shadow-xl"
              >
                {user ? 'Go to Dashboard' : 'Start Free Today'}
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 border border-white text-white hover:bg-white/10"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing