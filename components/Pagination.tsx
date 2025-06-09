"use client"

import React from 'react'
import { useRouter } from 'next/navigation';

interface PaginationProps {
  page: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

const Pagination = ({ page, hasPrevious, hasNext }: PaginationProps) => {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center py-8">
      {/* Previous Button */}
      <button
        className={`px-6 py-3 font-medium transition-colors bg-red-500 text-white hover:bg-red-600 ${
          !hasPrevious 
            ? 'opacity-50 cursor-not-allowed bg-red-300 hover:bg-red-300' 
            : 'cursor-pointer'
        }`}
        onClick={() => router.push(`?page=${page - 1}`)}
        disabled={!hasPrevious}
      >
        Previous
      </button>

      {/* Next Button */}
      <button
        className={`px-6 py-3 font-medium transition-colors bg-red-500 text-white hover:bg-red-600 ${
          !hasNext 
            ? 'opacity-50 cursor-not-allowed bg-red-300 hover:bg-red-300' 
            : 'cursor-pointer'
        }`}
        onClick={() => router.push(`?page=${page + 1}`)}
        disabled={!hasNext}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
