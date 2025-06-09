import React from 'react'
import ContactForm from '@/components/ContactForm'

const ContactPage = () => {
  return (
    <div className="bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            CONTACT
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Is there something on your mind you&#39;d like to talk about? Whether it&#39;s related to work, just a casual conversation or need help with some code. Feel free to contact me at anytime.
          </p>
        </div>

        {/* Contact Form */}
        <ContactForm />
      </div>
    </div>
  )
}

export default ContactPage
