import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Shield, AlertCircle, CheckCircle } from 'lucide-react'

const TermsOfService = () => {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using E-Folio, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'
    },
    {
      title: '2. Use License',
      content: 'Permission is granted to temporarily download one copy of the materials (information or software) on E-Folio for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.'
    },
    {
      title: '3. User Account',
      content: 'You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password. E-Folio reserves the right to refuse service, terminate accounts, or remove content at our sole discretion.'
    },
    {
      title: '4. Portfolio Content',
      content: 'You retain all rights to the content you upload to your portfolio. By uploading content, you grant E-Folio a worldwide, non-exclusive license to use, reproduce, and display your content solely for the purpose of providing our services.'
    },
    {
      title: '5. Prohibited Uses',
      content: 'You may not use our service: (a) for any unlawful purpose; (b) to solicit others to perform unlawful acts; (c) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances; (d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others.'
    },
    {
      title: '6. Subscription and Billing',
      content: 'Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis. Billing cycles are set on a monthly or annual basis. At the end of each billing cycle, your subscription will automatically renew unless you cancel it.'
    },
    {
      title: '7. Refund Policy',
      content: 'We offer a 14-day money-back guarantee for all paid plans. If you are not satisfied with our service, you can request a full refund within 14 days of your initial purchase. Refunds are not available for renewal subscriptions.'
    },
    {
      title: '8. Intellectual Property',
      content: 'The service and its original content, features, and functionality are and will remain the exclusive property of E-Folio. Our trademarks and trade dress may not be used in connection with any product or service without prior written consent.'
    },
    {
      title: '9. Termination',
      content: 'We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.'
    },
    {
      title: '10. Limitation of Liability',
      content: 'In no event shall E-Folio, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.'
    },
    {
      title: '11. Changes to Terms',
      content: 'We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.'
    },
    {
      title: '12. Contact Information',
      content: 'If you have any questions about these Terms, please contact us at legal@efolio.com or through our contact page.'
    }
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
              <FileText className="h-4 w-4" />
              <span className="text-sm">Legal Document</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Last updated: January 2025
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Please read these terms carefully before using our services.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Important Notice */}
        <motion.div
          className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg mb-12"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Important Notice</h3>
              <p className="text-amber-800 text-sm leading-relaxed">
                By using E-Folio, you agree to these terms of service. If you don't agree with any part of these terms, you may not access the service.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Terms Sections */}
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
                <CheckCircle className="h-6 w-6 text-primary-600 mr-3" />
                {section.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer Links */}
        <motion.div
          className="mt-16 pt-8 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Your privacy is important to us</span>
            </div>
            <div className="flex gap-4">
              <Link
                to="/privacy"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Privacy Policy
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

export default TermsOfService
