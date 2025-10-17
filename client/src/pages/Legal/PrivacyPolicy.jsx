import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Database, Bell, Globe, CheckCircle } from 'lucide-react'

const PrivacyPolicy = () => {
  const sections = [
    {
      title: 'Information We Collect',
      icon: <Database className="h-6 w-6" />,
      content: 'We collect information you provide directly to us, including your name, email address, password, portfolio content, and payment information. We also automatically collect certain information about your device when you use our services, including IP address, browser type, and usage data.'
    },
    {
      title: 'How We Use Your Information',
      icon: <Eye className="h-6 w-6" />,
      content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, respond to your comments and questions, and communicate with you about products, services, and events.'
    },
    {
      title: 'Information Sharing',
      icon: <Globe className="h-6 w-6" />,
      content: 'We do not sell your personal information. We may share your information with third-party service providers who perform services on our behalf, such as payment processing and data analysis. We may also share information when required by law or to protect our rights.'
    },
    {
      title: 'Data Security',
      icon: <Lock className="h-6 w-6" />,
      content: 'We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. We use SSL encryption for data transmission and store passwords using industry-standard hashing algorithms.'
    },
    {
      title: 'Cookies and Tracking',
      icon: <Bell className="h-6 w-6" />,
      content: 'We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings. We use analytics services like Google Analytics to understand how users interact with our service.'
    },
    {
      title: 'Your Rights',
      icon: <Shield className="h-6 w-6" />,
      content: 'You have the right to access, update, or delete your personal information at any time. You can manage your account settings, export your data, or request account deletion. You also have the right to opt-out of marketing communications and certain data collection practices.'
    },
    {
      title: 'Data Retention',
      icon: <Database className="h-6 w-6" />,
      content: 'We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law. When you delete your account, we will delete or anonymize your personal information within 90 days.'
    },
    {
      title: 'Children\'s Privacy',
      icon: <Shield className="h-6 w-6" />,
      content: 'Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.'
    },
    {
      title: 'International Data Transfers',
      icon: <Globe className="h-6 w-6" />,
      content: 'Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy.'
    },
    {
      title: 'Changes to This Policy',
      icon: <Bell className="h-6 w-6" />,
      content: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.'
    },
    {
      title: 'Contact Us',
      icon: <Mail className="h-6 w-6" />,
      content: 'If you have any questions about this Privacy Policy, please contact us at privacy@efolio.com or through our contact page. We will respond to your inquiry within 30 days.'
    }
  ]

  const dataTypes = [
    { name: 'Account Information', description: 'Name, email, password' },
    { name: 'Portfolio Content', description: 'Projects, images, descriptions' },
    { name: 'Usage Data', description: 'Analytics, preferences, activity' },
    { name: 'Payment Information', description: 'Billing details (encrypted)' },
    { name: 'Device Information', description: 'IP address, browser, OS' },
    { name: 'Communication Data', description: 'Support messages, feedback' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-primary-900 to-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Your Privacy Matters</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Last updated: January 2025
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We respect your privacy and are committed to protecting your personal data.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Overview */}
        <motion.div
          className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-8 mb-12 border border-primary-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            This Privacy Policy describes how E-Folio collects, uses, and shares your personal information when you use our portfolio building platform. We are committed to transparency and giving you control over your data.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {dataTypes.map((type, index) => (
              <div key={index} className="flex items-start gap-3 bg-white/80 rounded-lg p-4">
                <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{type.name}</h4>
                  <p className="text-gray-600 text-xs">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="p-2 bg-primary-50 rounded-lg text-primary-600 mr-3">
                  {section.icon}
                </div>
                {section.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* GDPR & CCPA Compliance */}
        <motion.div
          className="mt-12 bg-gray-50 rounded-xl p-8 border border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Compliance & Standards</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">GDPR Compliance</h4>
              <p className="text-gray-600 text-sm">
                We comply with the General Data Protection Regulation (GDPR) for users in the European Union, ensuring your rights to access, rectification, and erasure of personal data.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">CCPA Compliance</h4>
              <p className="text-gray-600 text-sm">
                California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information is collected and sold.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          className="mt-16 pt-8 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lock className="h-4 w-4" />
              <span>Your data is encrypted and secure</span>
            </div>
            <div className="flex gap-4">
              <Link
                to="/terms"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Terms of Service
              </Link>
              <Link
                to="/contact"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const Mail = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

export default PrivacyPolicy
