import React from 'react'

const About = () => {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About E-Folio</h1>
          <p className="text-xl text-gray-600 mb-12">
            We're on a mission to help professionals showcase their work in the most beautiful way possible.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <p>
            E-Folio was born from a simple idea: everyone deserves a beautiful, professional portfolio 
            that truly represents their work and skills. Whether you're a designer, developer, writer, 
            or any kind of creative professional, your portfolio should be as unique as you are.
          </p>

          <h2>Our Mission</h2>
          <p>
            We believe that creating a stunning portfolio shouldn't require coding skills or design 
            expertise. That's why we've built an intuitive platform that empowers anyone to create 
            a professional portfolio that stands out.
          </p>

          <h2>What Makes Us Different</h2>
          <ul>
            <li>No coding required - drag and drop interface</li>
            <li>AI-powered content suggestions</li>
            <li>Real-time collaboration features</li>
            <li>Mobile-optimized templates</li>
            <li>Built-in analytics to track your portfolio's performance</li>
          </ul>

          <h2>Join Our Community</h2>
          <p>
            Thousands of professionals trust E-Folio to showcase their work. Join us today and 
            start building the portfolio you deserve.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About