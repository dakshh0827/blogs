import React from 'react'
import Image from 'next/image'

interface BlogHeaderProps {
  title: string
  author: string
  date: string
  authorImage?: string
  blogImage?: string
}

const PostPageTopContainer: React.FC<BlogHeaderProps> = ({
  title,
  author,
  date,
  authorImage,
  blogImage,
}) => (
  <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-6 md:gap-8 py-8 mt-4">
    {/* Left: Title & User */}
    <div className="w-full md:w-1/2 flex flex-col justify-center">
      <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 bg-opacity-70 p-2 rounded-lg inline-block w-fit">
        {title}
      </h1>
      <div className="flex items-center gap-4 mt-4">
        {authorImage && (
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={authorImage}
              alt={author}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-foreground">{author}</p>
          <p className="text-xs text-muted-foreground">{date.substring(0, 10)}</p>
        </div>
      </div>
    </div>

    {/* Right: Blog Image */}
    {blogImage && (
      <div className="w-full md:w-1/2">
        <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden">
          <Image src={blogImage} alt={title} fill className="object-cover" />
        </div>
      </div>
    )}
  </div>
)

export default PostPageTopContainer
