import React from 'react'

const Title: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-left py-8 md:py-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight text-foreground">
          <span className="font-bold">Hey! Welcome to blogs.</span>{' '}
          <span className="font-semibold">Discover stories and create ideas.</span>
        </h1>
      </div>
    </div>
  )
}

export default Title
