import React from 'react'
import Featured from '@/components/Featured'
import Title from '@/components/Title'
import CategoryList from '@/components/CategoryList'
import MenuList from '@/components/MenuList.server'
import CardList from '@/components/CardList'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const page = parseInt(params.page || '1') || 1
  
  return (
    <main>
      <Title />
      <Featured
        image="/featured.jpg"
        title="blogs, how it came to life and what it is all about"
        description="blogs is a blogging platform I built in June 2025, during a phase when I was diving deep into Next.js and looking to sharpen my full-stack development skills. As a student of Computer Science and someone who learns best by building, I needed a project that was both practical and meaningful, and that's how blogs came to life.
                      — (by the way you'll be thinking what this image is doing in the about section, it's because i like this pic and i took it myselff!)"
        readMoreLink="/about"
      />
      <CategoryList />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 py-8">
              {/* CardList - 7/9 width */}
              <div className="w-full lg:w-6/9 flex-shrink-0">
                <CardList page={page} cate={""}/>
              </div>
             
              {/* MenuList - 2/9 width */}
              <div className="w-full lg:w-3/9">
                <MenuList />
              </div>
            </div>
          </div>
    </main>
  )
}

export default page