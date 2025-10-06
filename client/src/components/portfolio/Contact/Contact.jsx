import React, { useState } from 'react'
import { Mail, Phone, MapPin, Globe, Send } from 'lucide-react'
import Button from '../../common/Button/Button'
import Input from '../../common/Form/Input'
import Textarea from '../../common/Form/Textarea'

const Contact = ({ data = {}, editable = false, onChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Contact form submitted:', formData)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const contactInfo = [
    { icon: Mail, label: 'Email', value: data.email },
    { icon: Phone, label: 'Phone', value: data.phone },
    { icon: MapPin, label: 'Location', value: data.location },
    { icon: Globe, label: 'Website', value: data.website }
  ].filter(item => item.value)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-4">
            {contactInfo.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="flex items-center text-gray-600">
                  <Icon className="h-5 w-5 mr-3 text-primary-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{item.label}</p>
                    {item.label === 'Email' || item.label === 'Website' ? (
                      <a 
                        href={item.label === 'Email' ? `mailto:${item.value}` : item.value}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p>{item.value}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <Input
              label="Subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              required
            />
            <Textarea
              label="Message"
              rows={4}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="primary"
              icon={Send}
              className="w-full"
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact