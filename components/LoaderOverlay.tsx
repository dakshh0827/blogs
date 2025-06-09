'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function LoaderOverlay() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const timeout = setTimeout(() => {
      setLoading(false)
    }, 500) // fake loading delay; tune this if needed

    return () => clearTimeout(timeout)
  }, [pathname, searchParams?.toString()])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-sm">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-white" />
    </div>
  )
}
