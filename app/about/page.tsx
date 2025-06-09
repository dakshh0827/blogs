import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

const topContent = `blogs is a minimalist blogging platform I built in June 2025, during a phase when I was diving deep into Next.js and looking to sharpen my full-stack development skills. As a student of Computer Science and someone who learns best by building, I needed a project that was both practical and meaningful, and that's how blogs came to life. 
 — (by the way you'll be thinking what this image is doing in the about section, it's because i like this pic and i took it myselff!)`

const bottomContent = `I had just started learning the ins and outs of Next.js, particularly its powerful App Router, server-side rendering capabilities, and file-based routing system. While tutorials were helpful, I wanted to take it a step further by building something end-to-end — something real. This app became that space. A platform where users can write, share, and discover thoughts in a clean, distraction-free environment.

Under the hood, blogs is powered by a modern tech stack: Next.js for the frontend and backend logic, MongoDB as the database, Prisma as the ORM to manage data, and Tailwind CSS for styling the UI. It's lightweight, responsive, and designed with user experience in mind. Every part of this project helped me understand not just how to connect the dots in a full-stack app, but also how to keep things clean, scalable, and easy to use.

The platform is public — anyone can create an account, publish blogs, and interact with others' content. However, the codebase itself remains private, as this project is currently meant for personal learning and demonstration purposes. Still, I've made sure it feels professional and polished enough to be used in the real world.

Beyond the tech, this project helped me understand the developer mindset better — how important it is to break down features, debug patiently, and iterate based on real usage. Building blogs taught me a lot more than any course could — from handling form submissions to managing server responses, database errors, and layout edge cases.

If you're reading this, thank you for checking out my work. I'm Daksh Thakran, a developer who's still learning, still building, and always curious. You can explore more of my projects on my GitHub:`

const page = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Left: Image */}
        <div className="w-full md:w-2/5 flex-shrink-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden shadow-lg">
            <Image
              src={"/featured.jpg"}
              alt="About blogs platform"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
          </div>
        </div>

        {/* Right: Content */}
        <div className="w-full md:w-3/5 space-y-6">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            About blogs
          </h1>

          {/* Description */}
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg whitespace-pre-line">
              {topContent}
            </p>
          </div>
        </div>
      </div>
      
      <div className='mt-8'>
        <p className="text-muted-foreground leading-relaxed text-base md:text-lg whitespace-pre-line">
          {bottomContent}
        </p>
        
        {/* GitHub Link */}
        <div>
          <Link 
            href="https://github.com/dakshh0827" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            🔗 https://github.com/dakshh0827
            <svg 
              className="w-4 h-4 ml-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
              />
            </svg>
          </Link>
        </div>
        
        <p className="text-muted-foreground leading-relaxed text-base md:text-lg mt-4">
          This is just the beginning. I have plans to evolve blogs — maybe with user profiles, richer editing tools, filtering options, and more. But for now, I'm proud of this simple platform that reflects both where I am and where I'm going.
        </p>
        
        <p className="text-muted-foreground leading-relaxed text-base md:text-lg mt-4 font-medium">
          Let's keep building.
        </p>
      </div>
    </div>
  )
}

export default page
