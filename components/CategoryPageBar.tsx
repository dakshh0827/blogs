import React from 'react'

interface CategoryBarProps {
  label: string
  backgroundColor: string
  textColor?: string
}

const CategoryPageBar: React.FC<CategoryBarProps> = ({
  label,
  backgroundColor,
  textColor = '#fff',
}) => {
  return (
    <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div
        className="text-center font-bold text-xl md:text-2xl"
        style={{
          backgroundColor,
          color: textColor,
          padding: '0.75rem 0', // Height unchanged
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </div>
    </div>
  )
}

export default CategoryPageBar
