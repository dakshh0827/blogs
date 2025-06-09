import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface FeaturedProps {
  image: string
  title: string
  description: string
  readMoreLink: string
  alt?: string
}

const Featured: React.FC<FeaturedProps> = ({
  image,
  title,
  description,
  readMoreLink,
  alt = "Featured image"
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        {/* Left: Image - Removed padding */}
        <div className="w-full md:w-2/5 flex-shrink-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={image}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>

        {/* Right: Content */}
        <div className="w-full md:w-3/5 space-y-4">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            {title}
          </h2>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>

          {/* Read More Link */}
          <div className="pt-2">
            <Link
              href={readMoreLink}
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium underline"
            >
              Read More
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Featured
