'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Moon, Sun, LogOut, User } from 'lucide-react'
import { useTheme } from "next-themes"
import { useSession, signOut } from "next-auth/react"
import Image from 'next/image'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { setTheme, theme } = useTheme()
  const { data: session, status } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const closeSheet = () => {
    setIsSheetOpen(false)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const socialLinks = [
    { 
      name: 'Facebook', 
      href: 'https://www.facebook.com/profile.php?id=61576770253950', 
      iconUrl: '/social/facebook.png'
    },
    { 
      name: 'Instagram', 
      href: 'https://www.instagram.com/_dakshh04/?__pwa=1', 
      iconUrl: '/social/instagram.png'
    },
    { 
      name: 'Youtube', 
      href: 'https://www.youtube.com/@myera7047', 
      iconUrl: '/social/youtube.jpg'
    },
    { 
      name: 'Twitter', 
      href: 'https://x.com/_dakshh04', 
      iconUrl: '/social/twitter.png'
    }
  ]

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Write', href: '/write' },
    { name: 'Contact', href: '/contact' }
  ]

  const authItems = [
    { name: 'Sign In', href: '/api/auth/signin' },
    { name: 'Sign Up', href: '/api/auth/signup' }
  ]

  return (
    <>
    <nav className="sticky top-0 z-50 backdrop-blur bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Social Links */}
          <div className="flex items-center space-x-1 md:space-x-3">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="hover:opacity-80 p-1 rounded-full"
                aria-label={social.name}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <Image
                    src={social.iconUrl}
                    alt={social.name}
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* Center: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="ml-2 md:ml-5 text-2xl font-bold text-foreground hover:text-muted-foreground">
              blogs
            </Link>
          </div>

          {/* Right: Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-muted-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring relative cursor-pointer"
              aria-label="Toggle theme"
            >
              {mounted ? (
                <>
                  <Sun className="h-5 w-5 dark:hidden" />
                  <Moon className="h-5 w-5 hidden dark:block" />
                </>
              ) : (
                <div className="h-5 w-5" />
              )}
            </button>

            {/* Navigation Links */}
            <div className="flex items-baseline space-x-0">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-muted-foreground px-3 py-2 rounded-md text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Authentication Section */}
            <div className="flex items-center space-x-0">
              {status === "loading" ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
              ) : session ? (
                // Authenticated User Dropdown
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 text-foreground hover:text-muted-foreground px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                    <span className="hidden lg:block">{session.user?.name || 'User'}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{session.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="cursor-pointer text-red-600 dark:text-red-400"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Unauthenticated User Links
                authItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-foreground hover:text-muted-foreground px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsSheetOpen(true)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-muted-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring"
              aria-label="Open navigation menu"
            >
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile Sheet */}
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left font-extrabold">blogs</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <div className="flex flex-col space-y-4">
            {/* User Info (Mobile) */}
            {session && (
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{session.user?.name}</span>
                  <span className="text-xs text-muted-foreground">{session.user?.email}</span>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-muted-foreground block px-3 py-2 rounded-md text-base font-medium"
                  onClick={closeSheet}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Authentication Section (Mobile) */}
            <div className="space-y-1">
              {status === "loading" ? (
                <div className="h-10 bg-muted animate-pulse rounded"></div>
              ) : session ? (
                <>
                  <button
                    onClick={() => {
                      handleSignOut()
                      closeSheet()
                    }}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 block px-3 py-2 rounded-md text-base font-medium w-full text-left cursor-pointer"
                  >
                    <LogOut className="inline mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  {authItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-foreground hover:text-muted-foreground block px-3 py-2 rounded-md text-base font-medium flex-1 text-center border border-border cursor-pointer"
                      onClick={closeSheet}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
    </>
  )
}

export default Navbar
