import React from 'react'
import CategoryBar from '@/components/CategoryPageBar'
import CardList from '@/components/CardList';
import MenuList from '@/components/MenuList';

const categoryStyles: Record<string, { background: string; color: string }> = {
  style: { background: '#F47C3C', color: '#fff' },
}

interface PageProps {
  searchParams: {
    page?: string;
    cate?: string;
    [key: string]: string | undefined;
  };
}

const page = ({ searchParams }: PageProps) => {
  const page = parseInt(searchParams.page || '1') || 1;
  const { cate } = searchParams;
  const category = 'style'
  const barLabel = `${cate || ''} blogs`.trim()
  const { background, color } = categoryStyles[category]

  return (
    <div>
      <CategoryBar label={barLabel} backgroundColor={background} textColor={color} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 py-8">
              {/* CardList - 7/9 width */}
              <div className="w-full lg:w-6/9 flex-shrink-0">
                <CardList page={page} cate={cate ?? ''}/>
              </div>
              
              {/* MenuList - 2/9 width */}
              <div className="w-full lg:w-3/9">
                <MenuList />
              </div>
            </div>
          </div>
    </div>
  )
}

export default page
